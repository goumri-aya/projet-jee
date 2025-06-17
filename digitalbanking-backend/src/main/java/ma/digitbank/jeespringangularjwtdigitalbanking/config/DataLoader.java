package ma.digitbank.jeespringangularjwtdigitalbanking.config;

import lombok.RequiredArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.CustomerDTO;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.CurrentAccountDTO;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.SavingAccountDTO;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.AccountStatus;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.OperationType;
import ma.digitbank.jeespringangularjwtdigitalbanking.services.BankAccountService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;
import java.util.stream.Stream;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

    private final BankAccountService bankAccountService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            System.out.println("Seeding database with sample data...");
            
            // Create customers
            Stream.of("mohamed ali", "adil makhlof", "karima tawni", "Sara vilad", "ismail Bahi")
                .map(name -> {
                    CustomerDTO customer = new CustomerDTO();
                    customer.setName(name);
                    customer.setEmail(name.toLowerCase().replace(" ", ".") + "@example.com");
                    customer.setPhone("0123456789");
                    return customer;
                })
                .forEach(customer -> {
                    try {
                        CustomerDTO savedCustomer = bankAccountService.saveCustomer(customer);
                        
                        // Create current account for each customer
                        CurrentAccountDTO currentAccount = new CurrentAccountDTO();
                        currentAccount.setBalance(Math.random() * 90000 + 10000);
                        currentAccount.setOverDraft(10000);
                        currentAccount.setCurrency("USD");
                        currentAccount.setCustomerDTO(savedCustomer);
                        currentAccount.setStatus(AccountStatus.ACTIVATED);
                        bankAccountService.saveCurrentBankAccount(
                                currentAccount.getBalance(), 
                                currentAccount.getOverDraft(), 
                                savedCustomer.getId());

                        // Create saving account for some customers
                        if (Math.random() > 0.3) { // 70% chance of having a saving account
                            SavingAccountDTO savingAccount = new SavingAccountDTO();
                            savingAccount.setBalance(Math.random() * 50000 + 5000);
                            savingAccount.setInterestRate(3.5);
                            savingAccount.setCurrency("USD");
                            savingAccount.setCustomerDTO(savedCustomer);
                            savingAccount.setStatus(AccountStatus.ACTIVATED);
                            bankAccountService.saveSavingBankAccount(
                                    savingAccount.getBalance(),
                                    savingAccount.getInterestRate(),
                                    savedCustomer.getId());
                        }
                    } catch (Exception e) {
                        System.err.println("Error seeding customer: " + e.getMessage());
                    }
                });
                
            // Add some operations to accounts
            bankAccountService.listBankAccounts().forEach(account -> {
                for (int i = 0; i < 5; i++) {
                    try {
                        if (Math.random() > 0.5) {
                            bankAccountService.credit(account.getId(), 500 + Math.random() * 1000, "Deposit");
                        } else {
                            bankAccountService.debit(account.getId(), 100 + Math.random() * 300, "Withdrawal");
                        }
                    } catch (Exception e) {
                        System.err.println("Error adding operation: " + e.getMessage());
                    }
                }
            });
            
            System.out.println("Database seeding complete!");
        };
    }
}
