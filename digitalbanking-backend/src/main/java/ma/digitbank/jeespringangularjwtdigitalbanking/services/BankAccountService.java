package ma.digitbank.jeespringangularjwtdigitalbanking.services;

import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.*;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.BalanceNotSufficientException;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.BankAccountNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CustomerNotFoundException;

import java.util.List;

public interface BankAccountService {
    CustomerDTO saveCustomer(CustomerDTO customerDTO);
    CustomerDTO updateCustomer(CustomerDTO customerDTO);
    void deleteCustomer(Long customerId);
    List<CustomerDTO> listCustomers();
    List<CustomerDTO> searchCustomers(String keyword);
    CustomerDTO getCustomer(Long customerId) throws CustomerNotFoundException;
    CustomerDTO getCustomerByEmail(String email);
    
    CurrentAccountDTO saveCurrentBankAccount(double initialBalance, double overDraft, Long customerId) throws CustomerNotFoundException;
    SavingAccountDTO saveSavingBankAccount(double initialBalance, double interestRate, Long customerId) throws CustomerNotFoundException;
    List<BankAccountDTO> listBankAccounts();
    List<BankAccountDTO> getCustomerAccounts(Long customerId);
    
    BankAccountDTO getBankAccount(String accountId) throws BankAccountNotFoundException;
    void debit(String accountId, double amount, String description) throws BankAccountNotFoundException, BalanceNotSufficientException;
    void credit(String accountId, double amount, String description) throws BankAccountNotFoundException;
    void transfer(String accountIdSource, String accountIdDestination, double amount) throws BankAccountNotFoundException, BalanceNotSufficientException;
    
    List<AccountOperationDTO> accountOperationHistory(String accountId);
    AccountHistoryDTO accountHistory(String accountId, int page, int size) throws BankAccountNotFoundException;
}
