import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Facture } from 'src/app/models/facture.model';
import { FactureService } from 'src/app/services/facture.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-archive-facture',
  templateUrl: './archive-facture.component.html',
  styleUrls: ['./archive-facture.component.scss']
})
export class ArchiveFactureComponent implements OnInit {

  fileName = "FacturesSheet.xlsx";
  displayedColumns: string[] = [
    "référence",
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
    "actions"
  ];
  dataSource = new MatTableDataSource<Facture>();
  factures?: Facture[];
  paginator?: MatPaginator;
  private roles: string[] = [];
  isLoggedIn = false;
  showObserverBoard = true;

  constructor(private factureService: FactureService,  private tokenStorageService: TokenStorageService,) { }

  ngOnInit(): void {
    this.fetchFactures();
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

  unarchiveFacture(body:Facture){
    body.archive = false;
    this.factureService.update(body.id, body).subscribe({
      next: (res) => {
        // console.log(res)
       
        Swal.fire({
          title: "Facture restaurée avec succés !",
          icon: "success",
          confirmButtonColor: "#00c292",
        }).then((result) => {
          if (result.isConfirmed) {
           this.fetchFactures();
          }
        });
      }
    });

  }

  fetchFactures(): void {
    this.factureService
      .getAllFactDetailed()

      .subscribe(
        (data) => {
          this.factures = data;
          this.factures = data.filter(elm => elm.archive ==true );
          this.dataSource.data = this.factures;

          // console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
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
