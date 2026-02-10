package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.Competency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompetencyRepository extends JpaRepository<Competency, String> {

    @Query(value = "SELECT * FROM competencies ORDER BY RANDOM() LIMIT :count", nativeQuery = true)
    List<Competency> findRandomCompetencies(@Param("count") int count);

    @Query(value = "SELECT id FROM competencies ORDER BY RANDOM() LIMIT :count", nativeQuery = true)
    List<String> findRandomCompetencyIds(@Param("count") int count);

    @Query("SELECT c.id FROM Competency c ORDER BY c.degree ASC")
    List<String> findTop20IdsByDegreeAsc(org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Competency c SET c.degree = c.degree + 1 WHERE c.id IN :ids")
    void incrementDegree(@Param("ids") List<String> ids);

    @org.springframework.data.jpa.repository.Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "UPDATE competencies SET degree = GREATEST(degree - 1, 0) WHERE id IN :ids", nativeQuery = true)
    void decrementDegree(@Param("ids") List<String> ids);
}
