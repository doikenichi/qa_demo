package com.example.booking;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * PLANTED VIOLATION for the NFR-012 AC-3-b gate proof. This class must never be merged.
 *
 * <p>MD5 is a broken digest. CodeQL's {@code java/weak-cryptographic-algorithm} query reports its
 * use with a {@code security-severity} of 7.5, which is at or above the threshold the {@code Fail
 * on CodeQL findings} step in {@code .github/workflows/gate.yml} enforces, so the {@code CodeQL
 * (Java)} job fails and takes the aggregating {@code Quality gate} check with it.
 *
 * <p>The query needs no tainted input to fire: the weak algorithm name is a constant at the call
 * site. That is deliberate, because milestone 0 ships no endpoint that could act as a source.
 *
 * <p>Nothing calls this class. It implements no requirement and is not product behavior.
 */
public final class PlantedWeakDigest {

    private PlantedWeakDigest() {
        throw new AssertionError("No instances.");
    }

    static byte[] digest(byte[] input) throws NoSuchAlgorithmException {
        MessageDigest weak = MessageDigest.getInstance("MD5");
        return weak.digest(input);
    }
}
