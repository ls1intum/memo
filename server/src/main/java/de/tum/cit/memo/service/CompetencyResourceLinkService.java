package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.CreateCompetencyResourceLinkRequest;
import de.tum.cit.memo.entity.CompetencyResourceLink;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.CompetencyResourceLinkRepository;
import de.tum.cit.memo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CompetencyResourceLinkService {

    private final CompetencyResourceLinkRepository linkRepository;

    @Transactional
    public CompetencyResourceLink createLink(CreateCompetencyResourceLinkRequest request) {
        CompetencyResourceLink link = CompetencyResourceLink.builder()
            .id(IdGenerator.generateCuid())
            .competencyId(request.getCompetencyId())
            .resourceId(request.getResourceId())
            .userId(request.getUserId())
            .matchType(request.getMatchType())
            .build();

        return linkRepository.save(link);
    }

    @Transactional(readOnly = true)
    public CompetencyResourceLink getLinkById(String id) {
        return linkRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Competency resource link not found"));
    }

    @Transactional(readOnly = true)
    public List<CompetencyResourceLink> getAllLinks() {
        return linkRepository.findAll();
    }

    @Transactional
    public void deleteLink(String id) {
        if (!linkRepository.existsById(id)) {
            throw new ResourceNotFoundException("Competency resource link not found");
        }
        linkRepository.deleteById(id);
    }
}
