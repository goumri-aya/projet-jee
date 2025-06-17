import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AccountService } from '../../services/account.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.css'
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  accountType: string = '';
  customers: Customer[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private accountService: AccountService
  ) {
    this.accountForm = this.formBuilder.group({
      initialBalance: ['', [Validators.required, Validators.min(0)]],
      customerId: ['', Validators.required],
      specificValue: ['', [Validators.required, Validators.min(0)]]
    });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountType = params['type'];
      
      if (this.accountType !== 'current' && this.accountType !== 'saving') {
        this.router.navigate(['/accounts']);
      }
    });
    
    this.loadCustomers();
  }
  
  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading customers';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  onSubmit(): void {
    if (this.accountForm.invalid) return;
    
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    const initialBalance = this.accountForm.get('initialBalance')?.value;
    const customerId = this.accountForm.get('customerId')?.value;
    const specificValue = this.accountForm.get('specificValue')?.value;
    
    if (this.accountType === 'current') {
      this.accountService.saveCurrentAccount(initialBalance, specificValue, customerId).subscribe({
        next: (account) => {
          this.isLoading = false;
          this.successMessage = `Current account created successfully with ID: ${account.id}`;
          this.accountForm.reset();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'An error occurred while creating the account';
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      this.accountService.saveSavingAccount(initialBalance, specificValue, customerId).subscribe({
        next: (account) => {
          this.isLoading = false;
          this.successMessage = `Saving account created successfully with ID: ${account.id}`;
          this.accountForm.reset();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'An error occurred while creating the account';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }
  
  get specificValueLabel(): string {
    return this.accountType === 'current' ? 'Overdraft' : 'Interest Rate';
  }
  
  get specificValuePlaceholder(): string {
    return this.accountType === 'current' ? 'Enter overdraft amount' : 'Enter interest rate (%)';
  }
  
  get accountTypeLabel(): string {
    return this.accountType === 'current' ? 'Current Account' : 'Saving Account';
  }
}
