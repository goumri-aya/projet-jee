package ma.digitbank.jeespringangularjwtdigitalbanking.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.*;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.BalanceNotSufficientException;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.BankAccountNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CustomerNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.services.BankAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@AllArgsConstructor
@Tag(name = "Bank Account Management")
@CrossOrigin("*")
public class BankAccountRestController {
    
    private BankAccountService bankAccountService;
    
    @GetMapping
    @Operation(summary = "Get all bank accounts")
    public List<BankAccountDTO> getAllBankAccounts() {
        return bankAccountService.listBankAccounts();
    }
    
    @GetMapping("/{accountId}")
    @Operation(summary = "Get bank account by ID")
    public BankAccountDTO getBankAccount(@PathVariable String accountId) throws BankAccountNotFoundException {
        return bankAccountService.getBankAccount(accountId);
    }
    
    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get accounts for a specific customer")
    public List<BankAccountDTO> getCustomerAccounts(@PathVariable Long customerId) {
        return bankAccountService.getCustomerAccounts(customerId);
    }
    
    @PostMapping("/current")
    @Operation(summary = "Create a new current account")
    public CurrentAccountDTO createCurrentAccount(@RequestBody CurrentAccountRequest request) throws CustomerNotFoundException {
        return bankAccountService.saveCurrentBankAccount(
                request.getInitialBalance(),
                request.getOverDraft(),
                request.getCustomerId()
        );
    }
    
    @PostMapping("/saving")
    @Operation(summary = "Create a new saving account")
    public SavingAccountDTO createSavingAccount(@RequestBody SavingAccountRequest request) throws CustomerNotFoundException {
        return bankAccountService.saveSavingBankAccount(
                request.getInitialBalance(),
                request.getInterestRate(),
                request.getCustomerId()
        );
    }
    
    @PostMapping("/{accountId}/operations/debit")
    @Operation(summary = "Perform debit operation on account")
    public ResponseEntity<?> debit(@PathVariable String accountId, @RequestBody OperationRequest request) {
        try {
            bankAccountService.debit(accountId, request.getAmount(), request.getDescription());
            return ResponseEntity.ok().build();
        } catch (BankAccountNotFoundException | BalanceNotSufficientException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/{accountId}/operations/credit")
    @Operation(summary = "Perform credit operation on account")
    public ResponseEntity<?> credit(@PathVariable String accountId, @RequestBody OperationRequest request) {
        try {
            bankAccountService.credit(accountId, request.getAmount(), request.getDescription());
            return ResponseEntity.ok().build();
        } catch (BankAccountNotFoundException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/transfer")
    @Operation(summary = "Transfer money between accounts")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest request) {
        try {
            bankAccountService.transfer(
                    request.getAccountIdSource(),
                    request.getAccountIdDestination(),
                    request.getAmount()
            );
            return ResponseEntity.ok().build();
        } catch (BankAccountNotFoundException | BalanceNotSufficientException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/{accountId}/operations")
    @Operation(summary = "Get operations for a specific account")
    public List<AccountOperationDTO> getAccountOperations(@PathVariable String accountId) {
        return bankAccountService.accountOperationHistory(accountId);
    }
    
    @GetMapping("/{accountId}/operations/page")
    @Operation(summary = "Get paginated operations for a specific account")
    public AccountHistoryDTO getAccountOperationsPage(
            @PathVariable String accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) throws BankAccountNotFoundException {
        return bankAccountService.accountHistory(accountId, page, size);
    }
}

@Data
class CurrentAccountRequest {
    private double initialBalance;
    private double overDraft;
    private Long customerId;
}

@Data
class SavingAccountRequest {
    private double initialBalance;
    private double interestRate;
    private Long customerId;
}

@Data
class OperationRequest {
    private double amount;
    private String description;
}

@Data
class TransferRequest {
    private String accountIdSource;
    private String accountIdDestination;
    private double amount;
}
