package ma.digitbank.jeespringangularjwtdigitalbanking.security.service;

import ma.digitbank.jeespringangularjwtdigitalbanking.security.entities.AppRole;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.entities.AppUser;

import java.util.List;

public interface SecurityService {
    AppUser saveNewUser(String username, String password, String confirmedPassword);
    AppRole saveNewRole(String roleName);
    void addRoleToUser(String username, String roleName);
    void removeRoleFromUser(String username, String roleName);
    AppUser loadUserByUsername(String username);
    List<AppUser> listUsers();
    
    boolean changePassword(String username, String oldPassword, String newPassword);
}
