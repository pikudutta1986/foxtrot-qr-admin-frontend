import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  backendUrl = environment.apiBase;
  access_token:any = '';
  isSidebarToggled = new Subject<boolean>();
  userName = new Subject<any>();

  constructor(private http: HttpClient) {
    this.access_token = sessionStorage.getItem('token');
    console.log(this.access_token,'at')
  }

  // get request
  get(url: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    const requestOptions = { headers: headers };
    return this.http.get(`${this.backendUrl}${url}`, requestOptions);
  }

  // post request
  post(url: any, param: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
    const requestOptions = { headers: headers };
    return this.http.post(`${this.backendUrl}${url}`, param, requestOptions);
  }

  validateEmail(email: any) {
    if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(email)) {
      return true;
    }
    return false;
  }


}
