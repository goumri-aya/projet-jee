import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { AccountFormComponent } from './components/account-form/account-form.component';
import { OperationsComponent } from './components/operations/operations.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component'; // Import DashboardComponent

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, // Add dashboard route
    canActivate: [authGuard] 
  },
  { 
    path: 'customers', 
    component: CustomersComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'customers/new', 
    component: CustomerFormComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'customers/:id/edit', 
    component: CustomerFormComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'customers/:id', 
    component: CustomerDetailsComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'accounts', 
    component: AccountsComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'accounts/new/:type', // :type can be 'current' or 'saving'
    component: AccountFormComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'accounts/:id', 
    component: AccountDetailsComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'operations', 
    component: OperationsComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'change-password', 
    component: ChangePasswordComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } // Fallback route
];
