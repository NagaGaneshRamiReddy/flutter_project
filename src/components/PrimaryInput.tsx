import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleProp, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface PrimaryInputProps extends Omit<TextInputProps, 'style'> {
    iconName?: keyof typeof MaterialIcons.glyphMap;
    isPassword?: boolean;
    className?: string; // Add className to props definition to avoid TS error with NativeWind
    style?: StyleProp<ViewStyle>;
    errorMessage?: string;
}

export const PrimaryInput = ({ iconName, isPassword, className, style, errorMessage, ...props }: PrimaryInputProps) => {
    const { colors } = useTheme();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View className="w-full">
            <View
                style={[{
                    shadowColor: colors['--accent'], // Using accent color for shadow to match button vibe but subtler if needed
                    borderColor: errorMessage ? '#ef4444' : 'transparent',
                    borderWidth: errorMessage ? 1 : 0,
                }, style]}
                className={`w-full flex-row items-center h-18 px-4 rounded-[16px] shadow-md shadow-primary/10 bg-white ${className || ''}`}
            >
                {iconName && (
                    <View className="mr-3">
                        <MaterialIcons
                            name={iconName}
                            size={22}
                            color={errorMessage ? "#ef4444" : "#9ca3af"} // slate-400 or red-500
                        />
                    </View>
                )}
                <TextInput
                    placeholderTextColor={colors['text-secondary'] || "#9ca3af"}
                    style={{ flex: 1, fontSize: 16, color: colors.text || '#0f172a' }} // Using theme text color
                    secureTextEntry={isPassword && !isPasswordVisible}
                    {...props}
                />
                {
                    isPassword && (
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            className="p-2"
                        >
                            <MaterialIcons
                                name={isPasswordVisible ? "visibility" : "visibility-off"}
                                size={22}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>
                    )
                }
            </View >
            {errorMessage && (
                <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">
                    {errorMessage}
                </Text>
            )}
        </View>
    );
};
