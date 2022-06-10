import { Prixarticle } from "./prixarticle.model";

export interface LignePrix {
  nom_article?: string;
  type_article?: string;
  cout?: number;
  description?: string;
  prix?:Prixarticle[];
}
