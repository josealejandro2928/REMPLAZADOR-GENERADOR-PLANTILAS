import { environment } from './../../../../environments/environment';
import { IPagination } from './../../../core/classes/pagination.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class &[Name]&Service {
  url = environment.apiUrl + '&[na-me]&';
  urlId = environment.apiUrl + '&[na-me]&/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  create&[Name]&(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  edit&[Name]&(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  remove&[Name]&(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAll&[Names]&(query?: IPagination, params?: any) {
    let httpParams = new HttpParams();
    if (query) {
      Object.keys(query).map((keyQuery) => {
        if (query[keyQuery] != undefined && keyQuery !== "filter") {
          httpParams = httpParams.append(keyQuery, query[keyQuery] + "");
        }
      });
      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(
            item,
            "%" + query.filter.filterText + "%"
          );
        });
      }
    }
    if (params) {

      //startRemplace
      function run(schema){
        let result ='' 
        for(let key in schema){
          if(schema[key].showFieldInTable && schema[key].type == "STRING" || schema[key].type == "NUMBER" || schema[key].type == "LONG-STRING" 
          || schema[key].type == "JSON" || schema[key].type == "DATEONLY" || schema[key].type == "DATE" ){
            result += `if(params.${key} !=undefined){
              httpParams = httpParams.set(
                'filter[$and][${key}][$like]','%' + params.${key}.toString() + '%');
            }`
          }else if(schema[key].showFieldInTable && schema[key].type == "BOOLEAN"){
            result += `if(params.${key} !=undefined){
              httpParams = httpParams.set(
                'filter[$and][${key}]',params.${key}.toString());
            }`
          }else if(schema[key].showFieldInTable && schema[key].type != "IMAGE"){
            result += `if(params.${key} != undefined){
              if (params.${key}.constructor != Array) {
                httpParams = httpParams.set(
                  'filter[$and][${key}]',
                  params.${key}.toString()
                );
              }
              if (params.${key}.constructor == Array && params.${key}.length) {
                if (params.${key}.length == 1) {
                  httpParams = httpParams.set(
                    'filter[$and][${key}]',
                    params.${key}[0].toString()
                  );
                } else {
                  params.${key}.map((item) => {
                    httpParams = httpParams.append(
                      'filter[$and][${key}]',
                      item.toString()
                    );
                  });
                }
              }
            }`
          }

        }
        return result;
      }
      //endRemplace
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  get&[Name]&(data: any): Observable<any> {
    if (data.constructor == Object) {
      return this.httpClient.get<any>(this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}
