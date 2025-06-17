package ma.digitbank.jeespringangularjwtdigitalbanking.security.config;

import lombok.RequiredArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.security.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer; 

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())  // Enable CORS with default settings
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(req -> 
                req.requestMatchers(
                       "/api/auth/**", 
                       "/h2-console/**", 
                       "/swagger-ui/**", 
                       "/swagger-ui.html",
                       "/v3/api-docs/**"
                   )
                   .permitAll()
                   // Autoriser ces endpoints avec une authentification
                   .requestMatchers(
                       "/api/dashboard/**",
                       "/api/customers/**",
                       "/api/accounts/**",
                       "/api/user-stats/**",
                       "/api/admin/**"
                   )
                   .authenticated()
                   .anyRequest()
                   .authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers.frameOptions().disable()); // Pour H2 console

        return http.build();
    }
}