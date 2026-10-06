import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { LearningStyle, LearningStyleForm, WeeklyCommitment } from '../../../src/components/onboarding/LearningStyleForm';
import { useTheme } from '../../../src/context/ThemeContext';
import { useToast } from '../../../src/context/ToastContext';
import { useRedirectToast } from '../../../src/hooks/useRedirectToast';
import { RootState } from '../../../src/store';

export default function LearningStyleScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { colors } = useTheme();
    const { user } = useSelector((state: RootState) => state.auth);
    const { loading } = useSelector((state: RootState) => state.onboarding);

    const [selectedCommitment, setSelectedCommitment] = useState<WeeklyCommitment | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<LearningStyle | null>(null);

    useRedirectToast();
    const { showToast } = useToast();

    const handleFinish = async () => {
        if (!selectedCommitment || !selectedStyle) return;

        try {
            // Mapping commitment to hours
            const commitmentMap: Record<WeeklyCommitment, number> = {
                '2h': 2,
                '5h': 5,
                '10h': 10,
                '20h+': 20
            };
            const weeklyLearningHours = commitmentMap[selectedCommitment];

            // Get data from params (potentially passed from previous screens)
            const courseId = params.courseId ? Number(params.courseId) : 0;
            const branchId = params.branchId ? Number(params.branchId) : 0;
            const currentRole = params.currentRole as string || '';
            const industry = params.industry as string || '';
            const yearsOfExperience = params.yearsOfExperience ? Number(params.yearsOfExperience) : 0;
            const targetRole = params.targetRole as string || '';


            router.push({
                pathname: '/(onboarding)/processing',
                params: {
                    learningStyle: selectedStyle,
                    weeklyLearningHours: weeklyLearningHours.toString(),
                    courseId: courseId.toString(),
                    branchId: branchId.toString(),
                    currentRole,
                    industry,
                    yearsOfExperience: yearsOfExperience.toString(),
                    targetRole
                }
            } as any);
        } catch (err: any) {
            console.error('Onboarding flow error:', err);
            showToast('Failed to continue. Please try again.', { status: 'error', title: 'Error' });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-b from-slate-50 to-blue-50/30 relative">
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

                <View className="w-10" />
            </View>

            <LearningStyleForm
                selectedCommitment={selectedCommitment}
                setSelectedCommitment={setSelectedCommitment}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                onFinish={handleFinish}
                isLoading={loading}
                showPreviewCard={user?.group === 'TEENS' || user?.group === 'SENIORS'}
                onPreviewPress={() => router.push('/(onboarding)/course' as any)}
            />
        </SafeAreaView>
    );
}
