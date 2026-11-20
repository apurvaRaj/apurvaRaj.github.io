import java.util.BitSet;

/**
 * Warm-up 2: a small Bloom filter (DDIA ch. 3, Day 1).
 *
 * - add(key) sets numHashes bit positions for the key.
 * - mightContain(key) returns false only if the key was definitely never added.
 * - Derive the k positions from two base hashes: h1 + i * h2.
 * - Watch out for negative hash values in Java.
 *
 * Run:  java BloomFilter.java
 */
public class BloomFilter {

    private final BitSet bits;
    private final int numBits;
    private final int numHashes;

    BloomFilter(int numBits, int numHashes) {
        this.bits = new BitSet(numBits);
        this.numBits = numBits;
        this.numHashes = numHashes;
    }

    void add(String key) {
        // TODO: your code here
    }

    boolean mightContain(String key) {
        // TODO: your code here
        return false;
    }

    // ---- tests: do not edit below ----
    public static void main(String[] args) {
        BloomFilter f = new BloomFilter(10_000, 7);
        String[] added = new String[1_000];
        for (int i = 0; i < added.length; i++) {
            added[i] = "KEY-" + i;
            f.add(added[i]);
        }
        int missing = 0;
        for (String k : added) if (!f.mightContain(k)) missing++;
        check(missing == 0, "no false negatives (" + missing + " added keys reported missing)");

        int fp = 0, trials = 10_000;
        for (int i = 0; i < trials; i++) if (f.mightContain("OTHER-" + i)) fp++;
        double rate = 100.0 * fp / trials;
        check(rate < 3.0, String.format("false-positive rate is low (%.2f%%, expect about 1%%)", rate));

        BloomFilter empty = new BloomFilter(64, 3);
        check(!empty.mightContain("TCS"), "empty filter says no");

        BloomFilter weird = new BloomFilter(101, 3);
        weird.add("polygenelubricants");  // String.hashCode() of this is Integer.MIN_VALUE
        weird.add("ÿ");
        check(weird.mightContain("polygenelubricants") && weird.mightContain("ÿ"),
              "handles negative and extreme hash values");

        System.out.println(passed + " of " + total + " passed");
    }

    static int passed = 0, total = 0;

    static void check(boolean ok, String name) {
        total++;
        if (ok) passed++;
        System.out.println((ok ? "PASS " : "FAIL ") + name);
    }
}
