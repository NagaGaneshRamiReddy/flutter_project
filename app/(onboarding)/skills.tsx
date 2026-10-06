import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeIcon } from '../../src/components/SafeIcon';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { KeyboardAwareScrollView } from '../../src/components/KeyboardAwareScrollView';
import { PrimaryInput } from '../../src/components/PrimaryInput';
import { useTheme } from '../../src/context/ThemeContext';
import { useRedirectToast } from '../../src/hooks/useRedirectToast';
import { AppDispatch, RootState } from '../../src/store';
import { fetchSkills, toggleSkill } from '../../src/store/slices/commonSlice';
import { updateSkillsAndInterests } from '../../src/store/slices/onboardingSlice';

const renderIcon = (iconLibrary: string, iconName: string, size: number, color: string) => (
    <SafeIcon library={iconLibrary} name={iconName} size={size} color={color} />
);

export default function SkillsScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { skills, selectedSkills, selectedInterests, loading, error } = useSelector(
        (state: RootState) => state.common
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(10);
    const [showError, setShowError] = useState(false);

    useRedirectToast();

    useEffect(() => {
        dispatch(fetchSkills());
    }, [dispatch]);

    // Clear error when user selects a skill
    useEffect(() => {
        if (selectedSkills.length > 0 && showError) {
            setShowError(false);
        }
    }, [selectedSkills, showError]);

    // Memoize filtered and sorted results for performance
    const { visibleSkills, hasMore } = useMemo(() => {
        // Always include selected items, even if they don't match search
        const selectedItems = skills.filter(item => selectedSkills.includes(item.id));

        // Filter unselected items by search query
        const matchingUnselected = skills.filter(item =>
            !selectedSkills.includes(item.id) &&
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Combine: selected items first, then matching unselected
        const combined = [...selectedItems, ...matchingUnselected];

        return {
            sortedSkills: combined,
            visibleSkills: combined.slice(0, displayCount),
            hasMore: displayCount < combined.length
        };
    }, [skills, selectedSkills, searchQuery, displayCount]);

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 10);
    };

    const handleToggle = (id: number) => {
        dispatch(toggleSkill(id));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };


    const { user } = useSelector((state: RootState) => state.auth);

    const handleContinue = async () => {
        if (selectedSkills.length === 0 && selectedInterests.length === 0) {
            setShowError(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        try {
            await dispatch(updateSkillsAndInterests({
                skillIds: selectedSkills,
                interestIds: selectedInterests
            })).unwrap();

            const isDirectToLearningStyle = user?.group === 'TEENS' || user?.group === 'SENIORS' || user?.group === 'KIDS';
            const nextPath = isDirectToLearningStyle ? '/(onboarding)/profile/learning-style' : '/(onboarding)/course/';

            router.replace(nextPath as any);

        } catch (err) {
            console.error('Failed to update skills and interests:', err);
            // Error handling is already managed by Redux state given to component
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gradient-to-b from-slate-50 to-blue-50/30 items-center justify-center">
                <ActivityIndicator size="large" color={colors['--accent']} />
                <Text className="mt-4 text-slate-500 font-medium">Loading skills...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gradient-to-b from-slate-50 to-blue-50/30 items-center justify-center px-8">
                <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#ef4444" />
                <Text className="mt-4 text-red-500 font-semibold text-lg">Failed to load skills</Text>
                <Text className="mt-2 text-slate-500 text-center">{error}</Text>
                <TouchableOpacity
                    onPress={() => dispatch(fetchSkills())}
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-full"
                >
                    <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-b from-slate-50 to-blue-50/30">
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
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    <View className="h-1.5 w-6 rounded-full bg-blue-600" />
                </View>

                <TouchableOpacity onPress={handleContinue}>
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
                                    <MaterialCommunityIcons name="code-braces" size={96} color={colors['--accent']} style={{ opacity: 0.8 }} />
                                    <MaterialCommunityIcons
                                        name="star"
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
                            What skills do you have?
                        </Text>
                        <Text className="text-slate-500 font-medium">
                            Select your current skill set.
                        </Text>
                    </View>

                    <View className="w-full mb-6">
                        <PrimaryInput
                            placeholder="Search skills..."
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
                            {visibleSkills.map((skill) => {
                                const isSelected = selectedSkills.includes(skill.id);
                                return (
                                    <TouchableOpacity
                                        key={skill.id}
                                        onPress={() => handleToggle(skill.id)}
                                        className={`flex-row items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all ${isSelected
                                            ? 'shadow-lg'
                                            : 'bg-white/40 backdrop-blur-md border border-white/60 shadow-sm'
                                            }`}
                                        style={isSelected ? { backgroundColor: colors['--primary'] } : {}}
                                        activeOpacity={0.7}
                                    >
                                        {renderIcon(
                                            skill.iconLibrary,
                                            skill.icon,
                                            20,
                                            isSelected ? '#ffffff' : colors['--accent']
                                        )}
                                        <Text
                                            className={`font-semibold capitalize ${isSelected ? 'text-white' : 'text-slate-700'
                                                }`}
                                        >
                                            {skill.name}
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
                {showError && (
                    <Text className="text-red-500 text-center mb-3 font-medium">
                        Please select at least one skill or interest
                    </Text>
                )}
                <PrimaryButton
                    title="Continue"
                    iconName="arrow-forward"
                    onPress={handleContinue}
                />
            </View>
        </SafeAreaView>
    );
}
