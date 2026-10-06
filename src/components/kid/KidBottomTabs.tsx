import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface KidBottomTabsProps {
    activeTab: 'home' | 'world' | 'play' | 'badges' | 'profile';
    onTabPress: (tab: any) => void;
}

const KidBottomTabs: React.FC<KidBottomTabsProps> = ({ activeTab, onTabPress }) => {
    const insets = useSafeAreaInsets();

    const TabItem = ({ name, icon, label, type = 'ion' }: any) => {
        const isActive = activeTab === name;
        const color = isActive ? '#3B82F6' : '#94A3B8';

        return (
            <TouchableOpacity
                onPress={() => onTabPress(name)}
                className="items-center justify-center flex-1"
            >
                {type === 'ion' ? (
                    <Ionicons name={icon} size={24} color={color} />
                ) : (
                    <MaterialIcons name={icon} size={24} color={color} />
                )}
                <Text className="text-[10px] font-[900] mt-1" style={{ color }}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View
            className="flex-row bg-white border-t border-slate-100 pt-2.5 items-center justify-around absolute bottom-0 left-0 right-0 shadow-lg"
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
            <TabItem name="home" icon="home" label="HOME" />
            <TabItem name="world" icon="map" label="WORLD" type="material" />

            <TouchableOpacity
                onPress={() => onTabPress('play')}
                className="w-[70px] h-[70px] rounded-full bg-slate-50 -mt-10 justify-center items-center shadow-lg shadow-blue-400/30"
            >
                <View className="w-[60px] h-[60px] rounded-full bg-blue-500 justify-center items-center">
                    <Ionicons name="play" size={32} color="white" style={{ marginLeft: 4 }} />
                </View>
            </TouchableOpacity>

            <TabItem name="badges" icon="emoji-events" label="BADGES" type="material" />
            <TabItem name="profile" icon="person" label="ME" />
        </View>
    );
};

export default KidBottomTabs;
