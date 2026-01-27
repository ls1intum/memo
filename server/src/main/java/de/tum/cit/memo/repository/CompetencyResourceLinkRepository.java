package de.tum.cit.memo.repository;

import de.tum.cit.memo.entity.CompetencyResourceLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompetencyResourceLinkRepository extends JpaRepository<CompetencyResourceLink, String> {
}
