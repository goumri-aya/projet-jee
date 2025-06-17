import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-credit-operation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-header bg-success text-white">
      <h4 class="modal-title">Make a Deposit</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <form [formGroup]="creditForm">
        <div class="mb-3">
          <label for="amount" class="form-label">Amount</label>
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input 
              type="number" 
              id="amount" 
              class="form-control" 
              formControlName="amount" 
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
            >
          </div>
          <div *ngIf="creditForm.get('amount')?.invalid && creditForm.get('amount')?.touched" class="text-danger">
            <small *ngIf="creditForm.get('amount')?.errors?.['required']">Amount is required</small>
            <small *ngIf="creditForm.get('amount')?.errors?.['min']">Amount must be positive</small>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea 
            id="description" 
            class="form-control" 
            formControlName="description" 
            placeholder="Enter description"
            rows="3"
          ></textarea>
          <div *ngIf="creditForm.get('description')?.invalid && creditForm.get('description')?.touched" class="text-danger">
            <small *ngIf="creditForm.get('description')?.errors?.['required']">Description is required</small>
          </div>
        </div>
      </form>
      
      <div *ngIf="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Cancel</button>
      <button type="button" class="btn btn-success" [disabled]="creditForm.invalid || isSubmitting" (click)="submitCredit()">
        <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
        Deposit
      </button>
    </div>
  `
})
export class CreditOperationComponent implements OnInit {
  @Input() accountId: string = '';
  
  creditForm: FormGroup;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;
  
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) {
    this.creditForm = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {}
  
  submitCredit(): void {
    if (this.creditForm.invalid) return;
    
    this.isSubmitting = true;
    this.errorMessage = null;
    
    const amount = this.creditForm.get('amount')?.value;
    const description = this.creditForm.get('description')?.value;
    
    this.accountService.credit(this.accountId, amount, description).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.activeModal.close(true);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred while processing your deposit';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}
