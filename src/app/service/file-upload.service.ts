import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  access_token = '';
  user_id:any = '';

  private baseUrl = environment.apiBase;

  constructor(private http: HttpClient) {
    let token = sessionStorage.getItem('token');
    this.user_id = sessionStorage.getItem('user_id');
    if(token) {
      this.access_token = token;
      console.log(this.access_token);
    }
  }

  upload(file: any, formValue:any): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();
    console.log(formValue,'fv')

    formData.append('file', file);
    formData.append('user_id', this.user_id);
    formData.append('text', formValue.text);
    formData.append('qrtype', formValue.qrtype);

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access_token}`
    });
    const requestOptions:any = { headers: headers, reportProgress: true, observe: 'events' };

    const req = new HttpRequest('POST', `${this.baseUrl}upload`, formData, requestOptions);

    return this.http.request(req).pipe(catchError(this.errorMgmt));
    
  }

  getFiles() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access_token}`
    });
    const requestOptions:any = { headers: headers, reportProgress: true,  responseType: 'json'};
    const data = {
      user_id: this.user_id
    };

    return this.http.post(`${this.baseUrl}files`, data, requestOptions);

    // const req = new HttpRequest('POST', `${this.baseUrl}files`, data, requestOptions);
    // return this.http.request(req);
    // return this.http.post(`${this.baseUrl}files`,requestOptions);
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}