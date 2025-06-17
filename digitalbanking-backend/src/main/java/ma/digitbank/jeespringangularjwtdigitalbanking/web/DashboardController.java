package ma.digitbank.jeespringangularjwtdigitalbanking.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import ma.digitbank.jeespringangularjwtdigitalbanking.repositories.AccountOperationRepository;
import ma.digitbank.jeespringangularjwtdigitalbanking.repositories.BankAccountRepository;
import ma.digitbank.jeespringangularjwtdigitalbanking.repositories.CustomerRepository;
import ma.digitbank.jeespringangularjwtdigitalbanking.entities.AccountOperation;
import ma.digitbank.jeespringangularjwtdigitalbanking.entities.BankAccount;
import ma.digitbank.jeespringangularjwtdigitalbanking.entities.Customer;
import ma.digitbank.jeespringangularjwtdigitalbanking.entities.CurrentAccount;
import ma.digitbank.jeespringangularjwtdigitalbanking.entities.SavingAccount;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.OperationType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@AllArgsConstructor
@Tag(name = "Dashboard")
@CrossOrigin("*")
public class DashboardController {

    private CustomerRepository customerRepository;
    private BankAccountRepository bankAccountRepository;
    private AccountOperationRepository accountOperationRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Get dashboard statistics (Admin only)")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Count total customers
        long totalCustomers = customerRepository.count();
        stats.put("totalCustomers", totalCustomers);
        
        // Count total accounts
        long totalAccounts = bankAccountRepository.count();
        stats.put("totalAccounts", totalAccounts);
        
        // Count account types
        List<BankAccount> accounts = bankAccountRepository.findAll();
        long currentAccounts = accounts.stream().filter(a -> a instanceof CurrentAccount).count();
        long savingAccounts = accounts.stream().filter(a -> a instanceof SavingAccount).count();
        stats.put("currentAccounts", currentAccounts);
        stats.put("savingAccounts", savingAccounts);
        
        // Calculate total balance across all accounts
        BigDecimal totalBalance = accounts.stream()
                .map(account -> BigDecimal.valueOf(account.getBalance()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalBalance", totalBalance);
        
        // Get operations statistics
        List<AccountOperation> operations = accountOperationRepository.findAll();
        long totalOperations = operations.size();
        long creditOperations = operations.stream().filter(op -> op.getType() == OperationType.CREDIT).count();
        long debitOperations = operations.stream().filter(op -> op.getType() == OperationType.DEBIT).count();
        stats.put("totalOperations", totalOperations);
        stats.put("creditOperations", creditOperations);
        stats.put("debitOperations", debitOperations);
        
        return stats;
    }

    @GetMapping("/operations/monthly")
    @Operation(summary = "Get monthly operation statistics")
    public List<MonthlyOperationStat> getMonthlyOperationStats() {
        List<AccountOperation> operations = accountOperationRepository.findAll();
        
        Map<String, MonthlyOperationStat> monthlyStats = new HashMap<>();
        
        // Group operations by month
        Calendar calendar = Calendar.getInstance();
        
        for (AccountOperation operation : operations) {
            calendar.setTime(operation.getOperationDate());
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH) + 1; // Calendar.MONTH is 0-based
            
            String key = year + "-" + (month < 10 ? "0" + month : month);
            
            if (!monthlyStats.containsKey(key)) {
                monthlyStats.put(key, new MonthlyOperationStat(key, 0, 0, 0));
            }
            
            MonthlyOperationStat stat = monthlyStats.get(key);
            stat.incrementTotalOperations();
            
            if (operation.getType() == OperationType.CREDIT) {
                stat.incrementCreditOperations();
            } else {
                stat.incrementDebitOperations();
            }
        }
        
        // Sort by date
        return monthlyStats.values().stream()
                .sorted(Comparator.comparing(MonthlyOperationStat::getMonth))
                .collect(Collectors.toList());
    }

    @GetMapping("/customers/accounts")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Get customer account distribution (Admin only)")
    public List<CustomerAccountStat> getCustomerAccountStats() {
        List<Customer> customers = customerRepository.findAll();
        
        return customers.stream().map(customer -> {
            List<BankAccount> customerAccounts = bankAccountRepository.findByCustomerId(customer.getId());
            long currentAccounts = customerAccounts.stream().filter(a -> a instanceof CurrentAccount).count();
            long savingAccounts = customerAccounts.stream().filter(a -> a instanceof SavingAccount).count();
            
            return new CustomerAccountStat(
                    customer.getId(),
                    customer.getName(),
                    customerAccounts.size(),
                    currentAccounts,
                    savingAccounts
            );
        }).collect(Collectors.toList());
    }
}

@Data
class MonthlyOperationStat {
    private String month;
    private int totalOperations;
    private int creditOperations;
    private int debitOperations;
    
    public MonthlyOperationStat(String month, int totalOperations, int creditOperations, int debitOperations) {
        this.month = month;
        this.totalOperations = totalOperations;
        this.creditOperations = creditOperations;
        this.debitOperations = debitOperations;
    }

    public void incrementTotalOperations() {
        this.totalOperations++;
    }

    public void incrementCreditOperations() {
        this.creditOperations++;
    }

    public void incrementDebitOperations() {
        this.debitOperations++;
    }
}

@Data
class CustomerAccountStat {
    private Long customerId;
    private String customerName;
    private int totalAccounts;
    private long currentAccounts;
    private long savingAccounts;
    
    public CustomerAccountStat(Long customerId, String customerName, int totalAccounts, long currentAccounts, long savingAccounts) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.totalAccounts = totalAccounts;
        this.currentAccounts = currentAccounts;
        this.savingAccounts = savingAccounts;
    }
}
