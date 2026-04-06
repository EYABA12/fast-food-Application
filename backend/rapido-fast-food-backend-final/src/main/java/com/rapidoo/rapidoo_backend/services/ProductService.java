package com.rapidoo.rapidoo_backend.services;

import com.rapidoo.rapidoo_backend.model.Category;
import com.rapidoo.rapidoo_backend.model.Product;
import com.rapidoo.rapidoo_backend.repositories.ProductRepository;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ObjectMapper objectMapper;
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public List<Product> findByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> updatePartial(Long id, Map<String, Object> updates) {
        return productRepository.findById(id).map(product -> {
            // 1. Champs simples
            if (updates.containsKey("name")) product.setName((String) updates.get("name"));
            if (updates.containsKey("description")) product.setDescription((String) updates.get("description"));
            if (updates.containsKey("available")) product.setAvailable((boolean) updates.get("available"));
            if (updates.containsKey("imageUrl")) product.setImageUrl((String) updates.get("imageUrl"));

            // 2. Gestion du Prix (sécurisée pour le null)
            if (updates.containsKey("price")) {
                Object p = updates.get("price");
                product.setPrice(p != null ? Double.parseDouble(p.toString()) : null);
            }

            // 3. Gestion de la Catégorie
            if (updates.containsKey("category") && updates.get("category") != null) {
                Map<String, Object> catMap = (Map<String, Object>) updates.get("category");
                if (catMap.containsKey("id")) {
                    Category category = new Category();
                    category.setId(Long.valueOf(catMap.get("id").toString()));
                    product.setCategory(category);
                }
            }

           

            return productRepository.save(product);
        });
    }
    public boolean delete(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}