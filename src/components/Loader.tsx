import { BlurView } from 'expo-blur'; // If you're using expo-blur
import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface LoaderProps {
    variant?: 'fullscreen' | 'inline' | 'button';
    size?: number;
    color?: string;
    style?: ViewStyle;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function Loader({
    variant = 'inline',
    size = 40,
    color,
    style,
}: LoaderProps) {
    const { colors } = useTheme();
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1
        );
        return () => {
            cancelAnimation(rotation);
        };
    }, [rotation]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    // Calculate dimensions based on size or variant
    const containerSize = variant === 'button' ? 20 : size;
    const strokeWidth = variant === 'button' ? 2 : 3;

    // Default to theme primary if no color provided
    const defaultColor = colors['--primary'];
    const targetColor = variant === 'button' ? '#FFFFFF' : (color || defaultColor);

    // Render the geometric loader (a simple ring or arc)
    const renderLoader = () => (
        <AnimatedView
            style={[
                styles.loader,
                animatedStyle,
                {
                    width: containerSize,
                    height: containerSize,
                    borderRadius: containerSize / 2,
                    borderWidth: strokeWidth,
                    borderColor: targetColor,
                    borderTopColor: 'transparent', // Create the arc effect
                },
            ]}
        />
    );

    if (variant === 'fullscreen') {
        return (
            <View style={[styles.fullscreenContainer, style]}>
                <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                <View style={styles.centered}>
                    {renderLoader()}
                </View>
            </View>
        );
    }

    return <View style={[styles.centered, style]}>{renderLoader()}</View>;
}

const styles = StyleSheet.create({
    fullscreenContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        backgroundColor: 'transparent',
    },
});

