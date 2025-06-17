package ma.digitbank.jeespringangularjwtdigitalbanking.dtos;

import lombok.Data;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.AccountStatus;

import java.util.Date;

@Data
public abstract class BankAccountDTO {
    private String id;
    private double balance;
    private Date createdAt;
    private AccountStatus status;
    private CustomerDTO customerDTO;
    private String type;
}
