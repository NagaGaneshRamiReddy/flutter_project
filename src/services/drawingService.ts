import api from './api';

export interface DrawingChallenge {
    id: string;
    imageUrl: string;
    label: string;
    type: 'svg' | 'png';
}

export interface ValidationResponse {
    success: boolean;
    score: number;
    message: string;
    pointsEarned?: number;
}

/**
 * Service to handle all server-side drawing interactions.
 */
export const drawingService = {
    /**
     * Fetches a random drawing challenge from the server.
     */
    fetchRandomDrawing: async (): Promise<DrawingChallenge> => {
        try {
            const response = await api.get('/drawing/random');
            return response.data;
        } catch (error) {
            console.error('Error fetching random drawing:', error);
            // Fallback for demo if server is not ready
            return {
                id: 'star-123',
                imageUrl: 'https://img.icons8.com/color/144/star--v1.png',
                label: 'HAPPY STAR',
                type: 'png',
            };
        }
    },

    /**
     * Submits a drawing for validation to the server.
     * @param base64Image The captured drawing in base64 format.
     * @param challengeId The ID of the drawing challenge being validated.
     */
    validateDrawingOnServer: async (base64Image: string, challengeId: string): Promise<ValidationResponse> => {
        try {
            const response = await api.post('/drawing/validate', {
                image: base64Image,
                challengeId,
            });
            return response.data;
        } catch (error) {
            console.error('Error validating drawing on server:', error);
            // For now, if server fails, we'll simulate a 70% match for better UX
            return {
                success: true,
                score: 0.7,
                message: 'Self-validation (Server Offline)',
                pointsEarned: 10,
            };
        }
    }
};
