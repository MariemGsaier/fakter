import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { cloneDeep } from 'lodash';
import { AddFacture } from '../models/add-facture.model';

@Injectable({
  providedIn: 'root'
})
export class FactureStoreService {

  facture : any = {};
  private factureStore = new BehaviorSubject <any>(this.facture);

  constructor() { }

  public setFactureInStore(newData : Partial<any>):void {
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

   public getFactureFromStore(): any{
   return cloneDeep(this.factureStore.getValue());

   }
}
