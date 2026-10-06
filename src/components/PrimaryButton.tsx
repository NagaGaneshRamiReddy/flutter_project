import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;
    iconName?: keyof typeof MaterialIcons.glyphMap;
    className?: string;
    textStyle?: any;
    textClassName?: string;
}

export const PrimaryButton = ({ title, iconName, className, textStyle, textClassName, ...props }: PrimaryButtonProps) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={{
                backgroundColor: colors['--primary'],
                shadowColor: colors['--accent'],
                elevation: 10,
                borderRadius: 16,
            }}
            className={`w-full py-4 h-18 rounded-[16px] items-center flex-row justify-center gap-3 shadow-xl shadow-primary active:scale-[0.98] transition-transform ${className || ''}`}
            {...props}
        >
            <Text
                className={`text-white font-bold text-xl ${textClassName || ''}`}
                style={textStyle}
            >
                {title}
            </Text>
            {iconName && (
                <MaterialIcons
                    name={iconName}
                    size={22}
                    color="white"
                />
            )}
        </TouchableOpacity>
    );
};
