package de.tum.cit.memo.util;

import java.security.SecureRandom;
import java.util.concurrent.atomic.AtomicInteger;

public class IdGenerator {

    private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
    private static final int BASE = ALPHABET.length();
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final AtomicInteger COUNTER = new AtomicInteger(0);

    public static String generateCuid() {
        long timestamp = System.currentTimeMillis();
        int counter = COUNTER.getAndIncrement() % 1296;
        String randomPart = generateRandomString(8);

        return "c" + toBase36(timestamp) + toBase36(counter) + randomPart;
    }

    private static String toBase36(long value) {
        StringBuilder result = new StringBuilder();
        long remaining = value;

        do {
            int digit = (int) (remaining % BASE);
            result.insert(0, ALPHABET.charAt(digit));
            remaining /= BASE;
        } while (remaining > 0);

        return result.toString();
    }

    private static String generateRandomString(int length) {
        StringBuilder result = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            result.append(ALPHABET.charAt(RANDOM.nextInt(BASE)));
        }
        return result.toString();
    }
}
