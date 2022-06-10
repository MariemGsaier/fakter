import { Datedevise } from "./datedevise.model";

export interface LigneDevise {
  nom?: string;
  devise?: string;
  dates: Datedevise[];
}
