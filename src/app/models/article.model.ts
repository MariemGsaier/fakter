export class Article {
  nom_article?: string;
  type_article?: string;
  cout?: number;
  description?: string;
  facture?: [{
    total_ht : number;
    total_ttc: number;
  }]
}
