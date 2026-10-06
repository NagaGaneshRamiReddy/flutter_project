import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { QuizLayout } from '../src/components/quiz/QuizLayout';

export default function QuizScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const mode = (params.mode as 'adult' | 'kid') || 'adult';
    const topic = (params.topic as string) || 'General Knowledge';

    // Mock Questions - In a real app, fetch based on topic/id
    const questions = [
        {
            id: '1',
            text: 'What is the largest planet in our solar system?',
            options: [
                { id: 'a', text: 'Earth', isCorrect: false },
                { id: 'b', text: 'Jupiter', isCorrect: true },
                { id: 'c', text: 'Mars', isCorrect: false },
                { id: 'd', text: 'Saturn', isCorrect: false },
            ],
            explanation: 'Jupiter is the largest planet in our solar system. It is a gas giant with a mass one-thousandth that of the Sun.',
        },
        {
            id: '2',
            text: 'Which element has the chemical symbol "O"?',
            options: [
                { id: 'a', text: 'Gold', isCorrect: false },
                { id: 'b', text: 'Osmium', isCorrect: false },
                { id: 'c', text: 'Oxygen', isCorrect: true },
                { id: 'd', text: 'Iron', isCorrect: false },
            ],
            explanation: 'Oxygen is a chemical element with the symbol O and atomic number 8.',
        },
        {
            id: '3',
            text: 'What is 5 + 7?',
            options: [
                { id: 'a', text: '10', isCorrect: false },
                { id: 'b', text: '11', isCorrect: false },
                { id: 'c', text: '12', isCorrect: true },
                { id: 'd', text: '13', isCorrect: false },
            ],
            explanation: '5 + 7 equals 12.',
        },
    ];

    const handleComplete = (score: number) => {
        // Navigate to results or back
        console.log(`Quiz completed with score: ${score}`);
        router.back();
    };

    const handleExit = () => {
        router.back();
    };

    return (
        <View style={{ flex: 1 }}>
            <QuizLayout
                title={topic}
                questions={questions}
                mode={mode}
                onComplete={handleComplete}
                onExit={handleExit}
            />
        </View>
    );
}
