package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LearningResourceRepository extends JpaRepository<LearningResource, String> {

    Optional<LearningResource> findByUrl(String url);

    boolean existsByUrl(String url);
}
