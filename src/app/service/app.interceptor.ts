import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { HelperService } from './helper.service';
import { Router } from '@angular/router';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(private helperService: HelperService,
    private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // return next.handle(request);
    return next.handle(request)
    .pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
              console.log(err.error);
              if(this.helperService.browserLogout()) {
                this.router.navigate((['/']));
              }
          } else {
            this.helperService.error.next(err.error);
          } 
          console.log(err,'error')
        }
        return new Observable<HttpEvent<any>>();
      })
  );
  }
}
