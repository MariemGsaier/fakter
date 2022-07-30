import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";
import { Facture } from "src/app/models/facture.model";
import { DeviseService } from "src/app/services/devise.service";
import { FactureService } from "src/app/services/facture.service";

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = $localize`Première page`;
  itemsPerPageLabel = $localize`Items par page:`;
  lastPageLabel = $localize`Dernière page`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = "Page suivante";
  previousPageLabel = "Page précédente";

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} de ${amountPages}`;
  }
}

@Component({
  selector: "app-factures-dash",
  templateUrl: "./factures-dash.component.html",
  styleUrls: ["./factures-dash.component.scss"],
  providers: [{ provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl }],
})
export class FacturesDashComponent implements OnInit {
  displayedColumns: string[] = [
    "reference",
    "créé_par",
    "client",
    "date_facturation",
    "date_echeance",
    "etat_facture",
    "etat_echeance",
    "total_ht",
    "total_ttc",
    "total_devise",
    "nom_devise",
  ];
  dataSource = new MatTableDataSource<Facture>();
  paginator?: MatPaginator;
  filterValues: any = {};
  filterSelectObj: any[];
  conversionForm: FormGroup = new FormGroup({
    devise: new FormControl(""),
  });

  factures?: Facture[];
  devises = [
    {
      nom: "",
      devise: "",
    },
  ];
  selectedDevise = "DT";
  submitted = false;
  sommeTTC = 0;
  tauxChangeDevise: any = 0;
  totalConverti = 0;

  constructor(
    private factureService: FactureService,
    private deviseService: DeviseService,
    private formBuilder: FormBuilder
  ) {
    this.filterSelectObj = [
      {
        name: "Référence",
        columnProp: "reference",
        options: [],
      },
      {
        name: "Client",
        columnProp: "client",
        options: [],
      },
      {
        name: "Date de facturation",
        columnProp: "date_facturation",
        options: [],
      },
      {
        name: "Date d'échéance",
        columnProp: "date_echeance",
        options: [],
      },
      {
        name: "Etat de facture",
        columnProp: "etat_facture",
        options: [],
      },
      {
        name: "Etat d'échéance",
        columnProp: "etat_echeance",
        options: [],
      },
      {
        name: "Nom de devise",
        columnProp: "nom_devise",
        options: [],
      },
    ];
  }

  ngOnInit(): void {
    this.fetchFactures();
    this.getDevises();
    this.dataSource.filterPredicate = this.createFilter();
    this.conversionForm = this.formBuilder.group({
      devise: ["", Validators.required],
    });
  }
  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.paginator = paginator;

    if (this.dataSource) {
      this.dataSource.paginator = paginator;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.conversionForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.conversionForm.invalid) {
      return;
    }
  }
  // récupérer objets filtrés
  getFilterObject(fullObj: any, key: any) {
    const uniqChk = [{}];
    uniqChk.shift();
    fullObj.filter((obj: any) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }
  changeDevise(data: any) {
    // console.log(data);
    
    this.convertirDevise()
  }

  getDevises() {
    this.deviseService.getAllDevises().subscribe({
      next: (data) => {
        // console.log(data);
        this.devises = data.map((data: any) => {
          return {
            nom: data.nom,
            devise: data.devise,
          };
        });
        console.log(this.devises);
      },
    });
  }
  //création du filtre
  createFilter() {
    let filterFunction = function (data: any, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== "") {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }

      // console.log(searchTerms);

      let nameSearch = () => {
        let found = false;
        if (isFilterSet) {
          for (const col in searchTerms) {
            searchTerms[col]
              .trim()
              .toLowerCase()
              .split(" ")
              .forEach((word: any) => {
                if (
                  data[col].toString().toLowerCase().indexOf(word) != -1 &&
                  isFilterSet
                ) {
                  found = true;
                }
              });
          }
          return found;
        } else {
          return true;
        }
      };
      return nameSearch();
    };
    return filterFunction;
  }
  fetchFactures(): void {
    this.factureService
      .getAllFactDetailed()

      .subscribe(
        (data) => {
          this.factures = data;
          let facturemodified = this.factures.map((elem: any) => {
            elem.client = elem.client.nom;
            return elem;
          });
          this.dataSource.data = facturemodified;

          this.filterSelectObj.filter((o) => {
            o.options = this.getFilterObject(facturemodified, o.columnProp);
          });

          // console.log(data);
          this.getTTC();

        },
        (error) => {
          console.log(error);
        }
      );
  }

  getTTC(): void {
    let totalttc = this.dataSource.data.map((res) => {
      return res.total_ttc;
    });
    this.sommeTTC = 0;
    totalttc.forEach((element) => {
      this.sommeTTC = this.sommeTTC + element;
      this.totalConverti = this.sommeTTC
    });
  }
  convertirDevise(): void {
    this.deviseService.getAllRecent().subscribe({
      next: (data) => {
        this.tauxChangeDevise = 0;
        this.totalConverti = 0
        for (let i = 0; i <= data.length; i++) {
          if (
            data[i]?.nom == this.selectedDevise &&
            data[i].dates.length != 0
          ) {
            this.tauxChangeDevise = data[i].dates[0].valeur;
            this.totalConverti = this.tauxChangeDevise * this.sommeTTC;
          }
        }
      },
      error: (e) => console.error(e),
    });
  }

  // Called on Filter change
  filterChange(filter: any, event: any) {
    //let filterValues = {}
    // console.log(filter, event);

    this.filterValues[filter.columnProp] = (
      event.target as HTMLInputElement
    ).value
      .trim()
      .toLowerCase();
    // console.log(this.filterValues);
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  
  resetFilters() {
    this.filterValues = {};
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = undefined;
    });
    this.dataSource.filter = "";
  }
}
