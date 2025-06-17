package ma.digitbank.jeespringangularjwtdigitalbanking.security.repositories;

import ma.digitbank.jeespringangularjwtdigitalbanking.security.entities.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    AppUser findByUsername(String username);
}
