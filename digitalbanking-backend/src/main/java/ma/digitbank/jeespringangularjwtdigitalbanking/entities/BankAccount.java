package ma.digitbank.jeespringangularjwtdigitalbanking.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.AccountStatus;

import java.util.Date;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "TYPE", length = 10)
@Data @NoArgsConstructor @AllArgsConstructor
public abstract class BankAccount {
    @Id
    private String id;
    private double balance;
    private Date createdAt;
    private String currency;
    
    @Enumerated(EnumType.STRING)
    private AccountStatus status;
    
    @ManyToOne
    private Customer customer;
    
    @OneToMany(mappedBy = "bankAccount", fetch = FetchType.LAZY)
    private List<AccountOperation> accountOperations;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "last_modified_by")
    private String lastModifiedBy;
}
