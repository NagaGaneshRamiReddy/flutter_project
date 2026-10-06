import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface CustomToastProps {
    id: string;
    status?: 'success' | 'error' | 'info' | 'warning';
    title: string;
    description?: string;
    variant?: 'solid' | 'outline' | 'accent';
    style?: ViewStyle;
    onClose?: () => void;
}

export const CustomToast = ({ id, status = 'info', title, description, variant = 'solid', style, onClose }: CustomToastProps) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const getIconName = () => {
        switch (status) {
            case 'success': return 'check-circle';
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'info': default: return 'info';
        }
    };

    const getStatusConfig = () => {
        switch (status) {
            case 'success':
                return {
                    icon: '#22c55e',
                    accentColor: '#22c55e',
                    textColor: '#14532d',
                    borderColor: 'border-green-200/50',
                };
            case 'error':
                return {
                    icon: '#ef4444',
                    accentColor: '#ef4444',
                    textColor: '#b91c1c',
                    borderColor: 'border-red-200/50',
                };
            case 'warning':
                return {
                    icon: '#f59e0b',
                    accentColor: '#f59e0b',
                    textColor: '#92400e',
                    borderColor: 'border-yellow-200/50',
                };
            case 'info':
            default:
                return {
                    icon: colors['--primary'],
                    accentColor: colors['--primary'],
                    textColor: colors['--primary'],
                    borderColor: 'border-white/40',
                };
        }
    };

    const config = getStatusConfig();

    return (
        <View
            style={[StyleSheet.absoluteFillObject, { zIndex: 9999 }]}
            pointerEvents="box-none"
        >
            <Animated.View
                entering={FadeInUp.springify().damping(15)}
                exiting={FadeOutUp}
                style={[{
                    marginHorizontal: 24,
                    marginTop: insets.top + 12,
                    borderRadius: 24,
                    overflow: 'hidden',
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.1,
                    shadowRadius: 20
                }, style]}
            >
                <BlurView
                    intensity={80}
                    tint="light"
                    className={`p-5 flex-row items-center border ${config.borderColor}`}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                >

                    <View
                        className="mr-2 mt-1 bg-white p-2 rounded-2xl border border-black/10"
                    >
                        <MaterialIcons name={getIconName()} size={24} color={config.icon} />
                    </View>

                    <View className="flex-1">
                        <Text
                            className="font-bold text-lg mb-0.5"
                            style={{
                                color: status === 'error' ? config.textColor : '#0f172a',
                            }}
                        >
                            {title}
                        </Text>
                        {description && (
                            <Text
                                className="text-sm font-medium leading-5"
                                style={{
                                    color: status === 'error' ? config.textColor : '#64748b',
                                }}
                            >
                                {description}
                            </Text>
                        )}
                    </View>

                    {/* Close button */}
                    {onClose && (
                        <TouchableOpacity
                            onPress={onClose}
                            className="ml-2 p-2 rounded-full"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                            activeOpacity={0.6}
                        >
                            <MaterialIcons name="close" size={20} color="#64748b" />
                        </TouchableOpacity>
                    )}
                </BlurView>
            </Animated.View>
        </View>
    );
};