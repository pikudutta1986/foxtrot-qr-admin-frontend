import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/service/helper.service';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})

export class SiteComponent {

  displayedColumns: string[] = ['position', 'key', 'type', 'created_at', 'action'];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  settings: any;
  globalSettings: any;

  message: any;
  classType: any;

  errorStatus:boolean = false;

  constructor(
    private helperService: HelperService,
    private router: Router,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.helperService.searchInput.subscribe((res: any) => {
      this.applyFilter(res);
    });
    this.getSettings();
  }

  // get settings
  getSettings() {
    this.helperService.showloader();
    let settingsExist = this.helperService.settings;
    if (settingsExist) {
      this.globalSettings = settingsExist;
      this.setData();
    } else {
      setTimeout(() => {
        this.getSettings();
      }, 1000);
    }
  }

  // set data
  setData() {
    this.settings = new MatTableDataSource(this.globalSettings)
    this.cdr.detectChanges();
    this.settings.paginator = this.paginator;
    this.settings.sort = this.sort;
    // setTimeout(() => {
      this.helperService.hideloader();
    // }, 1000);
    
  }

  // create settings
  createSettings() {
    this.router.navigate(['dashboard/site-settings/create-settings']);
  }

  // edit
  editSettings(element: any) {
    // localStorage.setItem('currentSiteSettings', JSON.stringify(element));
    // this.router.navigate(['dashboard/site-settings/edit', element.id]);
  }

  // delete
  deleteSettings(element: any) {
    // this.helperService.showloader();
    // let url = `auth/admin/settings/${element.id}`;
    // this.helperService.delete(url).subscribe(
    //   (res: any) => {
    //     if (res.status) {
    //       this.helperService.getSiteSettings().then((resp:any) => {
    //         if(resp.success) {
    //           this.globalSettings = resp.settings;
    //           this.setData();
    //           this.message = res.message;
    //           this.errorStatus = true;
    //         }
    //       });
    //       // this.message = res.message;
    //     } else {
    //       this.helperService.hideloader();
    //     }
        

    //   },
    //   (errors: any) => {
    //     console.log(errors);
    //     this.helperService.hideloader();
    //   },
    // )
    // this.classType = 'danger';
  }

  // filter
  applyFilter(filterValue: any) {
    // filterValue = filterValue.value;
    this.settings.filter = filterValue.trim().toLowerCase();
    if (this.settings.paginator) {
      this.settings.paginator.firstPage();
    }
  }



}