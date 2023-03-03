import { Component, Injectable, Input } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

// @Injectable()
export class BarChartComponent {

  @Input() srcData:any = '';
  @Input() type:any = '';

  ngOnInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
      this.getData();
  }

  getData() {
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
    let header = ["Element", "Density", { role: "style" }];
    InputData.push(header);

    for (const [key, value] of Object.entries(this.srcData)) {
      let arr = [key, value, '']
      InputData.push(arr);
    }

    setTimeout(() => {     
      google.charts.setOnLoadCallback(this.drawChart(InputData));
    },1000);
  }

  drawChart(val:any) {
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

      var options = {
        title: "Density of Precious Metals, in g/cm^3",
        width: 600,
        height: 400,
        bar: { groupWidth: "95%" },
        legend: { position: "none" },
      };

      if(this.type == 'qr') {        
        var chart = new google.visualization.ColumnChart(document.getElementById(this.type));
      } else if(this.type == 'user') {
        var chart = new google.visualization.BarChart(document.getElementById(this.type));
      } else {
        var chart = new google.visualization.PieChart(document.getElementById(this.type));
      }
      
      chart.draw(view, null);
    
  }


}
