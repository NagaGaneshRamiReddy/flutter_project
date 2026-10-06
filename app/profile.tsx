import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { useTheme } from '../src/context/ThemeContext';
import { AppDispatch, RootState } from '../src/store';
import { logout } from '../src/store/slices/authSlice';


export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        router.replace('/(auth)/login');
    };

    if (!user) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <Text className="text-slate-400">No user data available</Text>
            </View>
        );
    }

    const preferences = user.preferences;

    return (
        <View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top + 20,
                    paddingBottom: insets.bottom + 40
                }}
            >
                {/* Header */}
                <View className="px-6 mb-6 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white items-center justify-center mr-4"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={{ color: colors.text }} className="text-3xl font-black">
                        Profile
                    </Text>
                </View>

                {/* User Info Card */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 600 }}
                    className="mx-6 mb-6"
                >
                    <View className="bg-white/80 rounded-3xl border border-white overflow-hidden">
                        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                        <View className="p-6">
                            <View className="items-center mb-6">
                                <View className="mb-4">
                                    {user?.hero ? (
                                        <Image
                                            source={{ uri: user.hero.startsWith('http') ? user.hero : `https://avatar.iran.liara.run/public/boy?username=${user.name}` }}
                                            className="w-full h-full"
                                        />
                                    ) : (
                                        <MaterialIcons name="person" size={32} color={colors['--muted-foreground']} />
                                    )}
                                </View>
                                <Text style={{ color: colors.text }} className="text-2xl font-black mb-1">
                                    {user.name}
                                </Text>
                                <Text style={{ color: colors['text-secondary'] }} className="text-sm font-medium">
                                    {user.email}
                                </Text>
                            </View>

                            <View className="space-y-4">
                                <InfoRow label="Age" value={user.age?.toString() || 'N/A'} colors={colors} />
                                <InfoRow label="Group" value={user.group || 'N/A'} colors={colors} />
                                <InfoRow label="Role" value={user.role || 'N/A'} colors={colors} />
                                <InfoRow
                                    label="Onboarded"
                                    value={user.isOnboarded ? 'Yes' : 'No'}
                                    colors={colors}
                                />
                                <InfoRow
                                    label="Member Since"
                                    value={new Date(user.createdAt).toLocaleDateString()}
                                    colors={colors}
                                />
                            </View>
                        </View>
                    </View>
                </MotiView>

                {/* Preferences Card */}
                {preferences && (
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 600, delay: 200 }}
                        className="mx-6 mb-6"
                    >
                        <Text style={{ color: colors.text }} className="text-xl font-black mb-4">
                            Learning Preferences
                        </Text>
                        <View className="bg-white/80 rounded-3xl border border-white overflow-hidden">
                            <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                            <View className="p-6 space-y-4">
                                <InfoRow
                                    label="Learning Style"
                                    value={preferences.learningStyle || 'Not set'}
                                    colors={colors}
                                />
                                <InfoRow
                                    label="Weekly Hours"
                                    value={preferences.weeklyLearningHours ? `${preferences.weeklyLearningHours} hours` : 'Not set'}
                                    colors={colors}
                                />
                                <InfoRow
                                    label="Course ID"
                                    value={preferences.courseId?.toString() || 'Not set'}
                                    colors={colors}
                                />
                                <InfoRow
                                    label="Branch ID"
                                    value={preferences.branchId?.toString() || 'Not set'}
                                    colors={colors}
                                />
                                {preferences.currentRole && (
                                    <InfoRow
                                        label="Current Role"
                                        value={preferences.currentRole}
                                        colors={colors}
                                    />
                                )}
                                {preferences.targetRole && (
                                    <InfoRow
                                        label="Target Role"
                                        value={preferences.targetRole}
                                        colors={colors}
                                    />
                                )}
                                {preferences.industry && (
                                    <InfoRow
                                        label="Industry"
                                        value={preferences.industry}
                                        colors={colors}
                                    />
                                )}
                                {preferences.yearsOfExperience && (
                                    <InfoRow
                                        label="Experience"
                                        value={`${preferences.yearsOfExperience} years`}
                                        colors={colors}
                                    />
                                )}
                            </View>
                        </View>
                    </MotiView>
                )}

                {/* Logout Button */}
                <View className="px-6">
                    <PrimaryButton
                        title="Log Out"
                        iconName="logout"
                        onPress={handleLogout}
                        style={{ backgroundColor: '#ef4444' }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const InfoRow = ({ label, value, colors }: { label: string; value: string; colors: any }) => (
    <View className="flex-row justify-between items-center py-2">
        <Text style={{ color: colors['text-secondary'] }} className="text-sm font-bold uppercase tracking-wider">
            {label}
        </Text>
        <Text style={{ color: colors.text }} className="text-base font-black">
            {value}
        </Text>
    </View>
);
