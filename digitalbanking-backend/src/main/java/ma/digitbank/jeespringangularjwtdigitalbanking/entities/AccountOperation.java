package ma.digitbank.jeespringangularjwtdigitalbanking.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.OperationType;

import java.util.Date;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class AccountOperation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date operationDate;
    private double amount;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private OperationType type;
    
    @ManyToOne
    private BankAccount bankAccount;
    
    @Column(name = "created_by")
    private String createdBy;
}
