package de.tum.cit.memo.service;

import de.tum.cit.memo.dto.ContributorStatsResponse;
import de.tum.cit.memo.dto.ContributorStatsResponse.DailyCount;
import de.tum.cit.memo.repository.CompetencyRelationshipVoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Computes contributor statistics on-the-fly from vote timestamps.
 * All date calculations use UTC.
 */
@Service
@RequiredArgsConstructor
public class ContributorStatsService {

    private final CompetencyRelationshipVoteRepository voteRepository;

    @Transactional(readOnly = true)
    public ContributorStatsResponse getStats(String userId) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        LocalDate since = today.minusDays(365);
        Instant sinceInstant = since.atStartOfDay(ZoneOffset.UTC).toInstant();

        // Fetch raw daily counts from votes
        List<Object[]> rawCounts = voteRepository.findDailyVoteCountsByUserId(userId, sinceInstant);

        // Build ordered map of date -> count
        Map<LocalDate, Integer> countMap = new LinkedHashMap<>();
        int totalVotes = 0;
        for (Object[] row : rawCounts) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();
            int count = ((Number) row[1]).intValue();
            countMap.put(date, count);
            totalVotes += count;
        }

        // Also count votes before the 365-day window
        long olderVotes = voteRepository.countByUserId(userId) - totalVotes;
        totalVotes += (int) Math.max(olderVotes, 0);

        // Build daily counts list for heatmap
        List<DailyCount> dailyCounts = new ArrayList<>();
        for (Map.Entry<LocalDate, Integer> entry : countMap.entrySet()) {
            dailyCounts.add(DailyCount.builder()
                    .date(entry.getKey())
                    .count(entry.getValue())
                    .build());
        }

        // Calculate streaks
        int currentStreak = calculateCurrentStreak(countMap, today);
        int longestStreak = calculateLongestStreak(countMap, since, today);

        // Evaluate badges
        List<String> earnedBadges = evaluateBadges(totalVotes, currentStreak, longestStreak);

        return ContributorStatsResponse.builder()
                .totalVotes(totalVotes)
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .dailyCounts(dailyCounts)
                .earnedBadges(earnedBadges)
                .build();
    }

    /**
     * Current streak: count consecutive days ending at today (or yesterday).
     */
    private int calculateCurrentStreak(Map<LocalDate, Integer> countMap, LocalDate today) {
        // Check if the user contributed today; if not, start from yesterday
        LocalDate checkDate = countMap.containsKey(today) ? today : today.minusDays(1);
        int streak = 0;
        while (countMap.containsKey(checkDate) && countMap.get(checkDate) > 0) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }
        return streak;
    }

    /**
     * Longest streak within the daily counts window.
     */
    private int calculateLongestStreak(Map<LocalDate, Integer> countMap, LocalDate since, LocalDate today) {
        int longest = 0;
        int current = 0;
        LocalDate d = since;
        while (!d.isAfter(today)) {
            if (countMap.containsKey(d) && countMap.get(d) > 0) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 0;
            }
            d = d.plusDays(1);
        }
        return longest;
    }

    /**
     * Evaluate which badges the user has earned.
     */
    private List<String> evaluateBadges(int totalVotes, int currentStreak, int longestStreak) {
        List<String> badges = new ArrayList<>();
        int maxStreak = Math.max(currentStreak, longestStreak);

        if (totalVotes >= 1) {
            badges.add("first-steps");
        }
        if (totalVotes >= 10) {
            badges.add("getting-started");
        }
        if (totalVotes >= 50) {
            badges.add("half-century");
        }
        if (totalVotes >= 100) {
            badges.add("century");
        }
        if (maxStreak >= 3) {
            badges.add("streak-3");
        }
        if (maxStreak >= 7) {
            badges.add("streak-7");
        }
        if (maxStreak >= 30) {
            badges.add("streak-30");
        }

        return badges;
    }
}
