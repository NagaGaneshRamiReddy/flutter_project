import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { PrimaryButton } from '../PrimaryButton';

export type LearningStyle = 'visual' | 'hands-on' | 'reading' | 'mixed';
export type WeeklyCommitment = '2h' | '5h' | '10h' | '20h+';

interface LearningStyleOption {
    id: LearningStyle;
    label: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const learningStyles: LearningStyleOption[] = [
    { id: 'visual', label: 'Visual', icon: 'eye-outline' },
    { id: 'hands-on', label: 'Hands-on', icon: 'wrench-outline' },
    { id: 'reading', label: 'Reading', icon: 'book-open-variant' },
    { id: 'mixed', label: 'Mixed', icon: 'star-outline' },
];

const weeklyCommitmentOptions: WeeklyCommitment[] = ['2h', '5h', '10h', '20h+'];

interface LearningStyleFormProps {
    selectedCommitment: WeeklyCommitment | null;
    setSelectedCommitment: (commitment: WeeklyCommitment) => void;
    selectedStyle: LearningStyle | null;
    setSelectedStyle: (style: LearningStyle) => void;
    onFinish: () => void;
    isLoading?: boolean;
    showPreviewCard?: boolean;
    onPreviewPress?: () => void;
}

export const LearningStyleForm = ({
    selectedCommitment,
    setSelectedCommitment,
    selectedStyle,
    setSelectedStyle,
    onFinish,
    isLoading,
    showPreviewCard = false,
    onPreviewPress
}: LearningStyleFormProps) => {
    const { colors } = useTheme();

    const handleSelectCommitment = (commitment: WeeklyCommitment) => {
        setSelectedCommitment(commitment);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleSelectStyle = (style: LearningStyle) => {
        setSelectedStyle(style);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <View className="flex-1">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <View className="px-6">
                    {/* Header Illustration */}
                    <View className="items-center mt-4 mb-8">
                        <View className="relative">
                            <MaterialCommunityIcons
                                name="lightbulb-outline"
                                size={24}
                                color={colors['--primary'] + '60'}
                                style={{ position: 'absolute', top: 10, left: -30 }}
                            />
                            <MaterialIcons
                                name="star"
                                size={18}
                                color={colors['--primary'] + '50'}
                                style={{ position: 'absolute', top: -10, right: -40 }}
                            />
                            <MaterialCommunityIcons
                                name="puzzle-outline"
                                size={20}
                                color={colors['--primary'] + '40'}
                                style={{ position: 'absolute', bottom: 20, right: -50 }}
                            />
                            <MaterialCommunityIcons
                                name="school-outline"
                                size={22}
                                color={colors['--primary'] + '45'}
                                style={{ position: 'absolute', bottom: 0, left: -40 }}
                            />

                            {/* Main Icon Container */}
                            <View className="w-28 h-28 bg-blue-100 rounded-3xl items-center justify-center mb-6" style={{ backgroundColor: colors['--primary'] + '10', borderRadius: 20 }}>

                                <MaterialIcons
                                    name="hourglass-empty"
                                    size={56}
                                    color={colors['--primary']}
                                />
                            </View>
                        </View>
                    </View>

                    <View className="items-center mb-10">
                        <Text className="text-3xl font-extrabold text-slate-900 mb-2 text-center">
                            Your Learning Styles
                        </Text>
                        <Text className="text-slate-500 font-medium text-center text-lg">
                            How do you learn best?
                        </Text>
                    </View>

                    {/* Weekly Commitment Section */}
                    <View className="mb-10">
                        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400 mb-5 ml-1">
                            WEEKLY COMMITMENT
                        </Text>
                        <View className="flex-row gap-3">
                            {weeklyCommitmentOptions.map((option) => {
                                const isSelected = selectedCommitment === option;
                                return (
                                    <TouchableOpacity
                                        key={option}
                                        onPress={() => handleSelectCommitment(option)}
                                        className="flex-1 py-3.5 rounded-3xl items-center justify-center border border-slate-100"
                                        style={[
                                            isSelected ? {
                                                backgroundColor: colors['--primary'],
                                                borderColor: colors['--primary'],
                                                shadowColor: colors['--primary'],
                                                shadowOffset: { width: 0, height: 4 },
                                                shadowOpacity: 0.3,
                                                shadowRadius: 10,
                                                elevation: 8,
                                            } : {
                                                backgroundColor: 'white',
                                            }
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text
                                            className={`font-bold text-base ${isSelected ? 'text-white' : 'text-slate-600'
                                                }`}
                                        >
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Preferred Method Section */}
                    <View className="mb-10">
                        <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400 mb-5 ml-1">
                            PREFERRED METHOD
                        </Text>
                        <View className="flex-row justify-between">
                            {learningStyles.map((style) => {
                                const isSelected = selectedStyle === style.id;
                                return (
                                    <TouchableOpacity
                                        key={style.id}
                                        onPress={() => handleSelectStyle(style.id)}
                                        className="w-[23%] aspect-[0.85] rounded-2xl items-center justify-center border"
                                        style={[
                                            isSelected ? {
                                                backgroundColor: 'white',
                                                borderColor: colors['--primary'],
                                                shadowColor: colors['--primary'],
                                                shadowOffset: { width: 0, height: 4 },
                                                shadowOpacity: 0.05,
                                                shadowRadius: 10,
                                                elevation: 2,
                                                borderWidth: 2,
                                            } : {
                                                backgroundColor: 'white',
                                                borderColor: '#f1f5f9',
                                                borderWidth: 1.5,
                                            }
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <View className="w-12 h-12 rounded-lg mb-2 items-center justify-center" style={{
                                            backgroundColor: isSelected ? colors['--primary'] : '#fbfbfb',
                                        }}>
                                            <MaterialCommunityIcons
                                                name={style.icon as any}
                                                size={22}
                                                color={isSelected ? '#ffffff' : colors['--primary']}
                                            />
                                        </View>
                                        <Text
                                            className={`font-bold text-[11px] ${isSelected ? 'text-slate-900' : 'text-slate-500'
                                                }`}
                                        >
                                            {style.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Preview Card Section */}
                    {showPreviewCard && (
                        <TouchableOpacity
                            onPress={onPreviewPress}
                            className="bg-white rounded-[24px] p-5 flex-row items-center border border-slate-50 mb-6"
                        >
                            <View
                                className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                style={{ backgroundColor: colors['--primary'] }}
                            >
                                <MaterialCommunityIcons name="creation" size={28} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-slate-900">Preview Course & Branch</Text>
                                <Text className="text-slate-500 text-sm">AI suggested path is ready</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
                        </TouchableOpacity>
                    )}

                </View>
            </ScrollView>
            {/* Primary Action */}
            {(selectedCommitment && selectedStyle) && (
                <View className="absolute bottom-8 left-0 right-0 px-6">
                    <PrimaryButton
                        title="Finish & Build Path"
                        iconName="rocket-launch"
                        onPress={onFinish}
                    />
                </View>
            )}
        </View>
    );
};
