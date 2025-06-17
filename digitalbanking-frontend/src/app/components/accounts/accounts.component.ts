import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { BankAccount } from '../../models/account.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransferOperationComponent } from '../operations/transfer-operation/transfer-operation.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts: BankAccount[] = [];
  errorMessage: string | null = null;
  searchTerm: string = '';

  constructor(
    private accountService: AccountService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        this.errorMessage = 'Error loading accounts';
        console.error(err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CREATED': return 'bg-info';
      case 'ACTIVATED': return 'bg-success';
      case 'SUSPENDED': return 'bg-warning';
      case 'BLOCKED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  openTransferModal(): void {
    const modalRef = this.modalService.open(TransferOperationComponent);
    modalRef.componentInstance.accounts = this.accounts;
    modalRef.result.then((result) => {
      if (result) {
        this.loadAccounts();
      }
    }, () => {});
  }

  get totalBalance(): number {
    return this.accounts.reduce((sum, account) => sum + account.balance, 0);
  }

  get filteredAccounts(): BankAccount[] {
    if (!this.searchTerm) {
      return this.accounts;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.accounts.filter(account => 
      account.id.toLowerCase().includes(term) || 
      account.customerDTO.name.toLowerCase().includes(term) ||
      account.type.toLowerCase().includes(term)
    );
  }

  get currentAccountsCount(): number {
    return this.accounts.filter(a => a.type === 'CurrentAccount').length;
  }

  get savingAccountsCount(): number {
    return this.accounts.filter(a => a.type === 'SavingAccount').length;
  }
}
