package de.tum.cit.memo.util;

/** Shared tuning parameters for all scheduling pipelines. */
public final class SchedulingConstants {

    public static final double COVERAGE_WEIGHT = 0.7;
    public static final int LOW_DEGREE_POOL_SIZE = 20;
    public static final int CONSENSUS_CANDIDATE_LIMIT = 20;
    public static final int CONSENSUS_MIN_VOTES = 5;
    public static final int CONSENSUS_MAX_VOTES = 20;
    public static final double CONSENSUS_MIN_ENTROPY = 0.5;

    private SchedulingConstants() {
        // utility class
    }
}
