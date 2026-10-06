import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    SharedValue,
    useAnimatedReaction,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { KeyboardAwareScrollView } from '../../src/components/KeyboardAwareScrollView';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { mapGroupToTheme } from '../../src/constants/themes';
import { useTheme } from '../../src/context/ThemeContext';
import { useRedirectToast } from '../../src/hooks/useRedirectToast';
import { AppDispatch } from '../../src/store';
import { updateAge } from '../../src/store/slices/onboardingSlice';
import { AGE_GROUPS, getAgeMeta, ITEM_WIDTH } from '../../src/utils/ageHelpers';

const { width } = Dimensions.get('window');
const SPACING = (width - ITEM_WIDTH) / 2;
const AGES = Array.from({ length: 100 }, (_, i) => i + 1);
const AGE_META = AGES.map((age) => getAgeMeta(age));

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as any;

const AgeItem = React.memo(({
    item,
    index,
    scrollX,
    activeColor
}: {
    item: number;
    index: number;
    scrollX: SharedValue<number>;
    activeColor: SharedValue<string>;
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        const position = scrollX.value / ITEM_WIDTH;
        const distance = Math.abs(position - index);

        // Optimize by skipping complex calculations for far items
        if (distance > 2) {
            return {
                transform: [{ scale: 0.4 }],
                opacity: 0.3,
                color: '#94a3b8'
            };
        }

        const scale = interpolate(
            distance,
            [0, 1],
            [1, 0.4],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            distance,
            [0, 1],
            [1, 0.3],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }],
            opacity,
            color: distance < 0.5 ? activeColor.value : '#94a3b8'
        };
    }, [scrollX, index, activeColor]);

    const backgroundStyle = useAnimatedStyle(() => {
        const position = scrollX.value / ITEM_WIDTH;
        const distance = Math.abs(position - index);

        if (distance > 1.5) {
            return {
                opacity: 0,
                transform: [{ scale: 0.8 }],
            };
        }

        const backgroundOpacity = interpolate(
            distance,
            [0, 0.5, 1],
            [0.15, 0.05, 0],
            Extrapolation.CLAMP
        );

        const backgroundScale = interpolate(
            distance,
            [0, 0.5, 1],
            [1, 0.95, 0.8],
            Extrapolation.CLAMP
        );

        return {
            opacity: backgroundOpacity,
            transform: [{ scale: backgroundScale }],
            backgroundColor: activeColor.value,
        };
    }, [scrollX, index, activeColor]);

    return (
        <View style={{ width: ITEM_WIDTH }} className="items-center justify-center h-48">
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        width: 140,
                        height: 140,
                        borderRadius: 70,
                    },
                    backgroundStyle
                ]}
                className="backdrop-blur-xl"
            />
            <Animated.Text
                allowFontScaling={false}
                style={[
                    { fontSize: 72, fontWeight: 'bold' },
                    animatedStyle
                ]}
            >
                {item}
            </Animated.Text>
        </View>
    );
}, (prev, next) => {
    // Custom comparison to prevent unnecessary re-renders
    return prev.item === next.item && prev.index === next.index;
});
AgeItem.displayName = 'AgeItem';

export default function AgeSelectionScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { setTheme } = useTheme();
    const { colors } = useTheme();
    const listRef = useRef<any>(null);
    const textInputRef = useRef<TextInput>(null);

    const scrollX = useSharedValue(0);
    const iconAnimScale = useSharedValue(1);
    const lastGroupIndex = useSharedValue(0);
    const lastAge = useSharedValue(0);

    const [manualEntry, setManualEntry] = useState('');
    const [activeGroupIndex, setActiveGroupIndex] = useState(0);
    const [activeAgeNum, setActiveAgeNum] = useState(0);
    const [showError, setShowError] = useState(false);

    useRedirectToast();

    const activeIndex = useDerivedValue(() => {
        return Math.round(scrollX.value / ITEM_WIDTH);
    });

    const activeMetaIndex = useDerivedValue(() => {
        return Math.max(0, Math.min(AGES.length - 1, activeIndex.value));
    });

    const activeMeta = useDerivedValue(() => {
        return AGE_META[activeMetaIndex.value];
    });

    const activeColor = useDerivedValue(() => {
        return activeMeta.value.color;
    });

    // Debounced group change with threshold to prevent excessive updates
    useAnimatedReaction(
        () => activeMeta.value.groupIndex,
        (newGroup) => {
            if (newGroup !== lastGroupIndex.value) {
                lastGroupIndex.value = newGroup;
                runOnJS(setActiveGroupIndex)(newGroup);
                runOnJS(setTheme)(AGE_GROUPS[newGroup].group);
                iconAnimScale.value = withSequence(
                    withTiming(0.8, { duration: 100 }),
                    withSpring(1, { damping: 12, stiffness: 200 })
                );
                runOnJS(Haptics.selectionAsync)();
            }
        },
        [lastGroupIndex]
    );

    // Throttled age update
    useAnimatedReaction(
        () => activeIndex.value,
        (newIndex) => {
            const age = AGES[Math.max(0, Math.min(99, newIndex))];
            if (age !== lastAge.value) {
                lastAge.value = age;
                runOnJS(setActiveAgeNum)(age);
                runOnJS(setManualEntry)(age.toString());
            }
        },
        [lastAge]
    );

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollX.value = e.contentOffset.x;
        },
    });

    const scrollToAge = useCallback((age: number, animated = true) => {
        const index = AGES.indexOf(age);
        if (index !== -1 && listRef.current) {
            listRef.current.scrollToOffset({
                offset: index * ITEM_WIDTH,
                animated,
            });
        }
    }, []);

    // Start with no selection (age 0)
    useEffect(() => {
        // Don't auto-scroll, let user select their age
    }, []);

    // Clear error when user selects a valid age
    useEffect(() => {
        if (activeAgeNum > 0 && showError) {
            setShowError(false);
        }
    }, [activeAgeNum, showError]);

    const circleStyle = useAnimatedStyle(() => ({
        backgroundColor: activeColor.value + '20',
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconAnimScale.value }],
    }));

    const badgeStyle = useAnimatedStyle(() => ({
        backgroundColor: activeColor.value,
    }));

    const activeGroupData = AGE_GROUPS[activeGroupIndex];

    return (
        <SafeAreaView className="flex-1 bg-white relative">
            <View className="flex-row items-center justify-between px-6 py-4">
                {navigation.canGoBack() && (navigation.getState()?.index ?? 0) > 0 ? (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full border border-slate-100 items-center justify-center bg-white shadow-sm"
                    >
                        <MaterialIcons name="arrow-back-ios-new" size={20} color="#475569" />
                    </TouchableOpacity>
                ) : (
                    <View className="w-10" />
                )}

                <View className="flex-row gap-1.5">
                    <View className="h-1.5 w-8 rounded-full" style={{ backgroundColor: colors["--primary"] }} />
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                </View>

                <View className="w-10" />
            </View>

            <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingTop: 32, paddingBottom: 16 }}
                keyboardShouldPersistTaps="handled"
                bounces={false}
            >
                    <Animated.View
                        style={[
                            {
                                width: 160,
                                height: 160,
                                borderRadius: 80,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 32
                            },
                            circleStyle,
                        ]}
                    >
                        <Animated.View style={iconStyle}>
                            <MaterialCommunityIcons
                                name={activeGroupData.iconName as any}
                                size={72}
                                color={activeGroupData.color}
                            />
                        </Animated.View>

                        <Animated.View
                            style={[
                                {
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 999,
                                    borderWidth: 3,
                                    borderColor: 'white',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2
                                },
                                badgeStyle,
                            ]}
                        >
                            <Text className="text-white font-bold text-xs tracking-wide" allowFontScaling={false}>
                                {activeGroupData.label}
                            </Text>
                        </Animated.View>
                    </Animated.View>

                    <View className="items-center px-8 mb-4 mt-6">
                        <Text className="text-4xl font-bold text-slate-900 mb-6 text-center tracking-tight">
                            How old are you?
                        </Text>
                        <Text className="text-slate-500 text-center font-medium leading-6 ">
                            This helps us tailor your learning experience.
                        </Text>
                    </View>

                    <View className="h-44 w-full">
                        <AnimatedFlashList
                            ref={listRef}
                            data={AGES}
                            horizontal
                            keyExtractor={(i: any) => i.toString()}
                            renderItem={({ item, index }: any) => (
                                <AgeItem
                                    item={item}
                                    index={index}
                                    scrollX={scrollX}
                                    activeColor={activeColor}
                                />
                            )}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={ITEM_WIDTH}
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingHorizontal: SPACING }}
                            onScroll={scrollHandler}
                            scrollEventThrottle={16}
                            estimatedItemSize={ITEM_WIDTH}
                            initialNumToRender={7}
                            drawDistance={ITEM_WIDTH * 5}
                        />
                    </View>

                    <View className="mt-14 mb-8 w-full items-center">
                        <View className="bg-white px-8 py-4 rounded-2xl border border-slate-100 shadow-sm flex-row items-center gap-6 min-w-[200px] justify-center">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest font-bold">
                                MANUAL ENTRY
                            </Text>
                            <TextInput
                                ref={textInputRef}
                                className="text-2xl font-bold p-0 min-w-[40px] text-center font-bold"
                                style={{ color: activeGroupData.color }}
                                keyboardType="number-pad"
                                value={manualEntry}
                                onChangeText={(t) => {
                                    setManualEntry(t);
                                    const age = Number(t);
                                    if (!isNaN(age) && age > 0 && age <= 100) scrollToAge(age);
                                }}
                                maxLength={3}
                                selectTextOnFocus
                            />
                        </View>
                    </View>

                    <View className="px-8 w-full mt-auto">
                        {showError && activeAgeNum === 0 && (
                            <Text className="text-red-500 text-center mb-3 font-medium">
                                Please select your age
                            </Text>
                        )}
                        <PrimaryButton
                            title="Next"
                            iconName="arrow-forward"
                            onPress={async () => {
                                if (activeAgeNum === 0 || !activeAgeNum) {
                                    setShowError(true);
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                                    return;
                                }
                                setShowError(false);

                                try {
                                    // Call updateAge API and wait for response
                                    const result = await dispatch(updateAge(activeAgeNum)).unwrap();

                                    // Update theme to match age group
                                    if (result.group) {
                                        setTheme(mapGroupToTheme(result.group));
                                    }

                                    // Navigate based on server's ageGroup response
                                    if (result.group === 'KIDS') {
                                        router.push('/(onboarding)/hero');
                                    } else {
                                        // teen, student, professional, senior go to interests
                                        router.push('/(onboarding)/interests' as any);
                                    }
                                } catch (error: any) {
                                    // Handle API error
                                    console.error('Age update failed:', error);
                                    setShowError(true);
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                                }
                            }}
                        />
                    </View>
                </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}