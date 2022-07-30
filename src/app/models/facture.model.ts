export interface Facture {
  id?: any;
  reference?: string;
  date_facturation: Date;
  date_echeance: Date;
  etat_facture?: boolean;
  date_paiement: Date;
  etat_echeance?: boolean;
  archive?: boolean;
  total_ht: number;
  total_ttc: number;
  num_boncommande? : number;
  total_devise?: number;
  devise? :{
    nom : string;
    devise : string;
  }
  nom_user?: string;
  compte? : {
    num_compte : string;
    iban?: string;
    rib?: string;
  }
  client?: {
    nom?: string;
  };
  article?: {
    nom_article?: string;
    prix? : number;
  }
}
