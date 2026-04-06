package com.rapidoo.rapidoo_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import java.util.UUID;

@Entity
@Table(name = "commandes")

public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column( nullable = false)
    private String orderNumber;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public LocalTime getHeure() {
		return heure;
	}

	public void setHeure(LocalTime heure) {
		this.heure = heure;
	}

	public String getStatut() {
		return statut;
	}

	public void setStatut(String statut) {
		this.statut = statut;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public List<CommandeItem> getProduits() {
		return produits;
	}

	public void setProduits(List<CommandeItem> produits) {
		this.produits = produits;
	}

	@Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime heure;

    @Column(nullable = false)
    private String statut;

    @Column(nullable = false)
    private Double totalAmount;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CommandeItem> produits = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.orderNumber == null || this.orderNumber.isEmpty()) {
            this.orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (this.statut == null || this.statut.isEmpty()) {
            this.statut = "Payée";
        }
    }
}
