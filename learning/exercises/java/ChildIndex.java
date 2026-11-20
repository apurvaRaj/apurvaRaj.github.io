/**
 * Warm-up 1: the B-tree routing rule (DDIA ch. 3, Day 1).
 *
 * Given a page's sorted keys and a search key, return which child pointer to
 * follow: the index of the first key strictly greater than target, or
 * keys.length if none is greater. Use binary search.
 *
 * Run:  java ChildIndex.java
 */
public class ChildIndex {

    static int childIndex(String[] keys, String target) {
        // TODO: your code here
        return -1;
    }

    // ---- tests: do not edit below ----
    public static void main(String[] args) {
        String[] page = {"HDFC", "ITC", "RELI"};
        check(childIndex(page, "G"), 0, "before HDFC");
        check(childIndex(page, "INFY"), 1, "between HDFC and ITC");
        check(childIndex(page, "NTPC"), 2, "between ITC and RELI");
        check(childIndex(page, "ZOMATO"), 3, "after RELI");
        check(childIndex(page, "ITC"), 2, "equal key goes right");
        check(childIndex(page, "HDFC"), 1, "equal to first key");
        check(childIndex(new String[]{}, "X"), 0, "empty page");
        check(childIndex(new String[]{"M"}, "A"), 0, "one key, smaller target");
        check(childIndex(new String[]{"M"}, "Z"), 1, "one key, bigger target");
        System.out.println(passed + " of " + total + " passed");
    }

    static int passed = 0, total = 0;

    static void check(int got, int want, String name) {
        total++;
        if (got == want) passed++;
        System.out.println((got == want ? "PASS " : "FAIL ") + name + "  (got " + got + ", want " + want + ")");
    }
}
