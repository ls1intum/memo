package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.CreateCompetencyRequest;
import de.tum.cit.memo.dto.UpdateCompetencyRequest;
import de.tum.cit.memo.entity.Competency;
import de.tum.cit.memo.exception.ResourceNotFoundException;
import de.tum.cit.memo.repository.CompetencyRepository;
import de.tum.cit.memo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CompetencyService {

    private final CompetencyRepository competencyRepository;

    @Transactional
    public Competency createCompetency(CreateCompetencyRequest request) {
        Competency competency = Competency.builder()
            .id(IdGenerator.generateCuid())
            .title(request.getTitle())
            .description(request.getDescription())
            .build();

        return competencyRepository.save(competency);
    }

    @Transactional(readOnly = true)
    public Competency getCompetencyById(String id) {
        return competencyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Competency not found"));
    }

    @Transactional(readOnly = true)
    public List<Competency> getAllCompetencies() {
        return competencyRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Competency> getRandomCompetencies(int count) {
        if (count <= 0) {
            return List.of();
        }
        return competencyRepository.findRandomCompetencies(count);
    }

    @Transactional
    public Competency updateCompetency(String id, UpdateCompetencyRequest request) {
        Competency competency = getCompetencyById(id);

        if (request.getTitle() != null) {
            competency.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            competency.setDescription(request.getDescription());
        }

        return competencyRepository.save(competency);
    }

    @Transactional
    public void deleteCompetency(String id) {
        if (!competencyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Competency not found");
        }
        competencyRepository.deleteById(id);
    }
}
