import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../../services/account.service';
import { BankAccount } from '../../../models/account.model';

@Component({
  selector: 'app-transfer-operation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Transfer Money</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div *ngIf="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      
      <form [formGroup]="transferForm">
        <div class="mb-3">
          <label for="sourceAccountId" class="form-label">From Account</label>
          <select 
            class="form-select" 
            id="sourceAccountId" 
            formControlName="sourceAccountId"
            [ngClass]="{'is-invalid': transferForm.controls['sourceAccountId'].invalid && transferForm.controls['sourceAccountId'].touched}"
          >
            <option value="">Select source account</option>
            <option *ngFor="let account of accounts" [value]="account.id">
              {{ getAccountLabel(account) }} - Balance: {{ account.balance | currency }}
            </option>
          </select>
          <div *ngIf="transferForm.controls['sourceAccountId'].invalid && transferForm.controls['sourceAccountId'].touched" class="invalid-feedback">
            Source account is required
          </div>
        </div>
        
        <div class="mb-3">
          <label for="destinationAccountId" class="form-label">To Account</label>
          <select 
            class="form-select" 
            id="destinationAccountId" 
            formControlName="destinationAccountId"
            [ngClass]="{'is-invalid': transferForm.controls['destinationAccountId'].invalid && transferForm.controls['destinationAccountId'].touched}"
          >
            <option value="">Select destination account</option>
            <option *ngFor="let account of accounts" [value]="account.id">
              {{ getAccountLabel(account) }}
            </option>
          </select>
          <div *ngIf="transferForm.controls['destinationAccountId'].invalid && transferForm.controls['destinationAccountId'].touched" class="invalid-feedback">
            Destination account is required
          </div>
        </div>
        
        <div class="mb-3">
          <label for="amount" class="form-label">Amount</label>
          <input 
            type="number" 
            class="form-control" 
            id="amount" 
            formControlName="amount"
            [ngClass]="{'is-invalid': transferForm.controls['amount'].invalid && transferForm.controls['amount'].touched}"
            min="0.01"
            step="0.01"
          >
          <div *ngIf="transferForm.controls['amount'].invalid && transferForm.controls['amount'].touched" class="invalid-feedback">
            <div *ngIf="transferForm.controls['amount'].errors?.['required']">Amount is required</div>
            <div *ngIf="transferForm.controls['amount'].errors?.['min']">Amount must be greater than 0</div>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <input 
            type="text" 
            class="form-control" 
            id="description" 
            formControlName="description"
          >
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Cancel</button>
      <button type="button" class="btn btn-primary" [disabled]="transferForm.invalid || isLoading || sameAccounts" (click)="executeTransfer()">
        <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Transfer
      </button>
    </div>
  `,
  styleUrls: ['./transfer-operation.component.css']
})
export class TransferOperationComponent implements OnInit {
  @Input() accounts: BankAccount[] = [];
  transferForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    public activeModal: NgbActiveModal
  ) {
    this.transferForm = this.formBuilder.group({
      sourceAccountId: ['', Validators.required],
      destinationAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['Transfer operation']
    });
  }
  
  ngOnInit(): void {}
  
  executeTransfer(): void {
    if (this.transferForm.invalid || this.sameAccounts) return;
    
    this.isLoading = true;
    this.errorMessage = null;
    
    const { sourceAccountId, destinationAccountId, amount, description } = this.transferForm.value;
    
    this.accountService.transfer(sourceAccountId, destinationAccountId, amount).subscribe({
      next: () => {
        this.isLoading = false;
        this.activeModal.close(true);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.error || 'An error occurred during the transfer';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  
  getAccountLabel(account: BankAccount): string {
    const accountType = account.type === 'CurrentAccount' ? 'Current' : 'Saving';
    return `${account.customerDTO.name} - ${accountType} (${account.id})`;
  }
  
  get sameAccounts(): boolean {
    const sourceId = this.transferForm.get('sourceAccountId')?.value;
    const destId = this.transferForm.get('destinationAccountId')?.value;
    
    return sourceId && destId && sourceId === destId;
  }
}
