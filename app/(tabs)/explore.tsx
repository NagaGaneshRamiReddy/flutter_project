import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

export default function ExploreScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
            <ScrollView
                contentContainerStyle={{
                    paddingTop: insets.top + 20,
                    paddingHorizontal: 20
                }}
            >
                <Text style={{ color: colors.text }} className="text-3xl font-black mb-6">Explore</Text>

                <View className="bg-white/60 p-8 rounded-3xl border border-white items-center justify-center">
                    <MaterialIcons name="explore" size={48} color={colors['--primary']} />
                    <Text className="text-slate-400 font-bold mt-4">Discover new paths soon!</Text>
                </View>
            </ScrollView>
        </View>
    );
}
