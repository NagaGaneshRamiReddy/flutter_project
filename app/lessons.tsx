import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/context/ThemeContext';

export default function LessonsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { colors, activeTheme } = useTheme();

    // Determine user mode
    const isKid = activeTheme === 'kid';
    const title = isKid ? "My Lessons" : "My Assessments";

    // Mock Data
    const lessons = [
        { id: '1', title: 'Introduction to Plants', category: 'Science', progress: 0.8, color: 'bg-green-500', icon: 'leaf' },
        { id: '2', title: 'Basic Arithmetic', category: 'Math', progress: 0.3, color: 'bg-blue-500', icon: 'calculator' },
        { id: '3', title: 'World Geography', category: 'Geography', progress: 0, color: 'bg-indigo-500', icon: 'globe' },
    ];

    const assessments = [
        { id: '1', title: 'Plant Life Cycle Quiz', topic: 'Science', difficulty: 'Easy', status: 'Pending' },
        { id: '2', title: 'Math Mid-Term', topic: 'Math', difficulty: 'Medium', status: 'Completed', score: 85 },
    ];

    return (
        <View className="flex-1" style={{ backgroundColor: colors['--background'] }}>
            {/* Header */}
            <View
                className="px-6 pb-6 pt-2 border-b"
                style={{
                    paddingTop: insets.top + 10,
                    backgroundColor: colors['--background'],
                    borderBottomColor: colors['--secondary']
                }}
            >
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-black" style={{ color: colors.text }}>{title}</Text>
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
                        <MaterialIcons name="search" size={24} color={colors['--muted-foreground']} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {isKid ? (
                    <View className="gap-6">
                        {lessons.map((lesson, index) => (
                            <TouchableOpacity
                                key={lesson.id}
                                className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-100 flex-row gap-4"
                                style={{ backgroundColor: colors['--background'], borderColor: colors['--secondary'] }}
                            >
                                <View className={`w-24 h-24 rounded-2xl items-center justify-center ${lesson.color}`}>
                                    <Ionicons name={lesson.icon as any} size={40} color="white" />
                                </View>
                                <View className="flex-1 justify-between py-1">
                                    <View>
                                        <Text className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: colors['--muted-foreground'] }}>{lesson.category}</Text>
                                        <Text className="text-lg font-black leading-tight" style={{ color: colors.text }}>{lesson.title}</Text>
                                    </View>
                                    <View>
                                        <View className="flex-row justify-between mb-1.5">
                                            <Text className="text-xs font-bold" style={{ color: colors['--muted-foreground'] }}>Progress</Text>
                                            <Text className="text-xs font-bold" style={{ color: colors['--primary'] }}>{Math.round(lesson.progress * 100)}%</Text>
                                        </View>
                                        <View className="h-2 bg-slate-100 rounded-full overflow-hidden" style={{ backgroundColor: colors['--secondary'] }}>
                                            <View
                                                className="h-full rounded-full"
                                                style={{ width: `${lesson.progress * 100}%`, backgroundColor: colors['--primary'] }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View className="gap-4">
                        {assessments.map((assessment) => (
                            <TouchableOpacity
                                key={assessment.id}
                                onPress={() => router.push({ pathname: '/quiz', params: { topic: assessment.title } })}
                                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                                style={{ backgroundColor: colors['--background'], borderColor: colors['--secondary'] }}
                            >
                                <View className="flex-row justify-between items-start mb-3">
                                    <View className="px-2 py-1 rounded-md bg-slate-100" style={{ backgroundColor: colors['--secondary'] }}>
                                        <Text className="text-xs font-bold" style={{ color: colors['--muted-foreground'] }}>{assessment.topic}</Text>
                                    </View>
                                    <View className={`px-2 py-1 rounded-md ${assessment.status === 'Completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                        <Text className={`text-xs font-bold ${assessment.status === 'Completed' ? 'text-green-700' : 'text-yellow-700'}`}>
                                            {assessment.status}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-lg font-bold mb-1" style={{ color: colors.text }}>{assessment.title}</Text>
                                <Text className="text-sm font-medium mb-4" style={{ color: colors['--muted-foreground'] }}>Difficulty: {assessment.difficulty}</Text>

                                {assessment.status === 'Completed' ? (
                                    <View className="flex-row items-center gap-2">
                                        <MaterialIcons name="check-circle" size={20} color="#22c55e" />
                                        <Text className="text-green-600 font-bold">Score: {assessment.score}%</Text>
                                    </View>
                                ) : (
                                    <View className="flex-row items-center gap-1">
                                        <Text className="font-bold" style={{ color: colors['--primary'] }}>Start Quiz</Text>
                                        <MaterialIcons name="arrow-forward" size={16} color={colors['--primary']} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
