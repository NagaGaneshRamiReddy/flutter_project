import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { PrimaryButton } from '../PrimaryButton';
import { KeyboardAwareScrollView } from '../KeyboardAwareScrollView';
import { PrimaryInput } from '../PrimaryInput';

interface ProfessionalProfileFormProps {
    currentRole: string;
    setCurrentRole: (role: string) => void;
    industry: string;
    setIndustry: (industry: string) => void;
    yearsOfExperience: number;
    setYearsOfExperience: (years: number) => void;
    targetRole: string;
    setTargetRole: (role: string) => void;
    onContinue: () => void;
}

export const ProfessionalProfileForm = ({
    currentRole,
    setCurrentRole,
    industry,
    setIndustry,
    yearsOfExperience,
    setYearsOfExperience,
    targetRole,
    setTargetRole,
    onContinue,
}: ProfessionalProfileFormProps) => {
    const { colors } = useTheme();

    const getYearsLabel = () => {
        if (yearsOfExperience >= 30) return '30+';
        return yearsOfExperience.toString();
    };

    return (
        <View className="flex-1">
            <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <View className="px-6">
                    {/* Header Illustration */}
                    <View className="items-center mt-4 mb-8">
                        <View className="relative">
                            <View className="absolute w-40 h-40 bg-blue-100/50 rounded-full" style={{ top: -10, left: -10 }} />
                            <View
                                className="w-28 h-28 rounded-3xl items-center justify-center"
                                style={{ backgroundColor: colors['--primary'] + '10' }}
                            >
                                <View
                                    className="w-14 h-14 rounded-2xl items-center justify-center"
                                    style={{
                                        backgroundColor: colors['--primary'] + '15',
                                        shadowColor: colors['--primary'],
                                        shadowOffset: { width: 0, height: 10 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 10,
                                        elevation: 5
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="briefcase-variant"
                                        size={32}
                                        color={colors['--primary']}
                                    />
                                </View>
                            </View>
                            <View className="absolute -right-8 top-1/2 -translate-y-1/2 flex-col gap-1">
                                <View className="w-2 h-12 rounded-full" style={{ backgroundColor: colors['--primary'] + '40' }} />
                                <View className="w-2 h-16 rounded-full" style={{ backgroundColor: colors['--primary'] + '70' }} />
                                <View className="w-2 h-12 rounded-full" style={{ backgroundColor: colors['--primary'] }} />
                            </View>
                        </View>
                    </View>

                    <View className="items-center mb-8">
                        <Text className="text-3xl font-extrabold text-slate-900 mb-2 text-center">
                            Professional Profile
                        </Text>
                        <Text className="text-slate-500 font-medium text-center">
                            Help us tailor your career growth.
                        </Text>
                    </View>

                    <View className="gap-6">
                        <View>
                            <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                Current Role
                            </Text>
                            <PrimaryInput
                                placeholder="e.g. Senior Software Engineer"
                                value={currentRole}
                                onChangeText={setCurrentRole}
                            />
                        </View>

                        <View>
                            <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                Industry
                            </Text>
                            <PrimaryInput
                                placeholder="e.g. Fintech, Healthcare"
                                value={industry}
                                onChangeText={setIndustry}
                            />
                        </View>

                        <View>
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Years of Experience
                                </Text>
                                <Text className="text-lg font-bold" style={{ color: colors['--primary'] }}>
                                    {getYearsLabel()} Years
                                </Text>
                            </View>
                            <View
                                className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl px-4 py-4 shadow-sm"
                            >
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={0}
                                    maximumValue={30}
                                    step={1}
                                    value={yearsOfExperience}
                                    onValueChange={setYearsOfExperience}
                                    minimumTrackTintColor={colors['--primary']}
                                    maximumTrackTintColor="#e2e8f0"
                                    thumbTintColor={colors['--primary']}
                                />
                                <View className="flex-row justify-between px-1">
                                    <Text className="text-xs text-slate-400 font-medium">0</Text>
                                    <Text className="text-xs text-slate-400 font-medium">15</Text>
                                    <Text className="text-xs text-slate-400 font-medium">30+</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                Target Role
                            </Text>
                            <PrimaryInput
                                placeholder="What's your dream title?"
                                value={targetRole}
                                onChangeText={setTargetRole}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>

            <View className="px-6 pb-8 pt-4 bg-slate-50">
                <PrimaryButton
                    title="Next Step"
                    iconName="arrow-forward"
                    onPress={onContinue}
                />
            </View>
        </View>
    );
};
