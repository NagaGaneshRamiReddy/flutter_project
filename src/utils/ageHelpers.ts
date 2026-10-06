/**
 * Global Age Logic Helper
 * Pure, deterministic, worklet-safe.
 */

export type AgeGroup = 'kid' | 'teen' | 'student' | 'professional' | 'senior';

export interface AgeMeta {
    group: AgeGroup;
    groupIndex: number; // Stable ordering 0-4
    iconName: string; // MaterialIcons name
    color: string;
    label: string;
}

const GROUPS: AgeMeta[] = [
    { group: 'kid', groupIndex: 0, iconName: 'help-circle-outline', color: '#94a3b8', label: 'SELECT' },
    { group: 'kid', groupIndex: 1, iconName: 'seed', color: '#22c55e', label: 'KID' },
    { group: 'teen', groupIndex: 2, iconName: 'sprout', color: '#f59e0b', label: 'TEEN' },
    { group: 'student', groupIndex: 3, iconName: 'school-outline', color: '#3b82f6', label: 'STUDENT' },
    { group: 'professional', groupIndex: 4, iconName: 'briefcase-variant-outline', color: '#6366f1', label: 'PROFESSIONAL' },
    { group: 'senior', groupIndex: 5, iconName: 'glasses', color: '#a855f7', label: 'SENIOR' },
];

export const getAgeMeta = (age: number): AgeMeta => {
    'worklet';
    if (age === 0) return GROUPS[0]; // Unselected state
    if (age <= 12) return GROUPS[1];
    if (age <= 18) return GROUPS[2];
    if (age <= 25) return GROUPS[3];
    if (age <= 60) return GROUPS[4];
    return GROUPS[5];
};

export const AGE_GROUPS = GROUPS;

export const ITEM_WIDTH = 100;
