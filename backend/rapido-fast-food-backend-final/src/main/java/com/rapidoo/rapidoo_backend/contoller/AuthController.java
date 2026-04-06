package com.rapidoo.rapidoo_backend.contoller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.rapidoo.rapidoo_backend.model.User;
import com.rapidoo.rapidoo_backend.security.JwtUtil;
import com.rapidoo.rapidoo_backend.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") 
public class AuthController {

	   @Autowired
	    private UserService clientService;
	    @Autowired
	    private JwtUtil jwtUtil;

	    @PostMapping("/connexion")
	    public String login(@RequestBody User client) {
	        User authenticatedClient = clientService.authenticate(client.getEmail(), client.getPassword());
	        return jwtUtil.generateToken(authenticatedClient.getEmail());
	    }

	    @PostMapping("/inscription")
	    public User createClient(@Valid @RequestBody User client) {
	        return clientService.registerUser(client);
	    }
	    @GetMapping("/{email}")
	    public ResponseEntity<?> getUserProfile(@PathVariable String email) {
	        User user = clientService.findByEmail(email);
	        if (user != null) {
	            return ResponseEntity.ok(user);
	        } else {
	            return ResponseEntity.status(404).body("Utilisateur non trouvé");
	        }
	    }
}