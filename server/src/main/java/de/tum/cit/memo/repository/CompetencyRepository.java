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

    List<Competency> findTop30ByOrderByDegreeAsc();

    @org.springframework.data.jpa.repository.Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("UPDATE Competency c SET c.degree = c.degree + 1 WHERE c.id IN :ids")
    void incrementDegree(@Param("ids") List<String> ids);
}
