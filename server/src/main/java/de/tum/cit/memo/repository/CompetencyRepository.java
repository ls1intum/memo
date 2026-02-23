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
}
