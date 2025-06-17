import { Customer } from './customer.model';

export interface BankAccount {
  id: string;
  balance: number;
  createdAt: Date;
  status: string;
  type: string;
  customerDTO: Customer;
  currency?: string;
}

export interface CurrentAccount extends BankAccount {
  overDraft: number;
  type: 'CurrentAccount';
}

export interface SavingAccount extends BankAccount {
  interestRate: number;
  type: 'SavingAccount';
}

export interface AccountOperation {
  id: number;
  operationDate: Date;
  amount: number;
  description: string;
  type: string;
  bankAccountId: string;
}

export interface AccountHistory {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOS: AccountOperation[];
}
