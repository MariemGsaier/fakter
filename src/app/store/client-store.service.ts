import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import { cloneDeep } from 'sequelize/types/utils';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientStoreService {
  client : Client = {};
  private clientStore = new BehaviorSubject <Client>(this.client);

  constructor() { }

  public setClientInStore(newData : Partial<Client>):void {
    const oldData=this.getClientFromStore();
    const newClient={
      ...oldData,
      ...newData
    }
    this.clientStore.next(newClient);
  }

  public getClientFromStore(): Client{
    return cloneDeep(this.clientStore.getValue());

  }

}
