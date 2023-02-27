import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, ReplaySubject } from 'rxjs';
import { FileUploadService } from 'src/app/service/file-upload.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent {

  qrForm: any = FormGroup;

  @ViewChild('imgUpload') imgUpload!: ElementRef<HTMLInputElement>;
  currentFile?: File;
  progress = 0;
  message = '';

  fileName = 'Select Image';

  imageError: any;
  isImageSaved: any;
  cardImageBase64: any = '';

  constructor(
    private uploadService: FileUploadService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.qrForm = this.formBuilder.group({
      text: ['', [Validators.required]],
      image: ['', [Validators.required]],
      qrtype: ['', [Validators.required]]
    });
  }


  selectFile(event: any): void {
    this.imageError = '';
    if (event.target.files && event.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 1000;
      const max_width = 1000;

      // console.log(event.target.files[0].type, 'type')

      if (event.target.files[0].size > max_size) {
        this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';
      }

      if (!allowed_types.includes(event.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | PNG )';
      }

      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;

      this.convertFile(event.target.files[0]).subscribe(base64 => {
        let imgType = event.target.files[0].type;
        let format = `data:${imgType};base64,${base64}`;
        this.imgUpload.nativeElement.setAttribute('src', format);
        this.cardImageBase64 = format;
      });

    } else {
      this.fileName = 'Select File';
    }
  }

  upload(): void {
    this.message = "";
    if (this.qrForm.valid) {
      this.uploadService.upload(this.cardImageBase64, this.qrForm.value).subscribe(
        (event:  any) => {     
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              break;
            case HttpEventType.UploadProgress:
              this.progress = Math.round(event.loaded / event.total * 100);
              console.log(`Uploaded! ${this.progress}%`);
              break;
            case HttpEventType.Response:
              console.log('successful!', event.body);
              let res = event.body;
              if(res.success) {
                this.imgUpload.nativeElement.setAttribute('src', res.data.qrbase64);
                this.cardImageBase64 = res.data.qrbase64;
                this.message = 'successfully generated';
                this.qrForm.reset();
              }
              setTimeout(() => {
                // this.progress = 0;
              }, 1500);
          }        
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }
          this.currentFile = undefined;
      });
    }

  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  removeImage() {
    this.currentFile = undefined;
    this.fileName = 'Select File';
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

}
