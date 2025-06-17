package ma.digitbank.jeespringangularjwtdigitalbanking.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.AccountStatus;

@Data
@EqualsAndHashCode(callSuper = true)
public class SavingAccountDTO extends BankAccountDTO {
    private double interestRate;
    private AccountStatus status; // Ensure status is included if needed
    private String type = "SAVING"; // Add type for discriminator
    private String currency;

      public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
