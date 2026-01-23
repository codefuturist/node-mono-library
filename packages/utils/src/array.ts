/**
 * Array utility functions
 */

/**
 * Removes duplicate values from an array
 */
export function unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}

/**
 * Chunks an array into smaller arrays of specified size
 */
export function chunk<T>(arr: T[], size: number): T[][] {
    if (size <= 0) throw new Error("Chunk size must be greater than 0");
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j]!, result[i]!];
    }
    return result;
}

/**
 * Groups array elements by a key function
 */
export function groupBy<T, K extends string | number | symbol>(
    arr: T[],
    keyFn: (item: T) => K
): Record<K, T[]> {
    return arr.reduce(
        (acc, item) => {
            const key = keyFn(item);
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        },
        {} as Record<K, T[]>
    );
}

/**
 * Returns the last element of an array
 */
export function last<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

/**
 * Returns the first element of an array
 */
export function first<T>(arr: T[]): T | undefined {
    return arr[0];
}
