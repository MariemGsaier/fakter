export class HistoriqueLignePrix {
  id?: any;
  prix?: number;
  cout?: number;
  date?: Date;
  articles?: {
    nom_article?: string;
    type_article?: string;
    description?: string;
    archive?: boolean;
  };
}
