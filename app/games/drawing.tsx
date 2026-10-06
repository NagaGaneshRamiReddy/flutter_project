import * as Network from 'expo-network';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import DrawingCanvas from '../../src/components/kid/DrawingCanvas';
import ResultScreen from '../../src/components/kid/ResultScreen';
import { RootState } from '../../src/store';

const DrawingGameScreen = () => {
    const [gameState, setGameState] = useState<'drawing' | 'result'>('drawing');
    const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleDrawingDone = async (base64Image: string) => {
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (!networkState.isConnected) {
                Alert.alert("Offline", "You are offline! We will save your drawing and upload it when you are back online.");
                return;
            }

            // Mock API Call
            // In reality: 
            /*
            const response = await axios.post('YOUR_BACKEND_URL/games/drawing/validate', {
                kidId: user?.id,
                gameId: 'drawing_happy_star',
                image: base64Image,
                timestamp: new Date().toISOString()
            });
            */

            // Simulating API response
            setTimeout(() => {
                setResult({
                    score: 85,
                    feedback: "Great job! You drew a very happy star!"
                });
                setGameState('result');
            }, 1000);

        } catch (error) {
            Alert.alert("Oops!", "Something went wrong while sending your drawing.");
        }
    };

    if (gameState === 'result' && result) {
        return (
            <ResultScreen
                score={result.score}
                feedback={result.feedback}
                onPlayAgain={() => setGameState('drawing')}
                onBackToDashboard={() => router.push('/(tabs)/' as any)}
            />
        );
    }

    return (
        <View style={styles.container}>
            <DrawingCanvas
                onDone={handleDrawingDone}
                onClose={() => router.back()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default DrawingGameScreen;
