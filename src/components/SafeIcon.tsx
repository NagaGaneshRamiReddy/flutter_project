import {
    FontAwesome,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from '@expo/vector-icons';
import React from 'react';

type IconLibrary = 'MaterialCommunityIcons' | 'MaterialIcons' | 'Ionicons' | 'FontAwesome';

const FALLBACK_ICONS: Record<IconLibrary, string> = {
    MaterialCommunityIcons: 'help-circle',
    MaterialIcons: 'help',
    Ionicons: 'help-circle-outline',
    FontAwesome: 'question-circle',
};

function hasIcon(lib: IconLibrary, name: string): boolean {
    try {
        const map =
            lib === 'MaterialCommunityIcons' ? MaterialCommunityIcons.glyphMap
            : lib === 'MaterialIcons' ? MaterialIcons.glyphMap
            : lib === 'Ionicons' ? Ionicons.glyphMap
            : lib === 'FontAwesome' && FontAwesome.glyphMap ? FontAwesome.glyphMap
            : null;
        return !!map && name in map;
    } catch {
        return false;
    }
}

interface SafeIconProps {
    library: IconLibrary | string;
    name: string;
    size: number;
    color: string;
    style?: object;
}

/**
 * Renders an icon with fallback when the specified icon doesn't exist in the library.
 * Prevents "icon doesn't match" warnings in the console.
 */
export function SafeIcon({ library, name, size, color, style }: SafeIconProps) {
    const lib = (library as IconLibrary) || 'MaterialCommunityIcons';
    const fallback = FALLBACK_ICONS[lib] ?? 'help-circle';
    const safeName = name && hasIcon(lib, name) ? name : fallback;

    switch (lib) {
        case 'MaterialCommunityIcons':
            return <MaterialCommunityIcons name={safeName as any} size={size} color={color} style={style} />;
        case 'MaterialIcons':
            return <MaterialIcons name={safeName as any} size={size} color={color} style={style} />;
        case 'Ionicons':
            return <Ionicons name={safeName as any} size={size} color={color} style={style} />;
        case 'FontAwesome':
            return <FontAwesome name={safeName as any} size={size} color={color} style={style} />;
        default:
            return <MaterialCommunityIcons name={fallback as any} size={size} color={color} style={style} />;
    }
}
