import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-create-site',
  templateUrl: './create-site.component.html',
  styleUrls: ['./create-site.component.scss']
})

export class CreateSiteComponent {

  globalSettings:any;
  createForm: any = FormGroup;
  dataTypes:any =  [
    {
      id: 'text',
      text: 'Text'
    },
    {
      id: 'integer',
      text: 'Integer'
    },    
    {
      id: 'boolean',
      text: 'Boolean' 
    },
    {
      id: 'float',
      text: 'Float'
    },
    {
      id: 'array',
      text: 'Array' 
    },
    {
      id: 'date',
      text: 'Date'
    },
    {
      id: 'timestamp',
      text: 'Timestamp' 
    }
  ];
  msg = '';

  dynamic_key:any;

  formFields:any = [];

  defaultValue:any = {
    value:'text'
  };

  defaultParam = [
    {
      id:'key',
      value: 'Key'
    },
    {
      id:'type',
      value: 'Type'
    },
  ];
  
  keyValue:any = '';

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.helperService.showloader();  
    this.buildForm();
  }

  // form control
  get formControl() {
    return this.createForm.controls;
  }

  // populate form
  buildForm() {
    this.formFields.push(this.defaultParam);

    const formGroupFields:any = {};
    formGroupFields['key'] = new FormControl("",[Validators.required]);
    formGroupFields['type'] = new FormControl("",[Validators.required]);

    this.createForm = new FormGroup(formGroupFields);

    this.onChange(this.defaultValue);
  }

  // on change
  onChange(e:any) {

    let dynamic_key = `${e.value}_value`; 

    this.formFields = [];
    const formGroupFields:any = {};
    
    formGroupFields['type'] = new FormControl(e.value, [Validators.required]);
    formGroupFields['key'] = new FormControl(this.keyValue,[Validators.required]);
    
    if(e.value == 'integer') {
      formGroupFields[dynamic_key] = new FormControl("",[Validators.pattern("^[0-9]*$"),Validators.required]);
    } else if(e.value == 'boolean') {      
      formGroupFields[dynamic_key] = new FormControl(false,[Validators.required]);
    } else if(e.value == 'float') {
      formGroupFields[dynamic_key] = new FormControl('',[Validators.pattern("[+-]?([0-9]*[.])?[0-9]+"),Validators.required]);
    } else if(e.value == 'array') {
      formGroupFields[dynamic_key] = this.formBuilder.array([]);
      setTimeout(() => {
        this.addDescription();
      }, 1000);
    } else {
      formGroupFields[dynamic_key] = new FormControl("",[Validators.required]);
    }

    this.createForm = new FormGroup(formGroupFields);

    let defaultParam = [
      {
        id:'type',
        value: 'Type'
      },
      {
        id:'key',
        value: 'Key'
      },      
      {
        id: dynamic_key,
        value: `${this.capitalize(e.value)} Value`,
      }
    ];
    
    this.formFields = defaultParam;

  }

  // capitalize
  capitalize(s:any) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  // submit
  submit() {
    
    if (this.createForm.valid) {

      this.helperService.showloader();

      let params: any = this.createForm.value;
      let url = 'auth/admin/settings';

      this.helperService.post(url, params).subscribe(
        (res: any) => {
          if (res.status) {
            this.msg = res.message;
            this.createForm.reset();
            this.helperService.getSiteSettings();
            this.buildForm();
          } else {
            this.msg = res.message;
          }

          this.helperService.snackPositionTopCenter(this.msg);
          this.helperService.hideloader();
        },
        (err: any) => {
          this.helperService.hideloader();
          console.log(err);
      });
    };

  }
  
  get array_values() {
    return this.createForm.get('array_value') as FormArray;
  }

  addDescription() {
    this.array_values.push(new FormControl('',[Validators.required]));
  }

  removeDescription(index: number) {
    if(this.array_values.length > 1) {
      this.array_values.removeAt(index);
    }
  }


}
