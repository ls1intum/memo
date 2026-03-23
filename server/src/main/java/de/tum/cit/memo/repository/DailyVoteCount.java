package de.tum.cit.memo.repository;

import java.time.LocalDate;

/**
 * Spring Data projection for daily vote counts returned by native queries.
 * {@code voteDate} is {@code null} for the pre-window sentinel row.
 */
public interface DailyVoteCount {
    LocalDate getVoteDate();

    Long getVoteCount();
}
