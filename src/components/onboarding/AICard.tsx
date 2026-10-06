import { SafeIcon } from '../SafeIcon';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { PredictedItem } from '../../types/onboarding';

interface AICardProps {
    item: PredictedItem;
    isSelected: boolean;
    onSelect: (id: number) => void;
    icon?: string;
    iconLibrary?: string;
    showIcon?: boolean;
}

export const AICard = ({ item, isSelected, onSelect, icon, iconLibrary, showIcon = true }: AICardProps) => {
    const { colors } = useTheme();
    const isTop = item.isTopRecommended;
    const primaryColor = colors['--primary'];

    const renderIcon = () => {
        if (!showIcon) return null;
        const lib = (iconLibrary as any) || 'MaterialCommunityIcons';
        const name = (icon as any) || 'school';
        const iconColor = isSelected ? primaryColor : '#64748b';
        return <SafeIcon library={lib} name={name} size={26} color={iconColor} />;
    };

    return (
        <TouchableOpacity
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
            className="rounded-2xl overflow-hidden"
            style={{
                backgroundColor: isSelected ? `${primaryColor}15` : '#ffffff',
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? `${primaryColor}50` : '#e2e8f0',
                shadowColor: isSelected ? primaryColor : '#000',
                shadowOffset: { width: 0, height: isSelected ? 8 : 2 },
                shadowOpacity: isSelected ? 0.15 : 0.05,
                shadowRadius: isSelected ? 16 : 8,
            }}
        >
            <View className="p-5">
                {/* Header Section - Icon, Title, and Match Badge */}
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-1 flex-row items-center gap-3.5">
                        {showIcon && (
                            <View
                                className="w-14 h-14 rounded-2xl items-center justify-center"
                                style={{
                                    backgroundColor: isSelected
                                        ? `${primaryColor}20`
                                        : '#f8fafc',
                                    borderWidth: isSelected ? 1.5 : 0,
                                    borderColor: isSelected ? `${primaryColor}30` : 'transparent',
                                }}
                            >
                                {renderIcon()}
                            </View>
                        )}
                        <View className="flex-1">
                            <Text
                                className="text-base font-semibold"
                                style={{
                                    color: isSelected ? '#0f172a' : '#1e293b',
                                    letterSpacing: -0.3,
                                }}
                                numberOfLines={2}
                            >
                                {item.name}
                            </Text>
                        </View>
                    </View>

                    {/* Match percentage badge - beside title */}
                    <View
                        className="px-3 py-1.5 rounded-full ml-2"
                        style={{
                            backgroundColor: isSelected
                                ? `${primaryColor}25`
                                : `${primaryColor}12`,
                            borderWidth: 1,
                            borderColor: isSelected
                                ? `${primaryColor}40`
                                : `${primaryColor}20`,
                        }}
                    >
                        <Text
                            className="font-bold text-xs"
                            style={{
                                color: primaryColor,
                            }}
                        >
                            {item.matchPercentage}%
                        </Text>
                    </View>
                </View>

                {/* Reasoning text */}
                <Text
                    className="text-sm leading-5 mb-4"
                    style={{
                        color: '#64748b',
                        lineHeight: 20,
                    }}
                >
                    {item.reasoning}
                </Text>

                {/* Top Recommended badge */}
                {isTop && (
                    <View
                        className="flex-row items-center gap-2 px-3.5 py-2 rounded-full self-start"
                        style={{
                            backgroundColor: `${primaryColor}18`,
                            borderWidth: 1.5,
                            borderColor: `${primaryColor}45`,
                        }}
                    >
                        <View
                            className="w-5 h-5 rounded-full items-center justify-center"
                            style={{
                                backgroundColor: primaryColor,
                            }}
                        >
                            <SafeIcon
                                library="MaterialCommunityIcons"
                                name="check"
                                size={14}
                                color="#ffffff"
                            />
                        </View>
                        <Text
                            className="font-semibold text-xs"
                            style={{
                                color: primaryColor,
                                letterSpacing: 0.5,
                            }}
                        >
                            Top Pick
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};