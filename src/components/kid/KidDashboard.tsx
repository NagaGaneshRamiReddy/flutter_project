import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { RootState } from '../../store';
import { AIChatButton } from '../ai-chat';

const { width } = Dimensions.get('window');

const KidDashboard = ({ onProfilePress }: { onProfilePress: () => void }) => {
    const { colors } = useTheme();
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();

    const chapters = [
        { id: 1, title: 'Island of ABCs', status: 'done', chapter: 'CHAPTER 1' },
        { id: 2, title: 'Math Jungle', status: 'current', chapter: 'CHAPTER 2', progress: 0.4 },
        { id: 3, title: 'Science Volcano', status: 'locked', chapter: 'CHAPTER 3' },
    ];

    const handleTabPress = (tab: any) => {
        if (tab === 'play') {
            router.push('/games' as any);
        } else if (tab === 'profile') {
            onProfilePress();
        }
    };

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                {/* Header Section */}
                <View className="flex-row justify-between items-center mb-8 mt-10">
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity
                            onPress={onProfilePress}
                            activeOpacity={0.8}
                            className="rounded-full border-4 border-white bg-white shadow-sm overflow-hidden"
                            style={{ width: 64, height: 64 }}
                        >
                            {user?.hero ? (
                                <Image
                                    source={{ uri: user.hero.startsWith('http') ? user.hero : `https://avatar.iran.liara.run/public/boy?username=${user.name}` }}
                                    className="w-full h-full"
                                />
                            ) : (
                                <View className="flex-1 items-center justify-center bg-slate-100">
                                    <MaterialIcons name="person" size={32} color={colors['--muted-foreground'] || '#64748B'} />
                                </View>
                            )}
                        </TouchableOpacity>
                        <View>
                            <Text className="text-3xl font-black text-slate-900 leading-none">Hi Buddy!</Text>
                            <View className="bg-green-100 px-2 py-0.5 rounded-lg self-start mt-1">
                                <Text className="text-green-600 font-bold text-xs">Lv 12 Explorer</Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row">
                        <View className="bg-slate-900 flex-row items-center gap-2 px-4 py-2 rounded-2xl shadow-sm">
                            <FontAwesome5 name="star" size={14} color="#FACC15" />
                            <Text className="text-white font-black text-sm">1,240</Text>
                        </View>
                    </View>
                </View>

                {/* Primary Action Cards */}
                <View className="flex-row gap-4 mb-10">
                    <TouchableOpacity
                        className="flex-1 h-36 rounded-[32px] justify-center items-center bg-blue-500 shadow-lg shadow-blue-200"
                        activeOpacity={0.9}
                        onPress={() => router.push('/lessons' as any)}
                    >
                        <MaterialIcons name="menu-book" size={40} color="white" />
                        <Text className="text-white text-lg font-black mt-3 uppercase tracking-wider">Lessons</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 h-36 rounded-[32px] justify-center items-center bg-purple-500 shadow-lg shadow-purple-200"
                        activeOpacity={0.9}
                        onPress={() => router.push('/games' as any)}
                    >
                        <Ionicons name="game-controller" size={40} color="white" />
                        <Text className="text-white text-lg font-black mt-3 uppercase tracking-wider">Games</Text>
                    </TouchableOpacity>
                </View>

                {/* Treasure Trail (Chapters) */}
                <View className="mb-10">
                    <TouchableOpacity onPress={() => router.push('/treasure-hunt' as any)}>
                        <Text className="text-xl font-black text-slate-900 mb-6">🗺️ Treasure Trail <Text className="text-sm font-normal text-slate-500">(Tap to view functionality)</Text></Text>
                    </TouchableOpacity>

                    <View className="items-center">
                        {chapters.map((chapter, index) => (
                            <View key={chapter.id} className="items-center mb-5 w-full">
                                {index > 0 && (
                                    <View
                                        className={`w-1 h-10 mb-2 rounded-full border-dotted border-l-2 ${chapter.status === 'locked' ? 'border-slate-200' : 'border-slate-800'}`}
                                    />
                                )}

                                <MotiView
                                    from={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', delay: index * 200 }}
                                    className="flex-row items-center w-full px-5"
                                >
                                    {chapter.status === 'done' ? (
                                        <View className="w-16 h-16 rounded-full bg-green-500 justify-center items-center z-10 shadow-sm">
                                            <MaterialIcons name="check" size={24} color="white" />
                                            <View className="absolute -bottom-1 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                                                <Text className="text-[8px] font-black text-slate-900">DONE</Text>
                                            </View>
                                        </View>
                                    ) : chapter.status === 'current' ? (
                                        <TouchableOpacity
                                            onPress={() => router.push('/treasure-hunt' as any)}
                                            className="w-20 h-20 rounded-full bg-blue-500 justify-center items-center z-10 border-4 border-yellow-400 shadow-md"
                                        >
                                            <View className="absolute -top-4 bg-yellow-400 px-3 py-1 rounded-xl shadow-sm">
                                                <Text className="text-[10px] font-black text-blue-900">NOW HERE!</Text>
                                            </View>
                                            <MaterialIcons name="star" size={32} color="white" />
                                        </TouchableOpacity>
                                    ) : (
                                        <View className="w-14 h-14 rounded-full bg-slate-100 justify-center items-center z-10 border-2 border-slate-200">
                                            <MaterialIcons name="lock" size={24} color="#CBD5E1" />
                                        </View>
                                    )}

                                    <View className={`flex-1 ml-5 p-4 rounded-3xl ${chapter.status === 'locked' ? 'bg-slate-50 border border-slate-200' : 'bg-slate-800 shadow-md'}`}>
                                        <Text className={`text-[10px] font-extrabold mb-1 uppercase tracking-tighter ${chapter.status === 'locked' ? 'text-slate-400' : 'text-blue-400'}`}>
                                            {chapter.chapter}
                                        </Text>
                                        <Text className={`text-base font-black ${chapter.status === 'locked' ? 'text-slate-400' : 'text-white'}`}>
                                            {chapter.title}
                                        </Text>
                                        {chapter.progress !== undefined && (
                                            <View className="h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden">
                                                <View
                                                    className="h-full bg-blue-400 rounded-full"
                                                    style={{ width: `${chapter.progress * 100}%` }}
                                                />
                                            </View>
                                        )}
                                    </View>
                                </MotiView>
                            </View>
                        ))}

                        {/* Big Reward */}
                        <View className="items-center mt-5">
                            <LinearGradient
                                colors={['#FBBF24', '#F59E0B']}
                                className="w-24 h-24 rounded-3xl justify-center items-center mb-4 shadow-lg shadow-yellow-200"
                            >
                                <MaterialIcons name="card-giftcard" size={40} color="white" />
                            </LinearGradient>
                            <Text className="text-xl font-black text-slate-900">The Big Reward!</Text>
                            <Text className="text-sm font-semibold text-slate-500">3 more levels to unlock</Text>
                        </View>
                    </View>
                </View>

                {/* Daily Quest */}
                <View className="bg-white rounded-[32px] p-6 border-2 border-slate-100 border-dashed shadow-sm">
                    <View className="flex-row justify-between items-center mb-5">
                        <View className="flex-1 mr-4">
                            <Text className="text-amber-500 text-sm font-black uppercase tracking-wider mb-1">Daily Quest</Text>
                            <Text className="text-lg font-black text-slate-900 leading-tight">Complete 3 Math Puzzles to earn a Diamond!</Text>
                        </View>
                        <MaterialIcons name="emoji-events" size={40} color="#E2E8F0" />
                    </View>
                    <View className="flex-row items-center gap-3">
                        <View className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                            <View className="h-full bg-yellow-400 rounded-full" style={{ width: '33.3%' }} />
                        </View>
                        <Text className="text-sm font-black text-slate-500">1/3</Text>
                    </View>
                </View>
            </ScrollView>

            <AIChatButton mode="kid" position={{ bottom: 30, right: 20 }} />
        </View>
    );
};

export default KidDashboard;
