import { Component, Injectable, Input } from '@angular/core';
import { HelperService } from 'src/app/service/helper.service';
declare var google: any;

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

// @Injectable()
export class BarChartComponent {

  @Input() srcData: any = '';
  @Input() type: any = '';

  constructor(public helperServcie: HelperService) { }

  ngOnInit(): void {
    // google.load('visualization', '1', {packages: ['imagechart']});
    google.charts.load('current', { packages: ['corechart'] });
    this.getData();
  }

  ngOnChanges() {
    if (this.srcData) {
      this.setData();
    }

  }

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

  setData() {
    let InputData: any = [];
    let header = ["Element", "", { role: "style" }];
    InputData.push(header);

    for (const [key, value] of Object.entries(this.srcData)) {
      let arr = [key, value, '']
      InputData.push(arr);
    }

    setTimeout(() => {
      google.charts.setOnLoadCallback(this.drawChart(InputData));
    }, 1000);
  }

  drawChart(val: any) {
    var data = google.visualization.arrayToDataTable(val);
    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
      {
        calc: "stringify",
        sourceColumn: 1,
        type: "string",
        role: "annotation"
      },
      2]);

    let options: any = '';

    if (this.type == 'qr') {
      options = {
        height: 'auto',
        legend: 'none',
        colors: ['#FF14B5']
      };
      var chart = new google.visualization.ColumnChart(document.getElementById(this.type));
    } else if (this.type == 'user') {
      var chart = new google.visualization.BarChart(document.getElementById(this.type));
    } else if(this.type == 'payment') {
      options = {
        height: 'auto',
        legend: 'none',
        colors: ['#FF14B5']
      };
      var chart = new google.visualization.ColumnChart(document.getElementById(this.type));
    } else {
      options = {
        // title: "All Type of generated Qr Codes",
        height: 'auto',
        // legend: 'none',
        // colors: ['#FF14B5', '#ff89da', '#FF5733']
      };
      var chart = new google.visualization.PieChart(document.getElementById(this.type));
    }

    chart.draw(view, options);

    this.helperServcie.hideloader();

  }



}
