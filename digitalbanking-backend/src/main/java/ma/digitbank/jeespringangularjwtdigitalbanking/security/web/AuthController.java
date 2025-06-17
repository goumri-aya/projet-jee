package ma.digitbank.jeespringangularjwtdigitalbanking.security.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.dtos.*;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.entities.AppUser;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.jwt.JwtUtils;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.service.SecurityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@Tag(name = "Authentication")
@CrossOrigin("*")
public class AuthController {
    private AuthenticationManager authenticationManager;
    private JwtUtils jwtUtils;
    private SecurityService securityService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and generate JWT token")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), roles));
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid username or password");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/signup")
    @Operation(summary = "Register a new user")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        try {
            if (!signupRequest.getPassword().equals(signupRequest.getConfirmedPassword())) {
                throw new RuntimeException("Passwords don't match");
            }
            
            AppUser user = securityService.saveNewUser(
                signupRequest.getUsername(), 
                signupRequest.getPassword(),
                signupRequest.getConfirmedPassword()
            );
            
            // By default, add USER role to new users
            securityService.addRoleToUser(user.getUsername(), "USER");
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/changePassword")
    @Operation(summary = "Change user password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            
            boolean success = securityService.changePassword(username, request.getOldPassword(), request.getNewPassword());
            
            if (success) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Password changed successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "Old password is incorrect");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/profile")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            AppUser user = securityService.loadUserByUsername(username);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            UserProfileResponse profile = new UserProfileResponse();
            profile.setUsername(user.getUsername());
            profile.setActive(user.isActive());
            profile.setRoles(user.getRoles().stream()
                .map(role -> role.getRoleName())
                .collect(Collectors.toList()));
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

@lombok.Data
class UserProfileResponse {
    private String username;
    private boolean active;
    private List<String> roles;
}
