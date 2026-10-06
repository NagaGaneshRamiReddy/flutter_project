export type ThemeType = 'kid' | 'teen' | 'student' | 'professional' | 'senior';

export interface ThemeColors {
    '--primary': string;
    '--primary-foreground': string;
    '--secondary': string;
    '--secondary-foreground': string;
    '--accent': string;
    '--accent-foreground': string;
    '--background': string;
    '--foreground': string;
    '--muted': string;
    '--muted-foreground': string;
    text: string;           // Added for primary text
    'text-secondary': string; // Added for secondary text
}

export const THEMES: Record<ThemeType, ThemeColors> = {
    kid: {
        '--primary': '#22c55e', // Green-500
        '--primary-foreground': '#ffffff',
        '--secondary': '#f0fdf4', // Green-50
        '--secondary-foreground': '#14532d', // Green-900
        '--accent': '#4ade80', // Green-400
        '--accent-foreground': '#052e16',
        '--background': '#ffffff',
        '--foreground': '#052e16',
        '--muted': '#f0fdf4',
        '--muted-foreground': '#166534',
        text: '#0f172a', // slate-900
        'text-secondary': '#9ca3af', // slate-400
    },
    teen: {
        '--primary': '#f97316', // Orange-500
        '--primary-foreground': '#ffffff',
        '--secondary': '#fff7ed', // Orange-50
        '--secondary-foreground': '#7c2d12', // Orange-900
        '--accent': '#fb923c', // Orange-400
        '--accent-foreground': '#431407',
        '--background': '#ffffff',
        '--foreground': '#431407',
        '--muted': '#fff7ed',
        '--muted-foreground': '#9a3412',
        text: '#0f172a',
        'text-secondary': '#9ca3af',
    },
    student: {
        '--primary': '#3b82f6', // Blue-500
        '--primary-foreground': '#ffffff',
        '--secondary': '#eff6ff', // Blue-50
        '--secondary-foreground': '#1e3a8a', // Blue-900
        '--accent': '#60a5fa', // Blue-400
        '--accent-foreground': '#172554',
        '--background': '#ffffff',
        '--foreground': '#172554',
        '--muted': '#eff6ff',
        '--muted-foreground': '#1e40af',
        text: '#0f172a',
        'text-secondary': '#9ca3af',
    },
    professional: {
        '--primary': '#6366f1', // Indigo-500
        '--primary-foreground': '#ffffff',
        '--secondary': '#eef2ff', // Indigo-50
        '--secondary-foreground': '#312e81', // Indigo-900
        '--accent': '#818cf8', // Indigo-400
        '--accent-foreground': '#312e81',
        '--background': '#ffffff',
        '--foreground': '#312e81',
        '--muted': '#eef2ff',
        '--muted-foreground': '#3730a3',
        text: '#0f172a',
        'text-secondary': '#9ca3af',
    },
    senior: {
        '--primary': '#d946ef', // Fuchsia-500 (Close to purple/magenta)
        '--primary-foreground': '#ffffff',
        '--secondary': '#fdf4ff', // Fuchsia-50
        '--secondary-foreground': '#701a75', // Fuchsia-900
        '--accent': '#e879f9', // Fuchsia-400
        '--accent-foreground': '#4a044e',
        '--background': '#ffffff',
        '--foreground': '#4a044e',
        '--muted': '#fdf4ff',
        '--muted-foreground': '#86198f',
        text: '#0f172a',
        'text-secondary': '#9ca3af',
    },
};

/**
 * Maps backend group names to theme types
 */
export const mapGroupToTheme = (group: string | null | undefined): ThemeType => {
    switch (group?.toUpperCase()) {
        case 'KIDS':
            return 'kid';
        case 'TEENS':
            return 'teen';
        case 'COLLEGE_STUDENTS':
            return 'student';
        case 'PROFESSIONALS':
            return 'professional';
        case 'SENIORS':
            return 'senior';
        default:
            return 'student'; // Default theme
    }
};
