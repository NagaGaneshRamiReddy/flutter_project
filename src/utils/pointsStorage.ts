import * as SecureStore from 'expo-secure-store';

const POINTS_KEY = 'kid_total_points';

/**
 * Utility to manage local points persistence for the kid dashboard.
 */
export const pointsStorage = {
    /**
     * Gets the total points from secure storage.
     */
    getPoints: async (): Promise<number> => {
        try {
            const points = await SecureStore.getItemAsync(POINTS_KEY);
            return points ? parseInt(points, 10) : 0;
        } catch (error) {
            console.error('Error getting points:', error);
            return 0;
        }
    },

    /**
     * Increments the total points and persists the result.
     * @param amount The number of points to add.
     * @returns The new total score.
     */
    incrementPoints: async (amount: number): Promise<number> => {
        try {
            const currentPoints = await pointsStorage.getPoints();
            const newTotal = currentPoints + amount;
            await SecureStore.setItemAsync(POINTS_KEY, newTotal.toString());
            return newTotal;
        } catch (error) {
            console.error('Error incrementing points:', error);
            return 0; // Or current points if preferred
        }
    },

    /**
     * Utility to reset points (useful for testing or profile reset).
     */
    resetPoints: async () => {
        await SecureStore.deleteItemAsync(POINTS_KEY);
    }
};
