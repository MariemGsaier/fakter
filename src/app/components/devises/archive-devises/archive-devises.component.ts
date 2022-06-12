import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Devise } from 'src/app/models/devise.model';
import { LigneDevise } from 'src/app/models/ligne-devise.model';
import { DeviseService } from 'src/app/services/devise.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-archive-devises',
  templateUrl: './archive-devises.component.html',
  styleUrls: ['./archive-devises.component.scss']
})
export class ArchiveDevisesComponent implements OnInit {
  fileName = "DevisesArchivéSheet.xlsx";
  searchTerm: any;
  search: boolean = false;
  displayedColumns: string[] = ["nom", "devise", "valeur", "date", "action"];
  dataSource = new MatTableDataSource<LigneDevise>();
  devises?: LigneDevise[];
  currentLigneDevise: LigneDevise = {
    nom: "",
    devise: "",
    archive: false,
    dates: [{
      id: undefined,
      date: new Date(),
      valeur: undefined,
    }],
  };
  currentIndex = -1;
  disabelModif: boolean = false;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;
  paginator?: MatPaginator;
  constructor(private deviseService: DeviseService,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.fetchDevises();
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.role;
      this.showObserverBoard = this.roles.includes("Observateur");
    }
  }

  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  setActiveDevise(devise: LigneDevise, index: number): void {
    this.currentLigneDevise = devise;
    console.log(devise);
    this.currentIndex = index;
    this.disabelModif = true;
  }

  unarchiveDevise(body:Devise){
    body.archive = false;
    this.deviseService.update(body.archive, body).subscribe({
      next: (res) => {console.log(res)
        Swal.fire({
          title: "Article restauré avec succés !",
          icon: "success",
          confirmButtonColor: "#00c292",
        }).then((result) => {
          if (result.isConfirmed) {
            this.fetchDevises()
          }
        });
      }
    });

  }
  fetchDevises(): void {
    this.deviseService.getAllRecent().subscribe({
      next: (data) => {
        this.devises = data;
        this.devises = data.filter(elm => elm.archive == true );
        this.dataSource.data = this.devises;
        console.log(data);
      },
      error: (e) => {
        console.error(e);
        Swal.fire({
          title: "Echec d'affichage des devises archivées !",
          text: "Une erreur est survenue lors du chargement de la liste des devises.",
          icon: "warning",
          confirmButtonColor: "#00c292",
          confirmButtonText: "Ok",
        });
      },
    });
  }
  
  filterData($event: any) {
    $event.target.value.trim();
    $event.target.value.toLowerCase();
    this.dataSource.filter = $event.target.value;
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
