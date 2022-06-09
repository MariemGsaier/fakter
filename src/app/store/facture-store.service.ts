import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { cloneDeep } from 'lodash';
import { AddFacture } from '../models/add-facture.model';

@Injectable({
  providedIn: 'root'
})
export class FactureStoreService {

  facture : AddFacture = {};
  private factureStore = new BehaviorSubject <AddFacture>(this.facture);

  constructor() { }

  public setFactureInStore(newData : Partial<AddFacture>):void {
    const oldData=this.getFactureFromStore();
    const newFacture={
     ...oldData,
    ...newData
      }
     this.factureStore.next(newFacture);
  }

  public resetFactureStore():void{
    this.factureStore.next({});
  }

   public getFactureFromStore(): AddFacture{
   return cloneDeep(this.factureStore.getValue());

   }
}
