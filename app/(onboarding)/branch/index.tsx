import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../../src/context/ThemeContext';
import { useRedirectToast } from '../../../src/hooks/useRedirectToast';
import { AppDispatch } from '../../../src/store';
import { fetchBranches } from '../../../src/store/slices/commonSlice';

export default function BranchChoiceScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();

    useRedirectToast();

    const courseId = params.courseId ? Number(params.courseId) : 0;

    useEffect(() => {
        if (courseId) {
            dispatch(fetchBranches(courseId));
        }
    }, [courseId, dispatch]);

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

                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 mt-10">
                    <View className="items-center">
                        <View className="w-24 h-24 bg-blue-100 rounded-3xl items-center justify-center mb-6" style={{ backgroundColor: colors['--primary'] + '10', borderRadius: 20 }}>
                            <MaterialCommunityIcons name="bullseye-arrow" size={48} color={colors['--primary']} />
                        </View>
                        <Text className="text-3xl font-extrabold text-slate-900 text-center mb-4">Refine your path</Text>
                        <Text className="text-slate-500 text-center mb-10 px-4">Select a specialization to help us tailor your experience.</Text>

                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/(onboarding)/branch/ai', params } as any)}
                            className="w-full bg-blue-600 p-6 rounded-3xl flex-row items-center justify-between mb-4 shadow-lg shadow-blue-200"
                            style={{ backgroundColor: colors['--primary'] }}
                        >
                            <View className="flex-row items-center gap-4">
                                <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
                                    <MaterialCommunityIcons name="creation" size={28} color="white" />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-xl">AI Suggest for Me</Text>
                                    <Text className="text-blue-100 text-sm">Best fit for your background</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={28} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/(onboarding)/branch/manual', params } as any)}
                            className="w-full bg-white border-2 border-slate-100 p-6 rounded-3xl flex-row items-center justify-between"
                        >
                            <View className="flex-row items-center gap-4">
                                <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center">
                                    <MaterialIcons name="search" size={28} color={colors['--primary']} />
                                </View>
                                <View>
                                    <Text className="text-slate-900 font-bold text-xl">Browse Manually</Text>
                                    <Text className="text-slate-500 text-sm">See all specializations</Text>
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
