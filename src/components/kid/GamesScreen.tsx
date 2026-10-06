import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const GamesScreen = () => {
    const router = useRouter();

    const games = [
        {
            id: 'drawing_mode',
            title: 'Drawing Mode',
            description: 'Draw the happy star!',
            icon: 'brush',
            color: ['#F472B6', '#EC4899'],
            route: '/games/drawing'
        },
        {
            id: 'math_puzzles',
            title: 'Math Puzzles',
            description: 'Solve fun problems!',
            icon: 'calculator',
            color: ['#60A5FA', '#3B82F6'],
            disabled: true
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Arcade</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Pick a challenge!</Text>

                {games.map((game, index) => (
                    <MotiView
                        key={game.id}
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: index * 100 }}
                    >
                        <TouchableOpacity
                            onPress={() => !game.disabled && router.push(game.route as any)}
                            style={[styles.gameCard, game.disabled && { opacity: 0.6 }]}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={game.color as any}
                                style={styles.iconContainer}
                            >
                                <MaterialIcons name={game.icon as any} size={32} color="white" />
                            </LinearGradient>
                            <View style={styles.gameInfo}>
                                <Text style={styles.gameTitle}>{game.title}</Text>
                                <Text style={styles.gameDescription}>{game.description}</Text>
                            </View>
                            {game.disabled ? (
                                <MaterialIcons name="lock" size={24} color="#94A3B8" />
                            ) : (
                                <MaterialIcons name="chevron-right" size={24} color="#0F172A" />
                            )}
                        </TouchableOpacity>
                    </MotiView>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'white',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0F172A',
    },
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 24,
    },
    gameCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    gameInfo: {
        flex: 1,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    gameDescription: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
});

export default GamesScreen;
