package ma.digitbank.jeespringangularjwtdigitalbanking.security.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.entities.AppUser;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.service.SecurityService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@Tag(name = "User Management")
@CrossOrigin("*")
public class UserManagementController {
    private SecurityService securityService;

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Get all users (Admin only)")
    public List<AppUser> listUsers() {
        return securityService.listUsers();
    }

    @PostMapping("/roles")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Create a new role (Admin only)")
    public void saveRole(@RequestBody RoleForm roleForm) {
        securityService.saveNewRole(roleForm.getRoleName());
    }

    @PostMapping("/roles/assign")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Assign role to user (Admin only)")
    public void addRoleToUser(@RequestBody RoleUserForm roleUserForm) {
        securityService.addRoleToUser(roleUserForm.getUsername(), roleUserForm.getRoleName());
    }

    @PostMapping("/roles/remove")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Remove role from user (Admin only)")
    public void removeRoleFromUser(@RequestBody RoleUserForm roleUserForm) {
        securityService.removeRoleFromUser(roleUserForm.getUsername(), roleUserForm.getRoleName());
    }
}

@Data
class RoleForm {
    private String roleName;
}

@Data
class RoleUserForm {
    private String username;
    private String roleName;
}
