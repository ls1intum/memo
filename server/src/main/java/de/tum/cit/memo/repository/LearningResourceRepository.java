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

    @Query(value = "SELECT id FROM learning_resources ORDER BY RANDOM() LIMIT :count", nativeQuery = true)
    List<String> findRandomLearningResourceIds(@Param("count") int count);

    @Query("SELECT lr.id FROM LearningResource lr ORDER BY lr.resourceLinkDegree ASC")
    List<String> findIdsByResourceLinkDegreeAsc(org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE LearningResource lr SET lr.resourceLinkDegree = lr.resourceLinkDegree + 1 WHERE lr.id IN :ids")
    void incrementResourceLinkDegree(@Param("ids") List<String> ids);

    @org.springframework.data.jpa.repository.Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "UPDATE learning_resources SET resource_link_degree = GREATEST(resource_link_degree - 1, 0) WHERE id IN :ids", nativeQuery = true)
    void decrementResourceLinkDegree(@Param("ids") List<String> ids);
}
