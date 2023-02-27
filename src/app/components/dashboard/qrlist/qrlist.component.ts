import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { FileUploadService } from 'src/app/service/file-upload.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-qrlist',
  templateUrl: './qrlist.component.html',
  styleUrls: ['./qrlist.component.scss']
})
export class QrlistComponent {
  message = '';
  userFiles:any = [];

  matcher = new ErrorStateMatcher();

  displayedColumns: string[] = ['position', 'type', 'text', 'imagebase64', 'image', 'activated_at'];
  
  @ViewChild('paginator') paginator!: MatPaginator;
  
  constructor(
    private uploadService: FileUploadService,
    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {    
    this.getFiles();   
  }  

  ngAfterViewInit() {
    // this.userFiles.paginator = this.paginator;
  }

  getFiles() {
    this.uploadService.getFiles().subscribe((res:any) => {
      if(res.success) {
        // this.userFiles = res.data;
        this.userFiles = new MatTableDataSource(res.data)
        this.userFiles.paginator = this.paginator;
      } else {
        this.userFiles = [];
      }
    });
  }

}
