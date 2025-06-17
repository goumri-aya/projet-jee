package ma.digitbank.jeespringangularjwtdigitalbanking.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String phone;
    
    @OneToMany(mappedBy = "customer")
    private List<BankAccount> accounts;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "last_modified_by")
    private String lastModifiedBy;
}
