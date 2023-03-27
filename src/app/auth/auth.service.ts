

// IMPORTING Injectable FROM ANGULAR CORE.
import {Injectable} from '@angular/core';

// IMPORTING THE ANGULAR COMMON DATA.
import {HttpClient, HttpHeaders} from '@angular/common/http';

// IMPORTING THE ENVIRONMENT MODULE
import {environment} from "../../environments/environment";
import { Observable } from 'rxjs';

// INJECTING TO THE APP PROVIDER SO THAT WE CAN USE IT THROUGHOUT THE APPLICATION.
@Injectable({
  providedIn: 'root'
})

// DECLARING THE AuthService CLASS WITH EXPORT SO THAT WE CAN USE THIS CLASS IN OTHER FILES.
export class AuthService
{
  // GET THE API BASE.
  public apiBase = environment.apiBase;
 
  user_id:any = '';
  username:any = '';
  // CLASS CONSTRUCTOR, THIS WILL BE THE FIRST FUNCTION TO BE EXECUTED WHEN THIS CLASS LOADS.
  // HERE WE WILL TELL ANGULAR TO INJECT A DEPENDENCY BY SPECIFYING A CONSTRUCTOR
  // PARAMETER WITH THE DEPENDENCY TYPE.
  constructor  (private http: HttpClient) {
    
  }

  // CALL THIS FUNCTION WITH USERNAME AND PASSWORD TO MAKE LOGIN.
  doLogin (email: string, password: string)
  {
    return this.http.post (this.apiBase + 'auth/admin/login', { email, password });
  }

  getAccessToken() {
    return sessionStorage.getItem('admin_token');
  }

  getUserId() {
    return sessionStorage.getItem ('user_id')
  }

  getUserName() {
    return sessionStorage.getItem('user_name');
  }

  // CALL THIS FUNCTION FOR FORGET PASSWORD LINK TO USER MAIL ID
  forgetPassword (emailAddress: string)
  {
    return this.http.post (this.apiBase + 'auth/forgetpassword', {email: emailAddress});
  }

  // CALL THIS FUNCTION FOR RESET PASSWORD
  resetPassword (password: string)
  {
    return this.http.post (this.apiBase + 'auth/resetpassword', {hashcode: sessionStorage.getItem ('hashcode'), password: password});
  }

  // CALL THIS FUNCTION FOR LOGIN CHECK
  isLoggedIn() 
  {
    // IF USER ID IS FOUND IN SESSION STORAGE.
    if (sessionStorage.getItem ('admin_token'))
    {
      // RETURN TRUE
      return true;
    }
    
    // RETURN FALSE
    return false;
  }

  // THIS FUNCTION WILL BE CALLED TO LOGOUT.
  logout() 
  {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAccessToken()}`
    });
    const requestOptions = { headers: headers };    
    let data = {
      user_id: this.getUserId()
    };
    return this.http.post(this.apiBase + 'auth/logout', data, requestOptions);
    // REMOVE THE SESSION STORAGE.    
  }
}
