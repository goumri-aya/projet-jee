import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { BankAccount, AccountHistory, SavingAccount, CurrentAccount } from '../../models/account.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  accountId: string = '';
  accountDetails: BankAccount | null = null;
  accountHistory: AccountHistory | null = null;
  savingAccount: SavingAccount | null = null;
  currentAccount: CurrentAccount | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  currentPage: number = 0;
  pageSize: number = 5;
  
  // Operation form
  operationFormVisible: boolean = false;
  operationFormTitle: string = '';
  operationType: 'CREDIT' | 'DEBIT' | 'TRANSFER' = 'CREDIT';
  operationAmount: number = 0;
  operationDescription: string = '';
  destinationAccountId: string = '';
  operationInProgress: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = params['id'];
      this.loadAccountDetails();
      this.loadAccountHistory();
    });
  }

  loadAccountDetails(): void {
    this.isLoading = true;
    this.accountService.getAccount(this.accountId).subscribe({
      next: (data) => {
        this.accountDetails = data;
        
        // Determine account type
        if (data.type === 'SavingAccount') {
          this.savingAccount = data as SavingAccount;
          this.currentAccount = null;
        } else {
          this.currentAccount = data as CurrentAccount;
          this.savingAccount = null;
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading account details';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  loadAccountHistory(): void {
    this.accountService.getAccountHistory(this.accountId, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.accountHistory = data;
      },
      error: (err) => {
        console.error('Error loading account history', err);
      }
    });
  }

  getAccountTypeLabel(type: string): string {
    return type === 'CurrentAccount' ? 'Current Account' : 'Saving Account';
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

  openDebitDialog(): void {
    this.operationFormVisible = true;
    this.operationFormTitle = 'Debit Operation';
    this.operationType = 'DEBIT';
    this.operationAmount = 0;
    this.operationDescription = '';
  }

  openCreditDialog(): void {
    this.operationFormVisible = true;
    this.operationFormTitle = 'Credit Operation';
    this.operationType = 'CREDIT';
    this.operationAmount = 0;
    this.operationDescription = '';
  }

  openTransferDialog(): void {
    this.operationFormVisible = true;
    this.operationFormTitle = 'Transfer Operation';
    this.operationType = 'TRANSFER';
    this.operationAmount = 0;
    this.operationDescription = 'Transfer';
    this.destinationAccountId = '';
  }

  cancelOperation(): void {
    this.operationFormVisible = false;
  }

  submitOperation(): void {
    if (this.operationAmount <= 0) {
      this.errorMessage = 'Amount must be greater than 0';
      return;
    }

    this.operationInProgress = true;
    this.errorMessage = null;

    if (this.operationType === 'DEBIT') {
      this.accountService.debit(this.accountId, this.operationAmount, this.operationDescription).subscribe({
        next: () => {
          this.handleOperationSuccess();
        },
        error: (err) => {
          this.handleOperationError(err);
        }
      });
    } else if (this.operationType === 'CREDIT') {
      this.accountService.credit(this.accountId, this.operationAmount, this.operationDescription).subscribe({
        next: () => {
          this.handleOperationSuccess();
        },
        error: (err) => {
          this.handleOperationError(err);
        }
      });
    } else if (this.operationType === 'TRANSFER') {
      this.accountService.transfer(this.accountId, this.destinationAccountId, this.operationAmount).subscribe({
        next: () => {
          this.handleOperationSuccess();
        },
        error: (err) => {
          this.handleOperationError(err);
        }
      });
    }
  }

  private handleOperationSuccess(): void {
    this.operationInProgress = false;
    this.operationFormVisible = false;
    this.loadAccountDetails();
    this.loadAccountHistory();
  }

  private handleOperationError(err: any): void {
    this.operationInProgress = false;
    this.errorMessage = err.error?.error || 'An error occurred during the operation';
    console.error('Operation error', err);
  }

  gotoPage(page: number): void {
    if (this.accountHistory && page >= 0 && page < this.accountHistory.totalPages) {
      this.currentPage = page;
      this.loadAccountHistory();
    }
  }

  getPages(): number[] {
    if (!this.accountHistory) return [];
    const totalPages = this.accountHistory.totalPages;
    return Array(totalPages).fill(0).map((_, i) => i);
  }
}
