export class AddFacture {
    id?: any;
    reference?: string;
    num_bc?:string;
    date_facturation?: Date;
    date_echeance?: Date;
    date_paiement?:Date;
    etat_facture?: boolean;
    etat_echeance?: boolean;
    archive?: boolean;
    total_ht?: number;
    total_ttc?: number;
    total_devise?: number;
    nom_devise?: string;
    id_user?: number;
    id_client?: number;
    num_compte?: string;
}
