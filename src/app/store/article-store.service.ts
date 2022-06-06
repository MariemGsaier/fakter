import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import { cloneDeep } from 'lodash';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleStoreService {
  article : Article = {};
  private articleStore = new BehaviorSubject <Article>(this.article);

  constructor() { }

  public setArticleInStore(newData : Partial<Article>):void {
    const oldData=this.getArticleFromStore();
    const newArticle={
     ...oldData,
    ...newData
      }
     this.articleStore.next(newArticle);
  }

  public resetArticleStore():void{
    this.articleStore.next({});
  }

   public getArticleFromStore(): Article{
   return cloneDeep(this.articleStore.getValue());

   }
}
