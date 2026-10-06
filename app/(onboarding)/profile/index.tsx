import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfessionalProfileForm } from '../../../src/components/onboarding/ProfessionalProfileForm';
import { useTheme } from '../../../src/context/ThemeContext';
import { useRedirectToast } from '../../../src/hooks/useRedirectToast';

export default function ProfessionalProfileScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { colors } = useTheme();

    useRedirectToast();

    const [currentRole, setCurrentRole] = useState('');
    const [industry, setIndustry] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState(0);
    const [targetRole, setTargetRole] = useState('');

    const handleContinue = () => {
        router.push({
            pathname: '/(onboarding)/profile/learning-style',
            params: {
                ...params,
                currentRole,
                industry,
                yearsOfExperience: yearsOfExperience.toString(),
                targetRole,
            }
        } as any);
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
                    <View className="h-1.5 w-6 rounded-full" style={{ backgroundColor: colors['--primary'] }} />
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                </View>

                <View className="w-10" />
            </View>

            <ProfessionalProfileForm
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                industry={industry}
                setIndustry={setIndustry}
                yearsOfExperience={yearsOfExperience}
                setYearsOfExperience={setYearsOfExperience}
                targetRole={targetRole}
                setTargetRole={setTargetRole}
                onContinue={handleContinue}
            />
        </SafeAreaView>
    );
}
