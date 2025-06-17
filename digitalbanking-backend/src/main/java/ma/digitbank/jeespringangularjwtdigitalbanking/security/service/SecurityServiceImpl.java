package ma.digitbank.jeespringangularjwtdigitalbanking.security.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.entities.AppRole;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.entities.AppUser;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.repositories.AppRoleRepository;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.repositories.AppUserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class SecurityServiceImpl implements SecurityService {
    private final AppUserRepository appUserRepository;
    private final AppRoleRepository appRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AppUser saveNewUser(String username, String password, String confirmedPassword) {
        if(!password.equals(confirmedPassword)) throw new RuntimeException("Passwords don't match");
        if(appUserRepository.findByUsername(username) != null) throw new RuntimeException("User already exists");
        
        AppUser appUser = new AppUser();
        appUser.setUsername(username);
        appUser.setPassword(passwordEncoder.encode(password));
        appUser.setActive(true);
        
        return appUserRepository.save(appUser);
    }

    @Override
    public AppRole saveNewRole(String roleName) {
        if(appRoleRepository.findByRoleName(roleName) != null) throw new RuntimeException("Role already exists");
        
        AppRole appRole = new AppRole();
        appRole.setRoleName(roleName);
        
        return appRoleRepository.save(appRole);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        AppUser appUser = appUserRepository.findByUsername(username);
        if(appUser == null) throw new RuntimeException("User not found");
        
        AppRole appRole = appRoleRepository.findByRoleName(roleName);
        if(appRole == null) throw new RuntimeException("Role not found");
        
        appUser.getRoles().add(appRole);
    }

    @Override
    public void removeRoleFromUser(String username, String roleName) {
        AppUser appUser = appUserRepository.findByUsername(username);
        if(appUser == null) throw new RuntimeException("User not found");
        
        AppRole appRole = appRoleRepository.findByRoleName(roleName);
        if(appRole == null) throw new RuntimeException("Role not found");
        
        appUser.getRoles().remove(appRole);
    }

    @Override
    public AppUser loadUserByUsername(String username) {
        return appUserRepository.findByUsername(username);
    }

    @Override
    public List<AppUser> listUsers() {
        return appUserRepository.findAll();
    }

    @Override
    public boolean changePassword(String username, String oldPassword, String newPassword) {
        AppUser appUser = appUserRepository.findByUsername(username);
        if(appUser == null) throw new RuntimeException("User not found");
        
        if(passwordEncoder.matches(oldPassword, appUser.getPassword())) {
            appUser.setPassword(passwordEncoder.encode(newPassword));
            appUserRepository.save(appUser);
            return true;
        }
        return false;
    }
}
