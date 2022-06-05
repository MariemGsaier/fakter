export class LignePrix {
  id?: any;
  prix?: number;
  date?: Date;
  articles?: {
    nom_article?: string;
    type_article?: string;
    prix_vente?: number;
    cout?: number;
    description?: string;
  };
}
