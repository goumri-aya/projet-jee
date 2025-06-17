package ma.digitbank.jeespringangularjwtdigitalbanking.security.repositories;

import ma.digitbank.jeespringangularjwtdigitalbanking.security.entities.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppRoleRepository extends JpaRepository<AppRole, Long> {
    AppRole findByRoleName(String roleName);
}
