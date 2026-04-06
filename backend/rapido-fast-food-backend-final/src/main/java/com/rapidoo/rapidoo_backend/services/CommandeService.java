package com.rapidoo.rapidoo_backend.services;

import com.rapidoo.rapidoo_backend.model.Commande;
import com.rapidoo.rapidoo_backend.repositories.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CommandeService {

    @Autowired
    private CommandeRepository commandeRepository;

    public List<Commande> findAll() {
        return commandeRepository.findAll();
    }

    public List<Commande> findByDate(LocalDate date) {
        return commandeRepository.findByDate(date);
    }

    public Optional<Commande> findById(Long id) {
        return commandeRepository.findById(id);
    }

    public Commande save(Commande commande) {
        // 1. On fixe la date si elle n'existe pas
        if (commande.getDate() == null) {
            commande.setDate(LocalDate.now());
        }

        // 2. On compte les commandes du jour J et on fait +1
        long nbCommandesAujourdhui = commandeRepository.countByDate(commande.getDate());
        commande.setOrderNumber(String.valueOf(nbCommandesAujourdhui + 1));

        // 3. Liaison avec les produits
        if (commande.getProduits() != null) {
            commande.getProduits().forEach(item -> item.setCommande(commande));
        }
        return commandeRepository.save(commande);
    }
}
