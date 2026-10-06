import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../src/context/ThemeContext';
import { AppDispatch, RootState } from '../../src/store';
import { logout } from '../../src/store/slices/authSlice';

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        router.replace('/(auth)/login');
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
            <ScrollView
                contentContainerStyle={{
                    paddingTop: insets.top + 20,
                    paddingHorizontal: 20
                }}
            >
                <Text style={{ color: colors.text }} className="text-3xl font-black mb-6">Settings</Text>

                <View className="bg-white/60 p-6 rounded-3xl border border-white mb-6">
                    <View className="flex-row items-center gap-4 mb-6">
                        <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center">
                            <MaterialIcons name="person" size={32} color={colors['--primary']} />
                        </View>
                        <View>
                            <Text className="text-xl font-black text-slate-900">{user?.name}</Text>
                            <Text className="text-slate-500 font-medium">{user?.email}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-red-50 p-4 rounded-2xl flex-row items-center justify-between"
                    >
                        <Text className="text-red-500 font-bold">Log Out</Text>
                        <MaterialIcons name="logout" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
