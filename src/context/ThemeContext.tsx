import React, { createContext, ReactNode, useContext, useState } from 'react';
import { View } from 'react-native';
import { ThemeColors, THEMES, ThemeType } from '../constants/themes';
import { AgeGroup } from '../utils/ageHelpers';

interface ThemeContextType {
    activeTheme: ThemeType;
    colors: ThemeColors;
    setTheme: (theme: ThemeType | AgeGroup) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [activeTheme, setActiveTheme] = useState<ThemeType>('student');

    const themeColors = THEMES[activeTheme];

    return (
        <ThemeContext.Provider value={{ activeTheme, colors: themeColors, setTheme: setActiveTheme }}>
            <View style={themeColors as any} className="flex-1">
                {children}
            </View>
        </ThemeContext.Provider>
    );
};
