import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${API_URL}/dashboard/stats`);
  }

  getMonthlyOperationStats(): Observable<any> {
    return this.http.get(`${API_URL}/dashboard/operations/monthly`);
  }

  getCustomerAccountStats(): Observable<any> {
    return this.http.get(`${API_URL}/dashboard/customers/accounts`);
  }

  getUserStatistics(): Observable<any> {
    return this.http.get(`${API_URL}/user-stats/operations-summary`);
  }

  getUserAccountsCreated(): Observable<any> {
    return this.http.get(`${API_URL}/user-stats/accounts-created`);
  }

  getUserCustomersCreated(): Observable<any> {
    return this.http.get(`${API_URL}/user-stats/customers-created`);
  }
}
