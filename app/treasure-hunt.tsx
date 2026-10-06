import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function TreasureHuntScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Mock Data representing nodes on a map
    const nodes = [
        { id: '1', title: 'Start Here', type: 'start', status: 'completed', x: 50, y: 50 },
        { id: '2', title: 'Math Puzzle', type: 'puzzle', status: 'completed', x: 150, y: 120 },
        { id: '3', title: 'Logic Gate', type: 'challenge', status: 'current', x: 250, y: 80 },
        { id: '4', title: 'Science Lab', type: 'puzzle', status: 'locked', x: 300, y: 180 },
        { id: '5', title: 'The Treasure', type: 'treasure', status: 'locked', x: 200, y: 300 },
    ];

    const handleNodePress = (node: any) => {
        if (node.status === 'locked') return;

        if (node.type === 'puzzle' || node.type === 'challenge') {
            router.push({ pathname: '/quiz', params: { topic: node.title, mode: 'kid' } });
        }
    };

    return (
        <View className="flex-1 bg-blue-50">
            <View className="absolute top-0 left-0 right-0 h-full opacity-20 pointer-events-none">
                {/* Background Pattern or Image could go here */}
                <View className="w-full h-full bg-blue-100" />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View style={{ paddingTop: insets.top + 20 }} className="px-6 mb-10">
                    <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm mb-4">
                        <Ionicons name="arrow-back" size={24} color="#3b82f6" />
                    </TouchableOpacity>
                    <Text className="text-4xl font-black text-blue-900 tracking-tight">Treasure Hunt</Text>
                    <Text className="text-blue-600 font-bold">Find the hidden treasure!</Text>
                </View>

                {/* Map Area */}
                <View className="items-center px-4">
                    {/* Path Lines (Simplified visualization) */}
                    <View className="absolute w-1 bg-blue-200 h-[300px] top-10 left-1/2 -ml-0.5 border-dashed border-l-2 border-blue-300" />

                    {nodes.map((node, index) => (
                        <MotiView
                            key={node.id}
                            from={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 200, type: 'spring' }}
                            className={`mb-12 w-full flex-row items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                        >
                            <TouchableOpacity
                                onPress={() => handleNodePress(node)}
                                activeOpacity={0.9}
                                className={`shadow-lg items-center justify-center ${node.status === 'locked' ? 'opacity-70' : ''}`}
                                style={{ width: width * 0.4 }}
                            >
                                <View className={`w-20 h-20 rounded-3xl items-center justify-center border-4 mb-2 ${node.status === 'completed' ? 'bg-green-500 border-green-200' :
                                        node.status === 'current' ? 'bg-yellow-400 border-yellow-200' :
                                            'bg-slate-200 border-slate-300'
                                    }`}>
                                    {node.type === 'start' && <MaterialIcons name="flag" size={40} color="white" />}
                                    {node.type === 'puzzle' && <MaterialIcons name="extension" size={40} color="white" />}
                                    {node.type === 'challenge' && <MaterialIcons name="psychology" size={40} color="white" />}
                                    {node.type === 'treasure' && <MaterialIcons name="emoji-events" size={40} color="white" />}

                                    {node.status === 'locked' && (
                                        <View className="absolute bg-slate-500/50 w-full h-full rounded-2xl items-center justify-center">
                                            <MaterialIcons name="lock" size={32} color="white" />
                                        </View>
                                    )}
                                </View>

                                <View className="bg-white px-3 py-1 rounded-full shadow-sm">
                                    <Text className="font-bold text-xs text-slate-700">{node.title}</Text>
                                </View>
                            </TouchableOpacity>
                        </MotiView>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
