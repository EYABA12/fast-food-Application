package com.rapidoo.rapidoo_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rapidoo.rapidoo_backend.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}