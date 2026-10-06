import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../src/context/ThemeContext';
import { useToast } from '../../../src/context/ToastContext';
import { useRedirectToast } from '../../../src/hooks/useRedirectToast';
import { AppDispatch, RootState } from '../../../src/store';
import { fetchCourses } from '../../../src/store/slices/commonSlice';
import { getSkillsAndInterests } from '../../../src/store/slices/onboardingSlice';

export default function CourseChoiceScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { user } = useSelector((state: RootState) => state.auth);
    const { userSkills, userInterests, loading: onboardingLoading } = useSelector((state: RootState) => state.onboarding);

    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const { showToast } = useToast();
    useRedirectToast();

    const isMandatory = user?.group === 'COLLEGE_STUDENTS' || user?.group === 'PROFESSIONALS';

    useEffect(() => {
        const loadData = async () => {
            setIsInitialLoading(true);
            try {
                await Promise.all([
                    dispatch(fetchCourses()).unwrap(),
                    dispatch(getSkillsAndInterests()).unwrap(),
                ]);
            } catch (error) {
                console.error('Failed to load course page data:', error);
            } finally {
                setIsInitialLoading(false);
            }
        };
        loadData();
    }, [dispatch]);

    const handleSkip = () => {
        if (!isMandatory) {
            // Skip course selection but still go through learning style setup
            router.push('/(onboarding)/profile/learning-style' as any);
        }
    };

    // Show loading state while initial data is being fetched
    if (isInitialLoading) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
                <ActivityIndicator size="large" color={colors['--primary']} />
                <Text className="mt-4 text-slate-500 font-medium">Loading your preferences...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50 relative">
            {/* Header */}
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
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    <View className="h-1.5 w-6 rounded-full" style={{ backgroundColor: colors['--primary'] }} />
                </View>

                {!isMandatory ? (
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={{ color: colors['--primary'] }} className="font-semibold text-base">Skip</Text>
                    </TouchableOpacity>
                ) : <View className="w-10" />}
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6">
                    <View className="items-center mt-6">
                        <View className="w-24 h-24 bg-blue-100 rounded-3xl items-center justify-center mb-6" style={{ backgroundColor: colors['--primary'] + '10', borderRadius: 20 }}>
                            <MaterialCommunityIcons name="auto-fix" size={48} color={colors['--primary']} />
                        </View>
                        <Text className="text-3xl font-extrabold text-slate-900 text-center mb-4">Select your courses</Text>
                        <Text className="text-slate-500 text-center mb-6 px-4">Choose how you'd like to discover your educational path.</Text>

                        {/* Profile Context Section */}
                        {((userSkills?.length ?? 0) > 0 || (userInterests?.length ?? 0) > 0) && (
                            <View className="w-full mb-10">
                                <View className="flex-row flex-wrap gap-2 justify-center">
                                    {userSkills?.map(skill => (
                                        <View key={`skill-${skill.id}`} className="px-3 py-1.5 rounded-full border flex-row items-center gap-1.5" style={{ backgroundColor: `${colors['--primary']}10`, borderColor: `${colors['--primary']}20` }}>
                                            <MaterialCommunityIcons name="star" size={12} color={colors['--primary']} />
                                            <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors['--primary'] }}>{skill.name}</Text>
                                        </View>
                                    ))}
                                    {userInterests?.map(interest => (
                                        <View key={`interest-${interest.id}`} className="px-3 py-1.5 rounded-full border flex-row items-center gap-1.5" style={{ backgroundColor: `${colors['--accent']}10`, borderColor: `${colors['--accent']}20` }}>
                                            <MaterialCommunityIcons name="lightbulb" size={12} color={colors['--accent']} />
                                            <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors['--accent'] }}>{interest.name}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={() => {
                                if ((userSkills?.length ?? 0) === 0) {
                                    showToast('AI prediction requires at least one skill. Please select skills first or browse manually.', { status: 'info', title: 'Action Required' });
                                } else {
                                    router.push('/(onboarding)/course/ai' as any);
                                }
                            }}
                            style={{ backgroundColor: colors['--primary'], opacity: (userSkills?.length ?? 0) === 0 ? 0.7 : 1 }}
                            className="w-full p-6 rounded-3xl flex-row items-center justify-between mb-4 shadow-xl shadow-primary/20"
                        >
                            <View className="flex-row items-center gap-4">
                                <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
                                    <MaterialCommunityIcons name="creation" size={28} color="white" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-xl">AI Predict for Me</Text>
                                    <Text className="text-blue-50/80 max-w-64 text-sm font-medium">Smart matching based on skills and interests</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={28} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push('/(onboarding)/course/manual' as any)}
                            className="w-full bg-white border border-slate-100 p-6 rounded-3xl flex-row items-center justify-between shadow-sm"
                        >
                            <View className="flex-row items-center gap-4">
                                <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center">
                                    <MaterialIcons name="search" size={28} color={colors['--primary']} />
                                </View>
                                <View>
                                    <Text className="text-slate-900 font-bold text-xl">Browse Manually</Text>
                                    <Text className="text-slate-500 text-sm font-medium">Select from all available courses</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={28} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
