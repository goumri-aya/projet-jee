import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountHistory, AccountOperation, BankAccount, CurrentAccount, SavingAccount } from '../models/account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.apiUrl);
  }

  getAccount(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${id}`);
  }

  getAccountOperations(accountId: string): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(`${this.apiUrl}/${accountId}/operations`);
  }

  getAccountHistory(accountId: string, page: number = 0, size: number = 10): Observable<AccountHistory> {
    return this.http.get<AccountHistory>(`${this.apiUrl}/${accountId}/operations/page?page=${page}&size=${size}`);
  }

  debit(accountId: string, amount: number, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${accountId}/operations/debit`, {
      amount,
      description
    });
  }

  credit(accountId: string, amount: number, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${accountId}/operations/credit`, {
      amount,
      description
    });
  }

  transfer(accountIdSource: string, accountIdDestination: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, {
      accountIdSource,
      accountIdDestination,
      amount
    });
  }

  saveCurrentAccount(initialBalance: number, overDraft: number, customerId: number): Observable<CurrentAccount> {
    return this.http.post<CurrentAccount>(`${this.apiUrl}/current`, {
      initialBalance,
      overDraft,
      customerId
    });
  }

  saveSavingAccount(initialBalance: number, interestRate: number, customerId: number): Observable<SavingAccount> {
    return this.http.post<SavingAccount>(`${this.apiUrl}/saving`, {
      initialBalance,
      interestRate,
      customerId
    });
  }
}
