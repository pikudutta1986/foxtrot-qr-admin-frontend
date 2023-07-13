import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss']
})
export class EditSiteComponent {

  globalSettings: any;
  editForm: any = FormGroup;
  currentSettingsId: any;

  dataTypes: any = [
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

  dynamic_key: any;

  formFields: any = [];

  defaultValue: any = {
    value: 'text'
  };

  defaultParam = [
    {
      id: 'key',
      value: 'Key'
    },
    {
      id: 'type',
      value: 'Type'
    },
  ];

  keyValue: any = '';

  editableData: any;

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.helperService.showloader();
    let params: any = this.route.snapshot.params;
    this.currentSettingsId = params.id;
    this.buildForm();
  }

  // populate form
  buildForm() {
    this.formFields.push(this.defaultParam);

    const formGroupFields: any = {};
    formGroupFields['key'] = new FormControl("", [Validators.required]);
    formGroupFields['type'] = new FormControl("", [Validators.required]);

    this.editForm = new FormGroup(formGroupFields);

    this.onChange(this.defaultValue);

    this.getSettings();
  }

  get formControl() {
    return this.editForm.controls;
  }

  // get settings
  getSettings() {
    this.helperService.showloader();
    let settingsExist = this.helperService.settings;
    if (settingsExist) {
      this.globalSettings = settingsExist;
      this.getDetailsById();
    } else {
      setTimeout(() => {
        this.getSettings();
      }, 1000);
    }
  }

  // get details by id
  getDetailsById() {
    if (this.globalSettings && this.globalSettings.length > 0) {
      let currentSettings: any = this.helperService.settings.find((x: any) => x.id == this.currentSettingsId);
      if (this.currentSettingsId == currentSettings.id) {
        this.setData(currentSettings)
      }
    }
  }

  // set data
  setData(currentSettings: any) {
    if (currentSettings && currentSettings.id) {

      let dataType = currentSettings.type;

      this.keyValue = currentSettings.key;
      this.editableData = currentSettings;

      let obj = {
        value: dataType,
      };
      this.onChange(obj);
    }

    this.helperService.hideloader();

  }

  // on change
  onChange(e: any) {

    let dynamic_key = `${e.value}_value`;

    this.formFields = [];
    const formGroupFields: any = {};

    formGroupFields['type'] = new FormControl(e.value, [Validators.required]);
    formGroupFields['key'] = new FormControl(this.keyValue, [Validators.required]);

    let array_value = '';
    let boolean_value = '';
    let date_value = '';
    let float_value = '';
    let integer_value = '';
    let timestamp_value = '';
    let text_value = '';

    e.srcData = this.editableData;

    if (e.srcData) {
      array_value = e.srcData.array_value;
      boolean_value = e.srcData.boolean_value;
      date_value = e.srcData.date_value;
      float_value = e.srcData.float_value;
      integer_value = e.srcData.integer_value;
      timestamp_value = e.srcData.timestamp_value;
      text_value = e.srcData.text_value;
    }

    if (e.value == 'integer') {
      formGroupFields[dynamic_key] = new FormControl(integer_value, [Validators.pattern("^[0-9]*$")]);
    } else if (e.value == 'boolean') {
      formGroupFields[dynamic_key] = new FormControl(boolean_value);
    } else if (e.value == 'float') {
      formGroupFields[dynamic_key] = new FormControl(float_value, [Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")]);
    } else if (e.value == 'text') {
      formGroupFields[dynamic_key] = new FormControl(text_value);
    } else if (e.value == 'date') {
      formGroupFields[dynamic_key] = new FormControl(date_value);
    } else if (e.value == 'timestamp') {
      formGroupFields[dynamic_key] = new FormControl(timestamp_value);
    } else {
      formGroupFields[dynamic_key] = this.formBuilder.array([]);
      setTimeout(() => {
        let s = this.editForm.get('array_value') as FormArray;
        if (array_value && array_value.length > 0) {
          this.editableData.array_value.forEach((element: any) => {
            s.push(new FormControl(element, Validators.required));
          });
        }
      }, 1000);
    }

    this.editForm = new FormGroup(formGroupFields);

    let defaultParam = [
      {
        id: 'type',
        value: 'Type'
      },
      {
        id: 'key',
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
  capitalize(s: any) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  // update
  update() {
    if (this.editForm.valid) {

      this.helperService.showloader();

      let params: any = this.editForm.value;
      let url = `auth/admin/settings/${this.currentSettingsId}`;

      this.helperService.patch(url, params).subscribe(
        (res: any) => {
          if (res.status) {
            this.msg = res.message;
            this.helperService.snackPositionTopCenter(this.msg);
            this.helperService.getSiteSettings();
          } else {
            this.msg = res.message;
            this.helperService.snackPositionTopCenter(this.msg);
          }

          this.helperService.hideloader();
        },
        (err: any) => {
          this.helperService.hideloader();
          console.log(err);
      });
    };
  }

  get array_values() {
    return this.editForm.get('array_value') as FormArray;
  }

  addDescription() {
    this.array_values.push(new FormControl(''));
  }

  ngOnDestroy(): void {
    localStorage.removeItem('currentSiteSettings');
  }

}
