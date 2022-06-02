import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
// import { cloneDeep } from 'sequelize/types/utils';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  user : User = {};
  private userStore = new BehaviorSubject <User>(this.user);

  constructor() { }

  public setUserInStore(newData : Partial<User>):void {
    // const oldData=this.getUserFromStore();
    // const newUser={
    //    ...oldData,
    //    ...newData
    //  }
    //  this.userStore.next(newUser);
  }

  //  public getUserFromStore(): User{
  //   return cloneDeep(this.userStore.getValue());

  //  }
}
