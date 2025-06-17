import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { AccountService } from '../../services/account.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Bar Chart: Account Types
  public accountTypesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public accountTypesChartLabels: string[] = ['Current Accounts', 'Saving Accounts'];
  public accountTypesChartType: ChartType = 'bar';
  public accountTypesChartLegend = true;
  public accountTypesChartData: ChartData<'bar'> = {
    labels: this.accountTypesChartLabels,
    datasets: [
      { data: [0, 0], label: 'Number of Accounts', backgroundColor: ['#36A2EB', '#FFCE56'] }
    ]
  };

  // Pie Chart: Account Statuses
  public accountStatusesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };
  public accountStatusesChartType: ChartType = 'pie';
  public accountStatusesChartLegend = true;
  public accountStatusesChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Created', 'Activated', 'Suspended', 'Blocked'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384'],
    }]
  };

  totalCustomers: number = 0;
  totalAccounts: number = 0;
  totalBalance: number = 0;

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Example: Fetch account data to populate charts
    this.accountService.getAccounts().subscribe(accounts => {
      this.totalAccounts = accounts.length;
      let currentAccounts = 0;
      let savingAccounts = 0;
      let created = 0;
      let activated = 0;
      let suspended = 0;
      let blocked = 0;
      
      this.totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

      accounts.forEach(account => {
        if (account.type === 'CurrentAccount') {
          currentAccounts++;
        } else if (account.type === 'SavingAccount') {
          savingAccounts++;
        }

        switch (account.status) {
          case 'CREATED': created++; break;
          case 'ACTIVATED': activated++; break;
          case 'SUSPENDED': suspended++; break;
          case 'BLOCKED': blocked++; break;
        }
      });

      this.accountTypesChartData.datasets[0].data = [currentAccounts, savingAccounts];
      this.accountStatusesChartData.datasets[0].data = [created, activated, suspended, blocked];
      
      // Trigger chart update if ng2-charts doesn't do it automatically
      // This is often not needed as ng2-charts handles data changes.
      // If charts don't update, you might need to re-assign the chart data object
      // or use the Chart.js API if you have a @ViewChild reference to the chart.
      this.accountTypesChartData = { ...this.accountTypesChartData };
      this.accountStatusesChartData = { ...this.accountStatusesChartData };
    });

    this.customerService.getCustomers().subscribe(customers => {
      this.totalCustomers = customers.length;
    });
  }

  // Optional chart event handlers
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }
}
