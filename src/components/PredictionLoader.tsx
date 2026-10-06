import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

type SharedValue<T> = { value: T };

export default function PredictionLoader() {
    const { colors } = useTheme();
    const scale1 = useSharedValue(1);
    const scale2 = useSharedValue(1);
    const scale3 = useSharedValue(1);
    const rotate = useSharedValue(0);

    useEffect(() => {
        const animate = (v: SharedValue<number>, delay: number) => {
            v.value = withDelay(delay, withRepeat(
                withSequence(
                    withTiming(1.3, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
                    withTiming(1, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.2, 1) })
                ),
                -1
            ));
        };

        animate(scale1, 0);
        animate(scale2, 400);
        animate(scale3, 800);

        rotate.value = withRepeat(
            withTiming(360, { duration: 4000, easing: Easing.linear }),
            -1
        );
    }, []);

    const dotStyle1 = useAnimatedStyle(() => ({ transform: [{ scale: scale1.value }] }));
    const dotStyle2 = useAnimatedStyle(() => ({ transform: [{ scale: scale2.value }] }));
    const dotStyle3 = useAnimatedStyle(() => ({ transform: [{ scale: scale3.value }] }));
    const gearStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }] }));

    return (
        <View style={styles.container}>
            <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />

            <View className="items-center justify-center">
                <View className="relative w-40 h-40 items-center justify-center mb-10">
                    <View
                        className="absolute w-32 h-32 blur-3xl rounded-full"
                        style={{ backgroundColor: `${colors['--primary']}20` }}
                    />

                    <View className="relative">
                        {/* Main Icon Group */}
                        <MaterialCommunityIcons
                            name="account-cog"
                            size={100}
                            color={colors['--primary']}
                            style={{ opacity: 0.8 }}
                        />

                        {/* Floating Small Icons */}
                        <Animated.View style={[{ position: 'absolute', top: -10, right: -10 }, gearStyle]}>
                            <MaterialCommunityIcons name="cog" size={32} color={colors['--accent']} />
                        </Animated.View>

                        <Animated.View style={[{ position: 'absolute', bottom: 10, left: -20 }]}>
                            <MaterialCommunityIcons name="brain" size={40} color={colors['--accent']} style={{ opacity: 0.6 }} />
                        </Animated.View>

                        <View style={{ position: 'absolute', top: 10, left: -30 }}>
                            <MaterialCommunityIcons name={"sparkles" as any} size={24} color="#facc15" />
                        </View>
                    </View>
                </View>

                <Text className="text-2xl font-bold text-slate-900 mb-2">AI is Predicting</Text>
                <Text className="text-slate-500 font-medium mb-8 text-center px-10">
                    Analyzing your skills and interests to find the perfect path...
                </Text>

                <View className="flex-row gap-4">
                    <Animated.View style={[styles.dot, { backgroundColor: colors['--primary'] }, dotStyle1]} />
                    <Animated.View style={[styles.dot, { backgroundColor: colors['--primary'] }, dotStyle2]} />
                    <Animated.View style={[styles.dot, { backgroundColor: colors['--primary'] }, dotStyle3]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    }
});

