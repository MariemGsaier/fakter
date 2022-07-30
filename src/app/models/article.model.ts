export class Article {
  nom_article?: string;
  type_article?: string;
  description?: string;
  archive?: boolean;
  prix?: [{
    id?: any;
    prix?: number,
    cout?: number,
    date?: Date,
  }];
  facture?: [{
    total_ht : number;
    total_ttc: number;
  }]
}
