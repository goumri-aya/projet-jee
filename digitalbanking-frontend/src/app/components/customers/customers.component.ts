import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCustomerComponent } from './create-customer/create-customer.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <h1 class="mb-4">Customers</h1>
      
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="input-group" style="max-width: 300px;">
          <input 
            type="text" 
            class="form-control" 
            id="searchCustomer" 
            name="searchCustomer" 
            placeholder="Search customers..." 
            [(ngModel)]="searchTerm"
          >
          <button class="btn btn-outline-secondary" type="button" *ngIf="searchTerm" (click)="searchTerm = ''">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <button class="btn btn-primary" (click)="openCreateCustomerModal()">
          <i class="bi bi-plus-circle me-1"></i> New Customer
        </button>
      </div>
      
      <div *ngIf="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>
      
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-striped table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let customer of filteredCustomers">
                  <td>{{ customer.id }}</td>
                  <td>{{ customer.name }}</td>
                  <td>{{ customer.email }}</td>
                  <td>{{ customer.phone }}</td>
                  <td>
                    <a [routerLink]="['/customers', customer.id]" class="btn btn-sm btn-info me-1">
                      <i class="bi bi-eye"></i>
                    </a>
                    <button class="btn btn-sm btn-secondary me-1" (click)="openEditCustomerModal(customer)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteCustomer(customer.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="filteredCustomers.length === 0">
                  <td colspan="5" class="text-center py-3">
                    No customers found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  searchTerm: string = '';
  errorMessage: string | null = null;
  
  constructor(
    private customerService: CustomerService,
    private modalService: NgbModal
  ) {}
  
  ngOnInit(): void {
    this.loadCustomers();
  }
  
  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        this.errorMessage = 'Error loading customers';
        console.error(err);
      }
    });
  }
  
  openCreateCustomerModal(): void {
    const modalRef = this.modalService.open(CreateCustomerComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.loadCustomers();
      }
    }, () => {});
  }
  
  openEditCustomerModal(customer: Customer): void {
    // Implement edit customer functionality if needed
    console.log('Edit customer:', customer);
  }
  
  deleteCustomer(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err: any) => {
          this.errorMessage = 'Error deleting customer';
          console.error(err);
        }
      });
    }
  }
  
  get filteredCustomers(): Customer[] {
    if (!this.searchTerm) {
      return this.customers;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.customers.filter(customer => 
      customer.name.toLowerCase().includes(term) || 
      customer.email.toLowerCase().includes(term) || 
      (customer.phone ? customer.phone.toLowerCase().includes(term) : false)
    );
  }
}
