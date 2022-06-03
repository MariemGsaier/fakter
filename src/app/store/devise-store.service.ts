import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import { cloneDeep } from 'lodash';
import { Devise } from '../models/devise.model';

@Injectable({
  providedIn: 'root'
})
export class DeviseStoreService {

  devise : Devise = {};
  private deviseStore = new BehaviorSubject <Devise>(this.devise);

  constructor() { }

  public setDeviseInStore(newData : Partial<Devise>):void {
    const oldData=this.getDeviseFromStore();
    const newDevise={
     ...oldData,
    ...newData
      }
     this.deviseStore.next(newDevise);
  }

  public resetDeviseStore():void{
    this.deviseStore.next({});
  }

   public getDeviseFromStore(): Devise{
   return cloneDeep(this.deviseStore.getValue());

   }
}
