package com.climbCommunity.backend.repository;

import com.climbCommunity.backend.entity.User;
import com.climbCommunity.backend.entity.enums.Status;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUserId(String userId);
    Optional<User> findByEmail(String email);
    Optional<User> findByTel(String tel);
    Optional<User> findByUserIdAndEmail(String userId, String email);
    List<User> findAllByStatusAndDeletedAtBefore(Status status, LocalDateTime cutoff);
    long countByStatus(Status status);
    long countByCreatedAtAfterAndStatus(LocalDateTime dateTime, Status status);
    long countByDeletedAtAfterAndStatus(LocalDateTime dateTime, Status status);
    Page<User> findByUsernameContainingOrUserIdContaining(String username, String userId, Pageable pageable);
    boolean existsByUsername(String username);
    boolean existsByUserId(String userId);
    List<User> findByUserIdStartingWith(String prefix);
    List<User> findByIdNotIn(List<Long> excludedIds);
    boolean existsByEmail(String email);
}
