package com.rapidoo.rapidoo_backend.contoller;

import com.rapidoo.rapidoo_backend.model.Product;
import com.rapidoo.rapidoo_backend.services.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200") 
public class ProductController {

    @Autowired
    private ProductService productService; 

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.findAll();
    }
    
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.save(product);
    }
    
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.findByCategory(categoryId);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<Product> UpdateProduct(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return productService.updatePartial(id, updates)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productService.delete(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}