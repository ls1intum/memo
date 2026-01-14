package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningResourceRepository extends JpaRepository<LearningResource, String> {

    Optional<LearningResource> findByUrl(String url);

    boolean existsByUrl(String url);

    @Query(value = "SELECT * FROM learning_resources ORDER BY RANDOM() LIMIT :count", nativeQuery = true)
    List<LearningResource> findRandomLearningResources(@Param("count") int count);
}
