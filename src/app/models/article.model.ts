export class Article {
  nom_article?: string;
  type_article?: string;
  description?: string;
  archive?: boolean;
  facture?: [{
    total_ht : number;
    total_ttc: number;
  }]
}
