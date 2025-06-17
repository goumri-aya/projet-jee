package ma.digitbank.jeespringangularjwtdigitalbanking.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.CustomerDTO;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CustomerNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.services.BankAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@AllArgsConstructor
@Tag(name = "Customer Management")
@CrossOrigin("*")
public class CustomerRestController {
    
    private BankAccountService bankAccountService;
    
    @GetMapping
    @Operation(summary = "Get all customers")
    public List<CustomerDTO> getAllCustomers() {
        return bankAccountService.listCustomers();
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search customers by name")
    public List<CustomerDTO> searchCustomers(@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        return bankAccountService.searchCustomers(keyword);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID")
    public ResponseEntity<?> getCustomer(@PathVariable Long id) {
        try {
            CustomerDTO customerDTO = bankAccountService.getCustomer(id);
            return ResponseEntity.ok(customerDTO);
        } catch (CustomerNotFoundException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping
    @Operation(summary = "Create a new customer")
    @PreAuthorize("hasAuthority('ADMIN')")
    public CustomerDTO saveCustomer(@RequestBody CustomerDTO customerDTO) {
        return bankAccountService.saveCustomer(customerDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing customer")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO customerDTO) {
        try {
            // Ensure the ID matches the path variable
            customerDTO.setId(id);
            
            // Check if the customer exists
            bankAccountService.getCustomer(id);
            
            CustomerDTO updatedCustomer = bankAccountService.updateCustomer(customerDTO);
            return ResponseEntity.ok(updatedCustomer);
        } catch (CustomerNotFoundException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a customer")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        try {
            // Verify customer exists before deletion
            bankAccountService.getCustomer(id);
            
            bankAccountService.deleteCustomer(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Customer deleted successfully");
            return ResponseEntity.ok(response);
        } catch (CustomerNotFoundException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/by-email/{email}")
    @Operation(summary = "Find customer by email")
    public ResponseEntity<?> getCustomerByEmail(@PathVariable String email) {
        CustomerDTO customerDTO = bankAccountService.getCustomerByEmail(email);
        
        if (customerDTO == null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Customer not found with email: " + email);
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        return ResponseEntity.ok(customerDTO);
    }
}
