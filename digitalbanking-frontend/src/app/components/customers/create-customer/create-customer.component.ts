import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">New Customer</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div *ngIf="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      
      <form [formGroup]="customerForm">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input 
            type="text" 
            class="form-control" 
            id="name" 
            formControlName="name"
            [ngClass]="{'is-invalid': customerForm.controls['name'].invalid && customerForm.controls['name'].touched}"
          >
          <div *ngIf="customerForm.controls['name'].invalid && customerForm.controls['name'].touched" class="invalid-feedback">
            <div *ngIf="customerForm.controls['name'].errors?.['required']">Name is required</div>
            <div *ngIf="customerForm.controls['name'].errors?.['minlength']">Name must be at least 2 characters</div>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            formControlName="email"
            [ngClass]="{'is-invalid': customerForm.controls['email'].invalid && customerForm.controls['email'].touched}"
          >
          <div *ngIf="customerForm.controls['email'].invalid && customerForm.controls['email'].touched" class="invalid-feedback">
            <div *ngIf="customerForm.controls['email'].errors?.['required']">Email is required</div>
            <div *ngIf="customerForm.controls['email'].errors?.['email']">Please enter a valid email address</div>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input 
            type="text" 
            class="form-control" 
            id="phone" 
            formControlName="phone"
          >
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Cancel</button>
      <button type="button" class="btn btn-primary" [disabled]="customerForm.invalid || isLoading" (click)="saveCustomer()">
        <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Save
      </button>
    </div>
  `
})
export class CreateCustomerComponent implements OnInit {
  customerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    public activeModal: NgbActiveModal
  ) {
    this.customerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }
  
  ngOnInit(): void {}
  
  saveCustomer(): void {
    if (this.customerForm.invalid) return;
    
    this.isLoading = true;
    this.errorMessage = null;
    
    this.customerService.saveCustomer(this.customerForm.value).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.activeModal.close(result);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'An error occurred while saving the customer';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
