import { Prixarticle } from "./prixarticle.model";

export interface LignePrix {
  nom_article?: string;
  type_article?: string;
  description?: string;
  archive?: boolean;
  prix:Prixarticle[];
}
