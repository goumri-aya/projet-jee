package ma.digitbank.jeespringangularjwtdigitalbanking;

import ma.digitbank.jeespringangularjwtdigitalbanking.security.service.SecurityService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class JeeSpringAngularJwtDigitalBankingApplication {

    public static void main(String[] args) {
        SpringApplication.run(JeeSpringAngularJwtDigitalBankingApplication.class, args);
    }

    @Bean
    CommandLineRunner start(SecurityService securityService) {
        return args -> {
            try {
                securityService.saveNewRole("ADMIN");
                securityService.saveNewRole("USER");

                securityService.saveNewUser("admin", "admin", "admin");
                securityService.saveNewUser("user", "1234", "1234");

                securityService.addRoleToUser("admin", "ADMIN");
                securityService.addRoleToUser("admin", "USER");
                securityService.addRoleToUser("user", "USER");
            } catch (Exception e) {
                // Roles ou utilisateurs déjà existants
            }
        };
    }
}
