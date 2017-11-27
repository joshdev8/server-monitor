import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { Chart, pattern } from 'chart.js';
import { Computer } from './cpu.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  socket = io.connect('192.168.50.4:8000');
  memChart = undefined;
  cpuChart = undefined;
  cpuGraph = undefined;
  cpuType = '';
  noOfCpu = '';
  hostname = '';
  platform = '';
  architecture = '';
  type = '';
  release = '';
  uptime = '';
  loadavg: any[];
  networkinterfaces: any[];

  model = '';
  speed = '';
  times: any[];
  showNetwork: boolean = false;

  ngOnInit() {
    // ---------------------------------------------------Section II
    const ctx = document.getElementById('mChart');
    const doughnutGraphData = {
      datasets: [{
        data: [1, 0],
        backgroundColor: ['#55ACD2', '#E96B56'],
      }],
      labels: [
        'Free',
        'Used',
      ]
    };
    this.memChart = new Chart(ctx, {
      type: 'doughnut',
      data: doughnutGraphData,
      options: {}
    });

    const ctx2 = document.getElementById('cChart');
    const cpuLoadGraphData = {
      datasets: [{
        label: '15 min average',
        data: [],
        backgroundColor: 'rgba(41,187,156, 0.2)',
      }],
      labels: ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    };

    this.cpuChart = new Chart(ctx2, {
      type: 'line',
      data: cpuLoadGraphData,
      options: {}
    });

    // ---------------------------------------------------Section III
    this.socket.on('connected', (connectData) => this.connected(connectData));
    this.socket.on('os-update', (event) => this.updateCharts(event));
  }
  // ---------------------------------------------------Section IV

  updateCharts(event) {

    // graph 1
    this.memChart.data.labels.pop();
    this.memChart.data.labels.pop();
    this.memChart.data.labels.push(`Free:${this.formatBytes(event.freemem, 2)}`);
    this.memChart.data.labels.push(`Used:${this.formatBytes(event.totalmem - event.freemem, 2)}`);

    this.memChart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
      dataset.data.pop();
      dataset.data.push(event.freemem);
      dataset.data.push(event.totalmem - event.freemem);
    });
    this.memChart.update(0);

    // graph 2
    this.cpuChart.data.datasets.forEach((dataset) => {
      if (dataset.data.length > 9) {
        dataset.data.shift();
      }
      dataset.data.push(event.loadavg[2]);
    });
    this.cpuChart.update(0);

    // graph 3
    this.cpuGraph.data.datasets.forEach((dataset) => {
      if (dataset.data.length > 9) {
        dataset.data.shift();
      }
      dataset.data.push(event.loadavg[2]);
    });
    this.cpuGraph.update(0);
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1000,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  connected(connectData) {
    this.cpuType = connectData.types;
    this.noOfCpu = connectData.cpus;
    this.hostname = connectData.hostname;
    this.platform = connectData.platform;
    this.architecture = connectData.architecture;
    this.type = connectData.type;
    this.release = connectData.release;
    this.uptime = connectData.uptime;
    this.loadavg = connectData.loadavg;
    this.networkinterfaces = connectData.networkinterfaces;


    
    console.log('this is noOfCpu ' + this.noOfCpu);
    console.log('thiis is cpuType ' + this.cpuType);

    this.model = this.noOfCpu[0];
    console.log('this.noOfCpu = ' + JSON.stringify(this.noOfCpu));
    console.log('this.model = ' + this.model);

    const computer = new Computer(
      this.model,
      this.speed,
      this.times,
      this.hostname,
      this.platform,
      this.architecture,
      this.type,
      this.release,
      this.uptime,
      this.loadavg,
      this.networkinterfaces
    );

    console.log(computer);
  }

  displayNetwork() {
    this.showNetwork = !this.showNetwork;
  }

}