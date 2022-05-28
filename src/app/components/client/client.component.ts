import { Component, OnInit,ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Client } from "src/app/models/client.model";
import { ClientService } from "src/app/services/client.service";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { MatPaginator } from "@angular/material/paginator";
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.scss"],
})
export class ClientComponent implements OnInit {
  searchTerm : any;
  search: boolean = false;
  displayedColumns: string[] = [
    "code_identification",
    "nom",
    "numtel",
    "adresse",
    "courriel",
    "siteweb",
    "actions",
  ];
  dataSource = new MatTableDataSource<Client>();
  // content?: string;
  currentClient: Client = {
    code_identification:"",
    nom: "",
    adresse: "",
    numtel: undefined,
    courriel: "",
    siteweb: ""
  };
  disabelModif: boolean = false;
  message = "";
  clients?: Client[];
  currentIndex = -1;

    clientForm: FormGroup = new FormGroup({
    
    email: new FormControl(''),
    phone: new FormControl(''),
    website: new FormControl(''),
    nomclt: new FormControl(''),
    adresse: new FormControl('')
    
  });
  submitted = false;
  paginator?: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private formBuilder: FormBuilder
  ) {}

  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  ngOnInit(): void {
    this.fetchClients();
    this.clientForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
        phone: ['', [ Validators.required,Validators.pattern("^[0-9]*$")]],
        website: ['', Validators.pattern("^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$")],
        nomclt: ['', [Validators.required,Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
        adresse: ['', Validators.required]
      }
       
    );
  }
    
  get f(): { [key: string]: AbstractControl } {
    return this.clientForm.controls;
    
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.clientForm.invalid) {
      return;
    }
  }
  onReset(): void {
    this.submitted = false;
    this.clientForm.reset();
  }
  fetchClients(): void {
    this.clientService
      .getAll()

      .subscribe({
        next: (data) => {
          this.clients = data;
          this.dataSource.data = this.clients;
          console.log(data);
        },
        error: (e) => console.error(e),
      });
  }

  refreshList(): void {
    this.fetchClients();
    this.currentClient = {};
    this.currentIndex = -1;
  }
  setActiveClient(client: Client, index: number): void {
    this.currentClient = client;
    console.log(client);
    this.currentIndex = index;
    this.disabelModif = true;
  }
  removeAllClients(): void {
    Swal.fire({
      title: "Êtes-vous sûr de tout supprimer ? ",
      text: "Vous ne serez pas capable de restaurer !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c292",
      cancelButtonColor: "#e46a76",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.deleteAll().subscribe({
          next: (res) => {
            console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e),
        });
      }
    });
  }

  updateClient(): void {
    Swal.fire({
      title: "Le client  est mis à jour avec succés ! ",
      icon: "success",
      confirmButtonColor: "#00c292",
      confirmButtonText: "Ok"
    }) .then((result) => {
      if (result.isConfirmed) {
      this.clientService
        .update(this.currentClient.code_identification, this.currentClient)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.disabelModif = false;
          },
          error: (e) => console.error(e),
        });
      }
    })
  }
  deleteClient(client: Client): void {
    Swal.fire({
      title: "Êtes-vous sûr de le supprimer ? ",
      text: "Vous ne serez pas capable de le récupérer !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00c292",
      cancelButtonColor: "#e46a76",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.delete(client.code_identification).subscribe({
          next: (res) => {
            console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e),
        });
      }
    });
  }
  filterData($event : any){
    $event.target.value.trim();
    $event.target.value.toLowerCase();
    this.dataSource.filter = $event.target.value;
  }

  annuler(): void {
    this.disabelModif = false;
  }

}
