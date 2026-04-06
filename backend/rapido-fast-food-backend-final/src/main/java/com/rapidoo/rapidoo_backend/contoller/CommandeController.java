package com.rapidoo.rapidoo_backend.contoller;

import com.rapidoo.rapidoo_backend.model.Commande;
import com.rapidoo.rapidoo_backend.services.CommandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/commandes")
@CrossOrigin(origins = "*")
public class CommandeController {

    @Autowired
    private CommandeService commandeService;

    @GetMapping
    public List<Commande> getAllCommandes() {
        return commandeService.findAll();
    }

    @GetMapping("/search")
    public List<Commande> getCommandesByDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return commandeService.findByDate(date);
    }

    @PostMapping
    public ResponseEntity<Commande> createCommande(@RequestBody Commande commande) {
        return ResponseEntity.ok(commandeService.save(commande));
    }
}
