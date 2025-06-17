package ma.digitbank.jeespringangularjwtdigitalbanking.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import ma.digitbank.jeespringangularjwtdigitalbanking.entities.AccountOperation;
import ma.digitbank.jeespringangularjwtdigitalbanking.entities.BankAccount;
import ma.digitbank.jeespringangularjwtdigitalbanking.repositories.AccountOperationRepository;
import ma.digitbank.jeespringangularjwtdigitalbanking.repositories.BankAccountRepository;
import ma.digitbank.jeespringangularjwtdigitalbanking.repositories.CustomerRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-stats")
@AllArgsConstructor
@Tag(name = "User Statistics")
@CrossOrigin("*")
public class UserStatisticsController {

    private AccountOperationRepository accountOperationRepository;
    private BankAccountRepository bankAccountRepository;
    private CustomerRepository customerRepository;

    @GetMapping("/operations-summary")
    @Operation(summary = "Get summary of operations performed by the current user")
    public Map<String, Object> getOperationsSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        List<AccountOperation> userOperations = accountOperationRepository.findAll().stream()
                .filter(op -> currentUser.equals(op.getCreatedBy()))
                .collect(Collectors.toList());
        
        summary.put("totalOperationsPerformed", userOperations.size());
        
        // Operations per type
        Map<String, Long> operationsByType = userOperations.stream()
                .collect(Collectors.groupingBy(
                        op -> op.getType().toString(),
                        Collectors.counting()
                ));
        summary.put("operationsByType", operationsByType);
        
        // Total amount handled
        double totalAmountHandled = userOperations.stream()
                .mapToDouble(AccountOperation::getAmount)
                .sum();
        summary.put("totalAmountHandled", totalAmountHandled);
        
        // List of recent operations (last 5)
        List<OperationSummary> recentOperations = userOperations.stream()
                .sorted((o1, o2) -> o2.getOperationDate().compareTo(o1.getOperationDate()))
                .limit(5)
                .map(op -> new OperationSummary(
                        op.getId(),
                        op.getType().toString(),
                        op.getAmount(),
                        op.getDescription(),
                        op.getOperationDate(),
                        op.getBankAccount().getId()
                ))
                .collect(Collectors.toList());
        summary.put("recentOperations", recentOperations);
        
        return summary;
    }

    @GetMapping("/accounts-created")
    @Operation(summary = "Get accounts created by the current user")
    public Map<String, Object> getAccountsCreated() {
        Map<String, Object> result = new HashMap<>();
        
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        List<BankAccount> accountsCreated = bankAccountRepository.findAll().stream()
                .filter(acc -> currentUser.equals(acc.getCreatedBy()))
                .collect(Collectors.toList());
        
        result.put("totalAccountsCreated", accountsCreated.size());
        
        // Accounts by type
        Map<String, Long> accountsByType = accountsCreated.stream()
                .collect(Collectors.groupingBy(
                        acc -> acc.getClass().getSimpleName(),
                        Collectors.counting()
                ));
        result.put("accountsByType", accountsByType);
        
        // Accounts by status
        Map<String, Long> accountsByStatus = accountsCreated.stream()
                .collect(Collectors.groupingBy(
                        acc -> acc.getStatus().toString(),
                        Collectors.counting()
                ));
        result.put("accountsByStatus", accountsByStatus);
        
        return result;
    }

    @GetMapping("/customers-created")
    @Operation(summary = "Get customers created by the current user")
    public Map<String, Object> getCustomersCreated() {
        Map<String, Object> result = new HashMap<>();
        
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        long customersCreated = customerRepository.findAll().stream()
                .filter(customer -> currentUser.equals(customer.getCreatedBy()))
                .count();
        
        result.put("totalCustomersCreated", customersCreated);
        
        return result;
    }
}

@Data
class OperationSummary {
    private Long id;
    private String type;
    private double amount;
    private String description;
    private java.util.Date date;
    private String accountId;
    
    public OperationSummary(Long id, String type, double amount, String description, java.util.Date date, String accountId) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.date = date;
        this.accountId = accountId;
    }
}
