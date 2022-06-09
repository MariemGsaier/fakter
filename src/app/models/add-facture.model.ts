export class AddFacture {
    id?: any;
    reference?: string;
    num_bc?:string;
    date_facturation?: Date;
    date_echeance?: Date;
    etat_facture?: string;
    etat_echeance?: boolean;
    total_ht?: number;
    total_ttc?: number;
    total_devise?: number;
    nom_devise?: string;
    id_user?: number;
    id_client?: number;
    num_compte?: string;
}
