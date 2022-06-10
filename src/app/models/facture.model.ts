export interface Facture {
  id?: any;
  reference?: string;
  date_facturation: Date;
  date_echeance: Date;
  etat_facture?: string;
  etat_echeance?: boolean;
  total_ht?: number;
  total_ttc: number;
  total_devise?: number;
  nom_devise?: string;
  nom_user?: string;
  client?: {
    nom?: string;
  };
  article?: {
    nom_article?: string
  }
}
