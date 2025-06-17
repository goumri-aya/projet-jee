import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.css'
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  customerId: number | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {
    this.customerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.customerId = params['id'] ? +params['id'] : null;
      this.isEditMode = !!this.customerId;
      
      if (this.isEditMode) {
        this.loadCustomerDetails();
      }
    });
  }
  
  loadCustomerDetails(): void {
    if (!this.customerId) return;
    
    this.isLoading = true;
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (data) => {
        this.customerForm.patchValue({
          name: data.name,
          email: data.email
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading customer details';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  onSubmit(): void {
    if (this.customerForm.invalid) return;
    
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    const customerData: Customer = {
      ...this.customerForm.value,
      id: this.customerId || undefined
    };
    
    if (this.isEditMode) {
      this.customerService.updateCustomer(customerData).subscribe({
        next: (data) => {
          this.isLoading = false;
          this.successMessage = 'Customer updated successfully!';
          setTimeout(() => this.router.navigate(['/customer', data.id]), 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'An error occurred while updating the customer';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.customerService.saveCustomer(customerData).subscribe({
        next: (data) => {
          this.isLoading = false;
          this.successMessage = 'Customer created successfully!';
          setTimeout(() => this.router.navigate(['/customer', data.id]), 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'An error occurred while creating the customer';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }
  
  get formTitle(): string {
    return this.isEditMode ? 'Edit Customer' : 'New Customer';
  }
  
  get submitButtonText(): string {
    return this.isEditMode ? 'Update Customer' : 'Create Customer';
  }
}
