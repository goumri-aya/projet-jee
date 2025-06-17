import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { BankAccount } from '../../models/account.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css'
})
export class CustomerDetailsComponent implements OnInit {
  customerId: number = 0;
  customer: Customer | null = null;
  accounts: BankAccount[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private modalService: NgbModal
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.customerId = +params['id'];
      this.loadCustomerDetails();
      this.loadCustomerAccounts();
    });
  }
  
  loadCustomerDetails(): void {
    this.isLoading = true;
    this.customerService.getCustomer(this.customerId).subscribe({
      next: (data) => {
        this.customer = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading customer details';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  loadCustomerAccounts(): void {
    this.customerService.getCustomerAccounts(this.customerId).subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        console.error('Error loading customer accounts', err);
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
}
