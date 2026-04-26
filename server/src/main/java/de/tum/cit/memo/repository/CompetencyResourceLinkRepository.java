package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.CompetencyResourceLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetencyResourceLinkRepository extends JpaRepository<CompetencyResourceLink, String> {

  /** Returns [resourceCount (Long), avgQuality (Double)] for a competency. */
  @Query(value = """
      SELECT COUNT(*),
             COALESCE(AVG(CASE match_type
                 WHEN 'UNRELATED' THEN 0.0
                 WHEN 'WEAK' THEN 0.33
                 WHEN 'GOOD_FIT' THEN 0.67
                 WHEN 'PERFECT_MATCH' THEN 1.0
                 ELSE 0.0 END), 0.0)
      FROM competency_resource_links
      WHERE competency_id = :id
      """, nativeQuery = true)
  Object[] findResourceStatsForCompetency(@Param("id") String competencyId);
}
