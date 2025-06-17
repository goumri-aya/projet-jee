import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { BankAccount } from '../../models/account.model';
import { NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbNavModule],
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {
  accounts: BankAccount[] = [];
  operationForm: FormGroup;
  transferForm: FormGroup;
  activeTab = 1;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private accountService: AccountService, 
    private formBuilder: FormBuilder
  ) {
    this.operationForm = this.formBuilder.group({
      accountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      operationType: ['CREDIT', Validators.required]
    });

    this.transferForm = this.formBuilder.group({
      sourceAccountId: ['', Validators.required],
      destinationAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['Transfer operation', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (err) => {
        console.error('Error loading accounts', err);
      }
    });
  }

  onOperationSubmit(): void {
    if (this.operationForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const { accountId, amount, description, operationType } = this.operationForm.value;

    if (operationType === 'CREDIT') {
      this.accountService.credit(accountId, amount, description).subscribe({
        next: () => {
          this.handleOperationSuccess('Credit operation completed successfully');
        },
        error: (err) => {
          this.handleOperationError(err);
        }
      });
    } else {
      this.accountService.debit(accountId, amount, description).subscribe({
        next: () => {
          this.handleOperationSuccess('Debit operation completed successfully');
        },
        error: (err) => {
          this.handleOperationError(err);
        }
      });
    }
  }

  onTransferSubmit(): void {
    if (this.transferForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const { sourceAccountId, destinationAccountId, amount } = this.transferForm.value;

    if (sourceAccountId === destinationAccountId) {
      this.errorMessage = 'Source and destination accounts cannot be the same';
      this.isLoading = false;
      return;
    }

    this.accountService.transfer(sourceAccountId, destinationAccountId, amount).subscribe({
      next: () => {
        this.handleOperationSuccess('Transfer operation completed successfully');
      },
      error: (err) => {
        this.handleOperationError(err);
      }
    });
  }

  private handleOperationSuccess(message: string): void {
    this.isLoading = false;
    this.successMessage = message;
    this.operationForm.reset({
      operationType: 'CREDIT'
    });
    this.transferForm.reset({
      description: 'Transfer operation'
    });
    this.loadAccounts();
  }

  private handleOperationError(err: any): void {
    this.isLoading = false;
    this.errorMessage = err.error?.error || 'An error occurred during the operation';
    console.error('Operation error', err);
  }

  getAccountLabel(account: BankAccount): string {
    const accountType = account.type === 'CurrentAccount' ? 'Current' : 'Saving';
    return `${account.customerDTO.name} - ${accountType} (${account.id})`;
  }
}
