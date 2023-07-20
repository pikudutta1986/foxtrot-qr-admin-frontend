import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { HelperService } from 'src/app/service/helper.service';
declare var google: any;

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})


export class BarChartComponent {

  @Input() srcData: any = '';
  @Input() type: any = '';

  constructor(public helperServcie: HelperService, public cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart','bar'] });      
  }


  ngAfterViewInit() {
    // google.charts.load('current', { packages: ['corechart','bar'] });
    // setTimeout(() => {
    //   this.getData();
    // }, 600);
    // this.cdr.detectChanges();
  }

  ngOnChanges() {
    if (this.srcData) {
      this.setData();
    }
  }

  // get Data
  getData() {
    this.helperServcie.showloader();
    setTimeout(() => {
      if (this.srcData) {
        this.setData();
      } else {
        this.getData();
      }
    }, 1000);
  }

  // set Data
  setData() {
    let InputData: any = [];   

    if(this.type != 'plandashboard') {
      if(this.type == 'payment') {
        let header = ["Element", "", { role: "style" }, { role: 'annotation' }];
        InputData.push(header);
      } else {
        let header = ["Element", "", { role: "style" }];
        InputData.push(header);
      }
      
      for (const [key, value] of Object.entries(this.srcData)) {
        let label = `$${value}`;
        if(this.type == 'payment') {
          let arr = [key, value, '', label]
          InputData.push(arr);
        } else {
          let arr = [key, value, '']
          InputData.push(arr);
        }
        
      }
      setTimeout(() => {
        google.charts.setOnLoadCallback(this.drawChart(InputData));
      }, 1000);
    } else {      
      setTimeout(() => {
        google.charts.setOnLoadCallback(this.drawChart(this.srcData));
      }, 1000);     
    }   
   
  }

  // draw chart
  drawChart(val: any) {
    var data = google.visualization.arrayToDataTable(val);
    var view = new google.visualization.DataView(data);

    if(this.type == 'userdashboard') {
      view.setColumns([0, 1,
        {
          calc: "stringify",
          sourceColumn: 1,
          type: "string",
          role: "annotation"
        },2
      ]);
    }   

    let options: any = '';

    if (this.type == 'payment') {      
      options = {
        height: 'auto',
        legend: 'none',
        colors: ['#FF14B5']
      };
      var chart = new google.visualization.ColumnChart(document.getElementById(this.type));  
    } 
    
    if(this.type == 'userdashboard') {
      options = {
        height: 'auto',
        legend: 'none',
        colors: ['green']
      };
      var chart = new google.visualization.ColumnChart(document.getElementById(this.type)); 
    } 

    if(this.type == 'plandashboard') {    
      var chart = new google.charts.Bar(document.getElementById(this.type));
    }
   
    chart.draw(view, options);

    // this.helperServcie.hideloader();

  }



}
