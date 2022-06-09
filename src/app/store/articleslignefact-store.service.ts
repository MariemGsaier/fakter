import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import { cloneDeep } from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class ArticleslignefactStoreService {

  articlesLigneFact: Array<any> = []
  private articlesLigneFactStore = new BehaviorSubject <Array<any>>(this.articlesLigneFact);

  constructor() { }

  public setArticlesInStore(newData : Partial<Array<any>>):void {
    const oldData=this.getArticlesFromStore();
    const newArticle= oldData.concat(newData);
      
     this.articlesLigneFactStore.next(newArticle);
  }

  public resetArticleStore():void{
    this.articlesLigneFactStore.next([]);
  }

   public getArticlesFromStore(): Array<any>{
   return cloneDeep(this.articlesLigneFactStore.getValue());

   }
}
