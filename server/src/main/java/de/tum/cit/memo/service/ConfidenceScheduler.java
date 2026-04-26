package de.tum.cit.memo.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ConfidenceScheduler {

    private final ConfidenceService confidenceService;

    @Scheduled(fixedDelay = 300_000)
    public void recomputeAll() {
        log.debug("Scheduled confidence recomputation starting");
        confidenceService.recomputeAll();
    }
}
