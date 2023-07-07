import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {

  updateForm: any = FormGroup;
  selectedUserId:any;

  platforms:any = [
    {
      id:'web',
      text: 'Web'
    },
    {
      id:'android',
      text: 'Android'
    },
    {
      id:'ios',
      text: 'iOS'
    },
  ];

  validId:boolean = false;
  notificationMsg:any = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public helperService: HelperService) { }

  ngOnInit(): void {

    let params: any = this.route.snapshot.params;    
    this.selectedUserId = params.id;

    let currentUser:any = localStorage.getItem('currentEditedUser');
    currentUser = JSON.parse(currentUser);
    
    this.updateForm = this.formBuilder.group({
      device_id: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9 \-\']+')]],
      platform: ['', [Validators.required]],
      country_code: ['', [Validators.required]],
    });

    setTimeout(() => {
      if(currentUser) {
        if(currentUser.id == this.selectedUserId) {
          this.validId = true;
          this.updateForm.controls.device_id.setValue(currentUser.device_id);
          this.updateForm.controls.platform.setValue(currentUser.platform);
          this.updateForm.controls.country_code.setValue(currentUser.country_code);
        }
      }
    }, 1000);
   
  }

  get editFormControl() {
    return this.updateForm.controls;
  }

  // update user
  saveUser() {
    let url = `auth/admin/users/${this.selectedUserId}`;
    let data = this.updateForm.value;
    this.helperService.showloader();
    this.helperService.patch(url, data).subscribe((res: any) => {
      if (res.status) {
        this.notificationMsg = 'Successfully Updated';
        this.helperService.hideloader();
        this.snackPositionTopCenter();
      } else {
        this.helperService.hideloader();
      }

    },
      //Error callback
      (error) => {
        console.error('error caught in component')      
    })
  }

  // top position snackbar
  snackPositionTopCenter() {
    this._snackBar.open(this.notificationMsg, "", {
      duration: 7000,
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }

  // on destroy
  ngOnDestroy(): void {
    let currentUser:any = localStorage.getItem('currentEditedUser');
    currentUser = JSON.parse(currentUser);
    if(currentUser) {
      localStorage.removeItem('currentEditedUser');
    }    
  }

}
