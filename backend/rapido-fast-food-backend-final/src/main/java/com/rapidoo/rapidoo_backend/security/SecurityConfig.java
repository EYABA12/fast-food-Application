package com.rapidoo.rapidoo_backend.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
	   @Autowired
	    private JwtFilter jwtFilter;

	    @Bean
	    public BCryptPasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }

	    @Bean
	    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	        http
	        	.cors(Customizer.withDefaults())
	        	.csrf(csrf -> csrf.disable())
	            .headers(headers -> headers.frameOptions(frame -> frame.disable())) 

	            .authorizeHttpRequests(auth -> auth
	            		 .requestMatchers(
	                             "/api/auth/inscription**",
	                             "/api/auth/connexion**"    

	                         ).permitAll()	               
	            		 .anyRequest().authenticated())
	            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

	        return http.build();
	    }
}
