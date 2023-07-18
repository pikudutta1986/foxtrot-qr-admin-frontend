import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from './../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class HelperService {

  backendUrl = environment.apiBase;
  access_token: any = '';
  isSidebarToggled = new Subject<boolean>();
  userName = new Subject<any>();
  searchInput = new Subject<any>();
  mediaUrl:any;

  allUsers: any;
  allPlans: any;
  allPricings: any;
  settings: any;
  allPayments:any;

  error = new Subject<any>();

  constructor(private http: HttpClient, private _snackBar: MatSnackBar,) {
    this.access_token = localStorage.getItem('admin_token');
  }

  // get request
  get(url: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access_token}`
    });
    const requestOptions = { headers: headers };
    return this.http.get(`${this.backendUrl}${url}`, requestOptions);
  }

  // post request
  post(url: any, param: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access_token}`
    });
    const requestOptions = { headers: headers };
    return this.http.post(`${this.backendUrl}${url}`, param, requestOptions);
  }

  // patch request
  patch(url: any, param: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access_token}`
    });
    const requestOptions = { headers: headers };
    return this.http.patch(`${this.backendUrl}${url}`, param, requestOptions);
  }

  // delete request
  delete(url: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access_token}`
    });
    const requestOptions = { headers: headers };
    return this.http.delete(`${this.backendUrl}${url}`, requestOptions);
  }

  // raw get request
  rawGet(url: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access_token}`
    });
    const requestOptions = { headers: headers };
    return this.http.get(`${url}`, requestOptions);
  }

  validateEmail(email: any) {
    if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(email)) {
      return true;
    }
    return false;
  }

  hideloader() {
    let d: any = document;
    d.getElementById('overlay').style.display = 'none';
  }

  showloader() {
    let d: any = document;
    d.getElementById('overlay').style.display = 'block';
  }

  // if unauthenticated auto logout 
  browserLogout() {
    localStorage.clear();
    sessionStorage.clear();
    return true;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // top position snackbar
  snackPositionTopCenter(message: any) {
    this._snackBar.open(message, "", {
      duration: 7000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }

  // set plans
  setPlans() {
    let params = 'auth/admin/plans';
    this.get(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.allPlans = res.plans;
        } else {
          this.allPlans = [];
        }
      },
      (e: any) => {
        console.log(e);
      });
  }

  // get all pricings
  getAllPricings() {
    let params = 'auth/admin/pricings ';
    this.get(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.allPricings = res.pricings;
        } else {
          this.allPricings = [];
        }
      },
      (err: any) => {
        console.log(err);
      });

  }

  // get all users
  getAllUsers() {
    let params = 'auth/admin/users';
    this.get(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.allUsers = res.users;
        } else {
          this.allUsers = [];
        }
      },
      (e: any) => {
        console.log(e);
      });
  }

  // get site settings
  getSiteSettings() {
    let params = 'auth/admin/settings';
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access_token}`
    });
    const requestOptions = { headers: headers };
    return this.http.get(`${this.backendUrl}${params}`, requestOptions)
      .subscribe((res: any) => {
        if (res.success) {
          this.settings = res.settings;
          if(this.settings) {
            let result = this.settings.filter((x:any) => x.key == 'assets_base');
            if(result.length > 0) {
              this.mediaUrl = result[0].text_value;
            }
          }
        } else {
          this.settings = [];
        }
        // return res;
      });
  }

  getAllPayments() {
    let params = 'auth/admin/payments';
    this.get(params).subscribe(
      (res: any) => {
        if (res.success) {
          this.allPayments = res.pricings;
        } else {
          this.allPayments = [];
        }
      },
      (e: any) => {
        console.log(e);
      });
  }

  // get cookies
  getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  // set cookies
  setCookie(name: string, value: string, expireDays: number, path: string = '') {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  // cookies destroy
  deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }


}
