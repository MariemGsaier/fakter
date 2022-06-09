export interface Facture {
  id?: any;
  reference?: string;
  vendeur?: string;
  date_facturation?: Date;
  date_echeance?: Date;
  etat_facture?: string;
  etat_echeance?: boolean;
  total_ht?: number;
  total_chiffres?: number;
  total_lettres?: string;
  total_devise?: number;
  nom_devise?: string;
  créé_par?: string;
  nom_client?: string;
  num_compte?: string;
}
