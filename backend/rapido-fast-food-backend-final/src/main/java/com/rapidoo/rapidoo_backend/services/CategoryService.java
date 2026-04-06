package com.rapidoo.rapidoo_backend.services;


import com.rapidoo.rapidoo_backend.model.Category;
import com.rapidoo.rapidoo_backend.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    public Optional<Category> updatePartial(Long id, Map<String, Object> updates) {
        return categoryRepository.findById(id).map(category -> {
            if (updates.containsKey("name")) {
                category.setName((String) updates.get("name"));
            }
            if (updates.containsKey("imageUrl")) category.setImageUrl((String) updates.get("imageUrl"));

            
            return categoryRepository.save(category);
        });
    }

    public boolean delete(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}