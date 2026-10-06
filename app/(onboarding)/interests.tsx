import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from '../../src/components/KeyboardAwareScrollView';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { PrimaryInput } from '../../src/components/PrimaryInput';
import { SafeIcon } from '../../src/components/SafeIcon';
import { useTheme } from '../../src/context/ThemeContext';
import { useRedirectToast } from '../../src/hooks/useRedirectToast';
import { AppDispatch, RootState } from '../../src/store';
import { fetchInterests, toggleInterest } from '../../src/store/slices/commonSlice';
import { updateSkillsAndInterests } from '../../src/store/slices/onboardingSlice';

const renderIcon = (iconLibrary: string, iconName: string, size: number, color: string) => (
    <SafeIcon library={iconLibrary} name={iconName} size={size} color={color} />
);

export default function InterestsScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { interests, selectedInterests, selectedSkills, loading, error } = useSelector(
        (state: RootState) => state.common
    );
    const { user } = useSelector((state: RootState) => state.auth);

    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(10);

    useRedirectToast();

    useEffect(() => {
        dispatch(fetchInterests());
    }, [dispatch]);

    // Memoize filtered and sorted results for performance
    const { visibleInterests, hasMore } = useMemo(() => {
        // Always include selected items, even if they don't match search
        const selectedItems = interests.filter(item => selectedInterests.includes(item.id));

        // Filter unselected items by search query
        const matchingUnselected = interests.filter(item =>
            !selectedInterests.includes(item.id) &&
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Combine: selected items first, then matching unselected
        const combined = [...selectedItems, ...matchingUnselected];

        return {
            sortedInterests: combined,
            visibleInterests: combined.slice(0, displayCount),
            hasMore: displayCount < combined.length
        };
    }, [interests, selectedInterests, searchQuery, displayCount]);

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 10);
    };

    const handleToggle = (id: number) => {
        dispatch(toggleInterest(id));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleContinue = async () => {
        // Only Seniors skip skills
        const shouldSkipSkills = user?.group === 'SENIORS';

        if (shouldSkipSkills) {
            try {
                await dispatch(updateSkillsAndInterests({
                    skillIds: selectedSkills,
                    interestIds: selectedInterests
                })).unwrap();
                router.replace('/(onboarding)/profile/learning-style' as any);
            } catch (err) {
                console.error('Failed to update interests:', err);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        } else {
            // Everyone else (including TEENS) goes to Skills
            router.push('/(onboarding)/skills' as any);
        }
    };

    const handleSkip = async () => {
        const shouldSkipSkills = user?.group === 'SENIORS';

        if (shouldSkipSkills) {
            try {
                await dispatch(updateSkillsAndInterests({
                    skillIds: [],
                    interestIds: []
                })).unwrap();
                router.replace('/(onboarding)/profile/learning-style' as any);
            } catch (err) {
                console.error('Skip failed:', err);
            }
        } else {
            router.push('/(onboarding)/skills' as any);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gradient-to-b from-slate-50 to-blue-50/30 items-center justify-center">
                <ActivityIndicator size="large" color={colors['--accent']} />
                <Text className="mt-4 text-slate-500 font-medium">Loading interests...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gradient-to-b from-slate-50 to-blue-50/30 items-center justify-center px-8">
                <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#ef4444" />
                <Text className="mt-4 text-red-500 font-semibold text-lg">Failed to load interests</Text>
                <Text className="mt-2 text-slate-500 text-center">{error}</Text>
                <TouchableOpacity
                    onPress={() => dispatch(fetchInterests())}
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-full"
                >
                    <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-b from-slate-50 to-blue-50/30 relative">
            <View className="flex-row items-center justify-between px-6 py-4">
                {navigation.canGoBack() && (navigation.getState()?.index ?? 0) > 0 ? (
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center"
                    >
                        <MaterialIcons name="arrow-back-ios-new" size={20} color="#475569" />
                    </TouchableOpacity>
                ) : (
                    <View className="w-10" />
                )}

                <View className="flex-row gap-1.5">
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    <View className="h-1.5 w-6 rounded-full bg-blue-600" />
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                </View>

                <TouchableOpacity onPress={handleSkip}>
                    <Text className="text-blue-600 font-semibold text-base">Skip</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAwareScrollView
                contentContainerStyle={{ paddingBottom: 32 }}
                className="flex-1"
            >
                <View className="items-center px-6 pt-2">
                    <View className="relative mb-8 mt-2 h-40 w-full flex items-center justify-center">
                        <View className="absolute w-48 h-48 bg-blue-200/30 blur-3xl rounded-full" />
                        <View className="relative">
                            <View className="relative z-10 flex flex-col items-center">
                                <View className="relative">
                                    <MaterialCommunityIcons
                                        name="book-open-variant"
                                        size={96}
                                        color={colors['--accent']}
                                        style={{ opacity: 0.8 }}
                                    />
                                    <MaterialCommunityIcons
                                        name="lightbulb"
                                        size={56}
                                        color="#facc15"
                                        style={{ position: 'absolute', top: -32, right: -16 }}
                                    />
                                </View>
                                <View className="absolute -bottom-2 w-24 h-4 bg-blue-600/10 blur-sm rounded-full" />
                            </View>
                        </View>
                    </View>

                    <View className="text-center mb-8 px-4">
                        <Text className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
                            What sparks your interest?
                        </Text>
                        <Text className="text-slate-500 font-medium">
                            Select areas you want to master.
                        </Text>
                    </View>

                    <View className="w-full mb-6">
                        <PrimaryInput
                            placeholder="Search interests..."
                            value={searchQuery}
                            onChangeText={(text: string) => {
                                setSearchQuery(text);
                                setDisplayCount(10); // Reset pagination on search
                            }}
                            iconName="search"
                        />
                    </View>

                    <View className="w-full">
                        <View className="flex-row flex-wrap gap-3 justify-center">
                            {visibleInterests.map((interest) => {
                                const isSelected = selectedInterests.includes(interest.id);
                                return (
                                    <TouchableOpacity
                                        key={interest.id}
                                        onPress={() => handleToggle(interest.id)}
                                        className={`flex-row items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all ${isSelected
                                            ? 'shadow-lg'
                                            : 'bg-white/40 backdrop-blur-md border border-white/60 shadow-sm'
                                            }`}
                                        style={isSelected ? { backgroundColor: colors['--primary'] } : {}}
                                        activeOpacity={0.7}
                                    >
                                        {renderIcon(
                                            interest.iconLibrary,
                                            interest.icon,
                                            20,
                                            isSelected ? '#ffffff' : colors['--accent']
                                        )}
                                        <Text
                                            className={`font-semibold capitalize ${isSelected ? 'text-white' : 'text-slate-700'
                                                }`}
                                        >
                                            {interest.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {hasMore && (
                            <TouchableOpacity
                                onPress={handleLoadMore}
                                className="mt-6 mx-auto px-8 py-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-full shadow-sm"
                                activeOpacity={0.7}
                            >
                                <Text style={{ color: colors['--primary'] }} className="font-semibold text-base">Load More ...</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </KeyboardAwareScrollView>

            <View className="px-8 pb-8 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
                <PrimaryButton
                    title="Continue"
                    iconName="arrow-forward"
                    onPress={handleContinue}
                />
            </View>
        </SafeAreaView>
    );
}
