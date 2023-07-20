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

  displayedColumns: string[] = ['position', 'type', 'key', 'value', 'action'];

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  settings: any;
  globalSettings: any;

  message: any;
  classType: any;

  errorStatus: boolean = false;

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
    if(this.helperService.settings && this.helperService.settings.length > 0 ) {
      let settingsExist = this.helperService.settings;
      if (settingsExist) {
        let result = settingsExist;        
        let i = 0;
        result.map((x: any) => {
          i++;
          x.sno = i;
          if (x.text_value) {
            if (x.text_value.length > 100) {
              x.displayValue = x.text_value.substring(0, 100) + "...";
            } else {
              x.displayValue = x.text_value;
            }
          }
  
          if (x.array_value) {
            x.displayValue = 'List Items';
          }
        });
        this.globalSettings = result;
        this.setData();
      }
    } else {
      setTimeout(() => {
        this.getSettings();
      }, 800);
    }
  }

  // set data
  setData() {
    this.settings = new MatTableDataSource(this.globalSettings)
    this.cdr.detectChanges();
    this.settings.paginator = this.paginator;
    this.settings.sort = this.sort;
    this.helperService.hideloader();
  }

  // create settings
  createSettings() {
    this.router.navigate(['dashboard/site-settings/create-settings']);
  }

  // edit
  editSettings(element: any) {
    localStorage.setItem('currentSiteSettings', JSON.stringify(element));
    this.router.navigate(['dashboard/site-settings/edit', element.id]);
  }

  // delete
  deleteSettings(element: any) {
    this.helperService.showloader();
    let url = `auth/admin/settings/${element.id}`;
    this.helperService.delete(url).subscribe(
      (res: any) => {
        if (res.status) {
          this.helperService.settings = [];
          this.helperService.getSiteSettings();
          setTimeout(() => {
            this.getSettings();
          }, 1000);
          this.helperService.snackPositionTopCenter(res.message);
        } else {
          this.helperService.hideloader();
        }
      },
      (errors: any) => {
        console.log(errors);
        this.helperService.hideloader();
      },
    )
    this.classType = 'danger';
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
