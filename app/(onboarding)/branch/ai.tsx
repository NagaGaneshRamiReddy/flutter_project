import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AICard } from '../../../src/components/onboarding/AICard';
import PredictionLoader from '../../../src/components/PredictionLoader';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { useTheme } from '../../../src/context/ThemeContext';
import { useToast } from '../../../src/context/ToastContext';
import { AppDispatch, RootState } from '../../../src/store';
import { predictBranch } from '../../../src/store/slices/commonSlice';

export default function BranchAIScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { user } = useSelector((state: RootState) => state.auth);
    const { predictions, selectedInterests, selectedSkills } = useSelector((state: RootState) => state.common);
    const { userSkills, userInterests } = useSelector((state: RootState) => state.onboarding);

    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [isPredicting, setIsPredicting] = useState(true);
    const { showToast } = useToast();

    const courseId = params.courseId ? Number(params.courseId) : 0;
    const courseIcon = (params.courseIcon as string) || 'school';
    const courseIconLib = (params.courseIconLib as string) || 'MaterialCommunityIcons';

    useEffect(() => {
        handleAIPredict();
    }, []);

    const handleAIPredict = async () => {
        setIsPredicting(true);

        const interestIds = (selectedInterests?.length ?? 0) > 0 ? selectedInterests : (userInterests || []).map(i => i.id);
        const skillIds = (selectedSkills?.length ?? 0) > 0 ? selectedSkills : (userSkills || []).map(s => s.id);

        if (skillIds.length === 0) {
            setIsPredicting(false);
            showToast('AI prediction requires at least one skill. Switching to manual...', { status: 'info' });
            setTimeout(() => router.replace({ pathname: '/(onboarding)/branch/manual', params } as any), 2000);
            return;
        }

        const predictPromise = dispatch(predictBranch({
            interestIds,
            skillIds,
            courseId: courseId
        })).unwrap();

        const delayPromise = new Promise(resolve => setTimeout(resolve, 3000));

        try {
            await Promise.all([predictPromise, delayPromise]);
        } catch (err: any) {
            console.error('Prediction failed:', err);
            const errorMessage = typeof err === 'string' ? err : err?.message || 'AI prediction failed. Please try manual selection.';
            showToast(errorMessage, { status: 'error', title: 'Error' });
            setTimeout(() => router.replace({ pathname: '/(onboarding)/branch/manual', params } as any), 2000);
        } finally {
            setIsPredicting(false);
        }
    };

    const handleFinalize = () => {
        const isProfessional = user?.group === 'PROFESSIONALS';

        // Professionals go to professional profile, others go to learning style
        router.push({
            pathname: isProfessional ? '/(onboarding)/profile/' : '/(onboarding)/profile/learning-style',
            params: {
                courseId: courseId.toString(),
                branchId: selectedBranchId!.toString(),
                courseIcon,
                courseIconLib,
            }
        } as any);
    };

    if (isPredicting) return <PredictionLoader />;

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                {router.canGoBack() ? (
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
                    <View className="h-1.5 w-6 rounded-full" style={{ backgroundColor: colors['--primary'] }} />
                </View>

                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="px-8 mt-4">
                    <Text className="text-3xl font-bold text-slate-900 mb-2 leading-tight">Recommended For You</Text>
                    <Text className="text-slate-500 mb-8 text-base font-medium">Choose a specialization to finalize your path.</Text>

                    <View className="gap-5">
                        {predictions.branches.map((branch) => (
                            <AICard
                                key={branch.id}
                                item={branch}
                                isSelected={selectedBranchId === branch.id}
                                onSelect={(id) => {
                                    setSelectedBranchId(id);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                }}
                                icon={courseIcon}
                                iconLibrary={courseIconLib}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={() => router.replace({ pathname: '/(onboarding)/branch/manual', params } as any)}
                        className="items-center py-10"
                        activeOpacity={0.7}
                    >
                        <Text className="font-bold text-base" style={{ color: colors['--primary'] }}>
                            Browse All Specializations
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View className="px-8 pb-8 pt-2 bg-slate-50">
                {
                    selectedBranchId && (
                        <PrimaryButton
                            title="Finalize Path"
                            iconName="verified"
                            onPress={handleFinalize}
                        />
                    )
                }
            </View>
        </SafeAreaView>
    );
}

