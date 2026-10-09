package com.example.booking;

import java.security.NoSuchAlgorithmException;
import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;

/**
 * PLANTED VIOLATION for the NFR-012 AC-3-b gate proof. This class must never be merged.
 *
 * <p>DES is a broken cipher. CodeQL's {@code java/weak-cryptographic-algorithm} query lists it in
 * the {@code insecureAlgorithm} predicate of {@code semmle/code/java/security/Encryption.qll} and
 * reports it with a {@code security-severity} of 7.5, at or above the threshold the {@code Fail on
 * CodeQL findings} step in {@code .github/workflows/gate.yml} enforces. The query sits in {@code
 * java-code-scanning.qls}, the default suite, so no query-suite change is needed.
 *
 * <p>{@code Cipher.getInstance("DES")} is the exact form the query's own documentation gives as its
 * flagged example, and the string literal flows directly into the algorithm specification, which is
 * what this path query requires.
 *
 * <p>Nothing calls this class. It implements no requirement and is not product behavior.
 */
public final class PlantedWeakCipher {

    private PlantedWeakCipher() {
        throw new AssertionError("No instances.");
    }

    static Cipher weakCipher() throws NoSuchAlgorithmException, NoSuchPaddingException {
        return Cipher.getInstance("DES");
    }
}
