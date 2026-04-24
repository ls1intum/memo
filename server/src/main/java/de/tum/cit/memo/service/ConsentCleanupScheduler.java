package de.tum.cit.memo.service;

import de.tum.cit.memo.config.MemoProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Scheduler for cleaning up accounts that haven't accepted the consent agreement within the TTL period.
 * Runs daily at 2:00 AM UTC to delete accounts older than the configured TTL that haven't accepted consent.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ConsentCleanupScheduler {

    private final UserService userService;
    private final MemoProperties memoProperties;

    @Scheduled(cron = "0 0 2 * * *", zone = "UTC")
    public void cleanupExpiredConsentAccounts() {
        long ttlDays = memoProperties.getConsentTtlDays();
        log.info("Starting consent cleanup job: deleting accounts with expired TTL ({}+ days without consent)", ttlDays);
        try {
            int deleted = userService.deleteUsersWithExpiredConsentTtl(ttlDays);
            log.info("Consent cleanup job completed successfully, deleted {} accounts", deleted);
        } catch (Exception e) {
            log.error("Error during consent cleanup job", e);
        }
    }
}
