package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.CreateLearningResourceRequest;
import de.tum.cit.memo.dto.UpdateLearningResourceRequest;
import de.tum.cit.memo.entity.LearningResource;
import de.tum.cit.memo.exception.ResourceAlreadyExistsException;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.LearningResourceRepository;
import de.tum.cit.memo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class LearningResourceService {

    private final LearningResourceRepository learningResourceRepository;

    @Transactional
    public LearningResource createLearningResource(CreateLearningResourceRequest request) {
        if (learningResourceRepository.existsByUrl(request.getUrl())) {
            throw new ResourceAlreadyExistsException("Learning resource with this URL already exists");
        }

        LearningResource resource = LearningResource.builder()
            .id(IdGenerator.generateCuid())
            .title(request.getTitle())
            .url(request.getUrl())
            .build();

        return learningResourceRepository.save(resource);
    }

    @Transactional(readOnly = true)
    public LearningResource getLearningResourceById(String id) {
        return learningResourceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found"));
    }

    @Transactional(readOnly = true)
    public Optional<LearningResource> getLearningResourceByUrl(String url) {
        return learningResourceRepository.findByUrl(url);
    }

    @Transactional(readOnly = true)
    public List<LearningResource> getAllLearningResources() {
        return learningResourceRepository.findAll();
    }

    @Transactional
    public LearningResource updateLearningResource(String id, UpdateLearningResourceRequest request) {
        LearningResource resource = getLearningResourceById(id);

        if (request.getTitle() != null) {
            resource.setTitle(request.getTitle());
        }
        if (request.getUrl() != null) {
            resource.setUrl(request.getUrl());
        }

        return learningResourceRepository.save(resource);
    }

    @Transactional
    public void deleteLearningResource(String id) {
        if (!learningResourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Learning resource not found");
        }
        learningResourceRepository.deleteById(id);
    }
}
