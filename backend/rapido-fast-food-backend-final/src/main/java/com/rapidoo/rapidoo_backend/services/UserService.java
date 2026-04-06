package com.rapidoo.rapidoo_backend.services;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.rapidoo.rapidoo_backend.exception.AuthenticationException;
import com.rapidoo.rapidoo_backend.exception.DuplicateEmailException;
import com.rapidoo.rapidoo_backend.model.User;
import com.rapidoo.rapidoo_backend.repositories.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Injection par constructeur (recommandée)
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        userRepository.findByEmail(user.getEmail())
            .ifPresent(u -> {
                throw new DuplicateEmailException(
                    "Email déjà utilisé : " + user.getEmail()
                );
            });

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                new AuthenticationException("Email ou mot de passe incorrect")
            );

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AuthenticationException("Email ou mot de passe incorrect");
        }

        return user;
    }
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null); 
        // Retourne l'utilisateur s'il existe, sinon null
    }
}
