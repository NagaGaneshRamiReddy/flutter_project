export interface UserPreferences {
    id: number;
    userId: number;
    interestIds: number[];
    skillIds: number[];
    courseId: number | null;
    branchId: number | null;
    currentRole: string | null;
    targetRole: string | null;
    industry: string | null;
    yearsOfExperience: number | null;
    weeklyLearningHours: number | null;
    learningStyle: string | null;
    groupSpecificData: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    group: string;
    role: string;
    isOnboarded: boolean;
    createdAt: string;
    updatedAt: string;
    preferences?: UserPreferences; // Made optional as it might be nested separately in some responses
    hero?: string;
}

export interface OnboardingStatus {
    user: User;
    isOnboarded: boolean;
    age: number;
    group: string;
    preferences: UserPreferences;
}

export interface LoginResponse {
    status: boolean;
    message: string;
    body: {
        token: string;
        user: User;
    };
}

export interface AuthResponse<T = any> {
    status: boolean;
    message: string;
    body: T;
}
