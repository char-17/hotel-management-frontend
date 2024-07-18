import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  // @ts-ignore
  getTranslation(lang: string): Observable<any> {
    console.log('translationadded')
  }
}
