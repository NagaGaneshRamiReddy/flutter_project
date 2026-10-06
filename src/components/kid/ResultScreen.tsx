import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ResultScreenProps {
    score: number;
    feedback: string;
    onPlayAgain: () => void;
    onBackToDashboard: () => void;
}

const ConfettiPiece = ({ index }: { index: number }) => {
    const colors = ['#FBBF24', '#F87171', '#60A5FA', '#34D399', '#A78BFA'];
    const color = colors[index % colors.length];

    return (
        <MotiView
            from={{
                translateY: -20,
                translateX: Math.random() * width,
                rotate: '0deg',
                opacity: 1
            }}
            animate={{
                translateY: height + 100,
                rotate: '360deg',
                opacity: 0
            }}
            transition={{
                type: 'timing',
                duration: 2000 + Math.random() * 3000,
                delay: Math.random() * 1000,
                loop: true
            }}
            style={[
                styles.confetti,
                { backgroundColor: color, width: 10 + Math.random() * 10, height: 10 + Math.random() * 10 }
            ]}
        />
    );
};

const ResultScreen: React.FC<ResultScreenProps> = ({ score, feedback, onPlayAgain, onBackToDashboard }) => {
    const stars = Math.min(Math.floor(score / 30) + 1, 3);

    return (
        <View style={styles.container}>
            {/* Confetti */}
            {Array.from({ length: 40 }).map((_, i) => (
                <ConfettiPiece key={i} index={i} />
            ))}

            <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring' }}
                style={styles.card}
            >
                <View style={styles.trophyContainer}>
                    <LinearGradient
                        colors={['#FDE68A', '#F59E0B']}
                        style={styles.trophyCircle}
                    >
                        <MaterialIcons name="emoji-events" size={80} color="white" />
                    </LinearGradient>
                </View>

                <View style={styles.starsContainer}>
                    {[1, 2, 3].map(i => (
                        <MotiView
                            key={i}
                            from={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', delay: 500 + i * 200 }}
                        >
                            <Ionicons
                                name={i <= stars ? "star" : "star-outline"}
                                size={48}
                                color="#FACC15"
                            />
                        </MotiView>
                    ))}
                </View>

                <Text style={styles.scoreText}>{score} PTS</Text>
                <Text style={styles.feedbackText}>{feedback}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onPlayAgain} style={styles.playAgainButton}>
                        <Text style={styles.playAgainText}>Play Again</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onBackToDashboard} style={styles.homeButton}>
                        <Text style={styles.homeText}>Back to Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </MotiView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A', // Dark background for result makes colors pop
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    confetti: {
        position: 'absolute',
        borderRadius: 2,
    },
    card: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 40,
        padding: 30,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    trophyContainer: {
        marginTop: -80,
        marginBottom: 20,
    },
    trophyCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 6,
        borderColor: 'white',
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    scoreText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 5,
    },
    feedbackText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 30,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    playAgainButton: {
        backgroundColor: '#3B82F6',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playAgainText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
    },
    homeButton: {
        backgroundColor: '#F1F5F9',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeText: {
        color: '#475569',
        fontSize: 18,
        fontWeight: '800',
    },
});

export default ResultScreen;
