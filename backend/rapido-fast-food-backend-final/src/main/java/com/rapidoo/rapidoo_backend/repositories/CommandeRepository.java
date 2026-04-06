package com.rapidoo.rapidoo_backend.repositories;

import com.rapidoo.rapidoo_backend.model.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByDate(LocalDate date);
    long countByDate(LocalDate date);
}
