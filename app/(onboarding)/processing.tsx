import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { SafeIcon } from '../../src/components/SafeIcon';
import { mapGroupToTheme } from '../../src/constants/themes';
import { useSocket } from '../../src/context/SocketContext';
import { useTheme } from '../../src/context/ThemeContext';
import { AppDispatch, RootState } from '../../src/store';
import { setLearningPath } from '../../src/store/slices/learningSlice';
import {
    onboardKid,
    onboardProfessional,
    onboardSenior,
    onboardStudent,
    onboardTeen
} from '../../src/store/slices/onboardingSlice';

const { width } = Dimensions.get('window');


export default function ProcessingScreen() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { colors, setTheme } = useTheme();
    const params = useLocalSearchParams();

    const { user, token } = useSelector((state: RootState) => state.auth);
    const { interests, skills, selectedInterests, selectedSkills } = useSelector((state: RootState) => state.common);

    const { socket } = useSocket();
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isGenerationDone, setIsGenerationDone] = useState(false);
    const [pendingPath, setPendingPath] = useState<any>(null);

    // Shared values for animations
    const pulseValue = useSharedValue(1);
    const rotationValue = useSharedValue(0);
    const progressValue = useSharedValue(0);

    // Sync theme with user group on mount
    useEffect(() => {
        if (user?.group) {
            setTheme(mapGroupToTheme(user.group));
        }
    }, [user?.group]);

    // Derived items for cycling text
    const displayItems = useMemo(() => {
        const itemNames: string[] = [];
        selectedInterests.forEach(id => {
            const item = interests.find(i => i.id === id);
            if (item) itemNames.push(item.name);
        });
        selectedSkills.forEach(id => {
            const item = skills.find(s => s.id === id);
            if (item) itemNames.push(item.name);
        });

        // If empty, add some defaults to maintain the "story"
        if (itemNames.length === 0) return ['Cloud Computing', 'Data Science', 'Machine Learning', 'Leadership', 'Communication'];
        return itemNames;
    }, [interests, skills, selectedInterests, selectedSkills]);

    useEffect(() => {
        // AI Head Pulsing (Breathing effect)
        pulseValue.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 2000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
                withTiming(1, { duration: 2000, easing: Easing.bezier(0.4, 0, 0.2, 1) })
            ),
            -1
        );

        // Slow, calm orbital rotation
        rotationValue.value = withRepeat(
            withTiming(360, { duration: 15000, easing: Easing.linear }),
            -1
        );

        // Illusion of intelligence through pseudo-progress
        progressValue.value = withTiming(0.85, { duration: 12000, easing: Easing.out(Easing.exp) });

        return () => {
            cancelAnimation(pulseValue);
            cancelAnimation(rotationValue);
            cancelAnimation(progressValue);
        };
    }, []);

    // Text cycling logic: Slide up, fade in, pause, fade out/move up
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isGenerationDone) {
                console.log('⏳ Generation taking too long (>20s), redirecting to dashboard...');
                router.replace('/(tabs)' as any);
            }
        }, 20000);

        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => {
                const next = prev + 1;

                // End criteria: Story finished AND backend finished
                if (next >= displayItems.length && isGenerationDone) {
                    clearInterval(interval);
                    handleFinalize();
                    return prev;
                }

                // Infinite cycle if backend is still working
                return next % displayItems.length;
            });
        }, 3200); // Items show for ~3s total including transitions

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [displayItems, isGenerationDone]);

    const hasTriggeredAPI = React.useRef(false);

    // Socket & API Integration
    useEffect(() => {
        if (!token) {
            router.replace('/(auth)/login' as any);
            return;
        }

        if (!socket) return;

        const handleTrigger = () => {
            if (!hasTriggeredAPI.current) {
                hasTriggeredAPI.current = true;
                triggerOnboardingAPI();
            }
        };

        // If already connected when we land here, trigger API
        if (socket.connected) {
            handleTrigger();
        }

        socket.on('connect', () => {
            console.log('✨ Socket Connected (from Processing)');
            handleTrigger();
        });

        socket.on('learning_path:generation_started', (data) => {
            console.log('🚀 AI Generation Started:', data.message);
        });

        socket.on('learning_path:generation_completed', (data) => {
            console.log('✅ AI Generation Completed');
            setPendingPath(data.path);
            setIsGenerationDone(true);
        });

        return () => {
            socket.off('connect');
            socket.off('learning_path:generation_started');
            socket.off('learning_path:generation_completed');
        };
    }, [token, socket]);

    const triggerOnboardingAPI = async () => {
        try {
            const baseData = {
                learningStyle: params.learningStyle as string,
                weeklyLearningHours: Number(params.weeklyLearningHours),
                courseId: Number(params.courseId),
                branchId: Number(params.branchId),
            };

            if (user?.group === 'TEENS') {
                await dispatch(onboardTeen({
                    ...baseData,
                    skillIds: selectedSkills,
                    interestIds: selectedInterests
                })).unwrap();
            } else if (user?.group === 'COLLEGE_STUDENTS') {
                await dispatch(onboardStudent(baseData)).unwrap();
            } else if (user?.group === 'PROFESSIONALS') {
                await dispatch(onboardProfessional({
                    ...baseData,
                    currentRole: params.currentRole as string,
                    industry: params.industry as string,
                    yearsOfExperience: Number(params.yearsOfExperience),
                    targetRole: params.targetRole as string,
                })).unwrap();
            } else if (user?.group === 'SENIORS') {
                await dispatch(onboardSenior({
                    ...baseData,
                    accessibilitySettings: { fontSize: 'medium' },
                })).unwrap();
            } else if (user?.group === 'KIDS') {
                await dispatch(onboardKid({
                    learningStyle: baseData.learningStyle,
                    weeklyLearningHours: baseData.weeklyLearningHours,
                    avatar: user?.hero || 'superhero_1.png',
                })).unwrap();
            }
        } catch (err) {
            console.error('Onboarding API Error:', err);
        }
    };

    const handleFinalize = async () => {
        if (pendingPath) {
            dispatch(setLearningPath(pendingPath));
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        progressValue.value = withTiming(1, { duration: 600 });

        setTimeout(() => {
            router.replace('/(tabs)' as any);
        }, 800);
    };

    // Animation Helpers
    const brainStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseValue.value }],
    }));

    const getOrbitStyle = (radius: number, offsetAngle: number = 0) => {
        return useAnimatedStyle(() => {
            const angle = rotationValue.value + offsetAngle;
            const rad = (angle * Math.PI) / 180;
            return {
                transform: [
                    { translateX: radius * Math.cos(rad) },
                    { translateY: radius * Math.sin(rad) },
                ],
            };
        });
    };

    const progressBarStyle = useAnimatedStyle(() => ({
        width: `${progressValue.value * 100}%`,
    }));

    return (
        <View style={[styles.container, { backgroundColor: colors['--background'] }]}>
            <LinearGradient
                colors={['#ffffff', '#f8fafc', colors['--secondary']]}
                style={StyleSheet.absoluteFill}
            />

            {/* AI Vision Centerpiece */}
            <View className="flex-1 items-center justify-center">
                <View className="relative items-center justify-center w-80 h-80">
                    {/* Concentric Orbital Rings */}
                    <View style={[styles.ring, { width: 180, height: 180, opacity: 0.1, borderColor: colors['--primary'] }]} />
                    <View style={[styles.ring, { width: 260, height: 260, opacity: 0.05, borderColor: colors['--primary'] }]} />
                    <View style={[styles.ring, { width: 340, height: 340, opacity: 0.03, borderColor: colors['--primary'] }]} />

                    {/* Slow Rotating Orbiting Icons */}
                    <Animated.View style={[styles.orbitingIcon, getOrbitStyle(130, 0)]}>
                        <View className="bg-white p-3 rounded-2xl shadow-xl border border-slate-50/50">
                            <SafeIcon library="Ionicons" name="cloud-outline" size={20} color={colors['--primary']} />
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.orbitingIcon, getOrbitStyle(130, 120)]}>
                        <View className="bg-white p-3 rounded-2xl shadow-xl border border-slate-50/50">
                            <SafeIcon library="Ionicons" name="code-slash-outline" size={20} color={colors['--primary']} />
                        </View>
                    </Animated.View>

                    <Animated.View style={[styles.orbitingIcon, getOrbitStyle(130, 240)]}>
                        <View className="bg-white p-3 rounded-2xl shadow-xl border border-slate-50/50">
                            <SafeIcon library="Ionicons" name="school-outline" size={20} color={colors['--primary']} />
                        </View>
                    </Animated.View>

                    {/* Intelligent Glow Burst */}
                    <MotiView
                        from={{ scale: 0.7, opacity: 0.1 }}
                        animate={{ scale: 1.4, opacity: 0.35 }}
                        transition={{
                            type: 'timing',
                            duration: 2500,
                            loop: true,
                            repeatReverse: true,
                        }}
                        style={[styles.glow, { backgroundColor: colors['--primary'] }]}
                    />

                    {/* Central Brain/Head Profile */}
                    <Animated.View style={[styles.mainIconContainer, brainStyle]}>
                        <LinearGradient
                            colors={[colors['--primary'], colors['--accent']]}
                            style={styles.mainIconGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <SafeIcon library="Ionicons" name="hardware-chip-outline" size={56} color="white" />
                        </LinearGradient>

                        {/* Shimmer Effect */}
                        <MotiView
                            from={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: [0, 0.4, 0], scale: 1 }}
                            transition={{ duration: 3000, loop: true, delay: 1000 }}
                            style={{ position: 'absolute', top: 15, right: 15 }}
                        >
                            <SafeIcon library="Ionicons" name="sparkles" size={16} color="#fbbf24" />
                        </MotiView>
                    </Animated.View>
                </View>

                {/* Animated Story Text */}
                <View className="mt-16 items-center px-8">
                    <Text
                        style={{ color: colors['text'], fontWeight: '700' }}
                        className="text-2xl text-center mb-6 tracking-tight"
                    >
                        AI is Building Your Compass
                    </Text>

                    <View style={{ height: 80 }} className="items-center justify-center">
                        <AnimatePresence exitBeforeEnter>
                            <MotiView
                                key={displayItems[currentTextIndex]}
                                from={{ opacity: 0, translateY: 15 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                exit={{ opacity: 0, translateY: -15 }}
                                transition={{ type: 'timing', duration: 700 }}
                                className="items-center"
                            >
                                <Text
                                    style={{ color: colors['text-secondary'] }}
                                    className="text-lg text-center leading-7 px-4"
                                >
                                    Synthesizing your interests in{' '}
                                    <Text style={{ color: colors['--primary'] }} className="font-bold">
                                        {displayItems[currentTextIndex]}
                                    </Text>
                                    {'\n'}into a personalized path...
                                </Text>
                            </MotiView>
                        </AnimatePresence>
                    </View>
                </View>

                {/* Intelligent Progress Bar */}
                <View
                    style={{ backgroundColor: colors['--muted'] }}
                    className="w-40 h-1.5 rounded-full mt-12 overflow-hidden shadow-inner"
                >
                    <Animated.View
                        style={[
                            styles.progressBarInner,
                            { backgroundColor: colors['--primary'] },
                            progressBarStyle
                        ]}
                    />
                </View>

                {/* Visual Paging */}
                <View className="flex-row gap-3 mt-6">
                    {[0, 1, 2].map((i) => (
                        <View
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: i === Math.min(2, Math.floor((currentTextIndex / displayItems.length) * 3))
                                    ? colors['--primary']
                                    : colors['--muted-foreground'] + '40'
                            }}
                        />
                    ))}
                </View>
            </View>

            {/* Bottom Status Tag */}
            <View className="pb-16 items-center">
                <View
                    style={{
                        backgroundColor: colors['--secondary'] + '99',
                        borderColor: colors['--primary'] + '30'
                    }}
                    className="flex-row items-center px-5 py-2.5 rounded-full border"
                >
                    <SafeIcon library="Ionicons" name="sparkles" size={16} color={colors['--primary']} />
                    <Text
                        style={{ color: colors['--primary'] }}
                        className="ml-2.5 text-[10px] font-black tracking-[0.15em] uppercase"
                    >
                        Generating Intelligence
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ring: {
        position: 'absolute',
        borderRadius: 999,
        borderWidth: 1,
    },
    glow: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    mainIconContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        elevation: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    mainIconGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orbitingIcon: {
        position: 'absolute',
        zIndex: 10,
    },
    progressBarInner: {
        height: '100%',
        borderRadius: 999,
    },
});
