package com.ssehub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ssehub.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {}