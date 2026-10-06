import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeIcon } from '../../../src/components/SafeIcon';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { KeyboardAwareScrollView } from '../../../src/components/KeyboardAwareScrollView';
import { PrimaryInput } from '../../../src/components/PrimaryInput';
import { useTheme } from '../../../src/context/ThemeContext';
import { useRedirectToast } from '../../../src/hooks/useRedirectToast';
import { RootState } from '../../../src/store';

export default function BranchManualScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors } = useTheme();
    const { user } = useSelector((state: RootState) => state.auth);
    const { branches } = useSelector((state: RootState) => state.common);

    useRedirectToast();

    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(10);

    const courseId = params.courseId ? Number(params.courseId) : 0;
    const courseIcon = (params.courseIcon as string) || 'school';
    const courseIconLib = (params.courseIconLib as string) || 'MaterialCommunityIcons';

    const filteredBranches = useMemo(() => {
        return branches.filter((branch: any) =>
            branch.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [branches, searchQuery]);

    const visibleBranches = useMemo(() => {
        return filteredBranches.slice(0, displayCount);
    }, [filteredBranches, displayCount]);

    const hasMore = displayCount < filteredBranches.length;

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 10);
    };

    const renderIcon = (iconLibrary: string, iconName: string, size: number, color: string) => (
        <SafeIcon library={iconLibrary} name={iconName} size={size} color={color} />
    );

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
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    <View className="h-1.5 w-6 rounded-full " style={{ backgroundColor: colors["--primary"] }} />
                </View>

                <View className="w-10" />
            </View>

            <KeyboardAwareScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="px-8 mt-4">
                    <Text className="text-3xl font-bold text-slate-900 mb-2 leading-tight">Browse All</Text>
                    <Text className="text-slate-500 mb-8 text-base font-medium">Choose a specialization to finish onboarding.</Text>

                    <View className="mb-10">
                        <PrimaryInput
                            placeholder="Search specializations..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            iconName="search"
                        />
                    </View>

                    <View className="flex-row flex-wrap gap-4 justify-center pb-10">
                        {visibleBranches.map((branch: any) => {
                            const isSelected = selectedBranchId === branch.id;
                            return (
                                <TouchableOpacity
                                    key={branch.id}
                                    onPress={() => {
                                        setSelectedBranchId(isSelected ? null : branch.id);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                    className={`flex-row items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all ${isSelected
                                        ? 'shadow-lg'
                                        : 'bg-white/40 backdrop-blur-md border border-white/60 shadow-sm'
                                        }`}
                                    style={isSelected ? { backgroundColor: colors['--primary'] } : {}}
                                    activeOpacity={0.7}
                                >
                                    <View className={`w-8 h-8 rounded-full items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-slate-50'}`}>
                                        {renderIcon(courseIconLib, courseIcon, 18, isSelected ? '#ffffff' : colors['--primary'])}
                                    </View>
                                    <Text
                                        className={`font-bold capitalize text-base ${isSelected ? 'text-white' : 'text-slate-700'
                                            }`}
                                    >
                                        {branch.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {hasMore && (
                        <TouchableOpacity
                            onPress={handleLoadMore}
                            className="mx-auto px-8 py-3 bg-white/60 backdrop-blur-md border border-white/80 rounded-full shadow-sm"
                            activeOpacity={0.7}
                        >
                            <Text style={{ color: colors['--primary'] }} className="font-bold text-base">Load More ...</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAwareScrollView>

            <View className="p-8">
                {
                    selectedBranchId && (
                        <PrimaryButton
                            title="Finalize Path"
                            iconName="verified"
                            onPress={handleFinalize}
                            disabled={!selectedBranchId}
                            style={!selectedBranchId ? { opacity: 0.5 } : {}}
                        />
                    )
                }
            </View>
        </SafeAreaView>
    );
}
