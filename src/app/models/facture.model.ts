export class Facture {
  id?: any;
  reference?: string;
  vendeur?: string;
  date_facturation?: Date;
  date_echeance?: Date;
  etat_facture?: boolean;
  etat_echeance?: boolean;
  total_ht?: number;
  total_chiffres?: number;
  total_lettres?: number;
  total_devise?: number;
}
