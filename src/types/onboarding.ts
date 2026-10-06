export interface InterestItem {
    id: number;
    name: string;
    icon: string;
    iconLibrary: "MaterialCommunityIcons" | "MaterialIcons" | "Ionicons" | "FontAwesome";
}

export interface SkillItem {
    id: number;
    name: string;
    icon: string;
    iconLibrary: "MaterialCommunityIcons" | "MaterialIcons" | "Ionicons" | "FontAwesome";
}

export interface InterestsResponse {
    status: boolean;
    message: string;
    body: InterestItem[];
}

export interface SkillsResponse {
    status: boolean;
    message: string;
    body: SkillItem[];
}

export interface UpdateAgeResponse {
    status: boolean;
    message: string;
    body: {
        age: number;
        group: 'KIDS' | 'TEENS' | 'COLLEGE_STUDENTS' | 'PROFESSIONALS' | 'SENIORS';
    };
}

export interface PredictedItem {
    id: number;
    name: string;
    description?: string;
    matchPercentage: number;
    reasoning: string;
    isTopRecommended?: boolean;
}

export interface PredictedCourse extends PredictedItem {
    category?: string;
    icon?: string;
    iconLibrary?: string;
}

export interface PredictedBranch extends PredictedItem {
    // Branches usually inherit icon from course, but may have their own
}

export interface UserSkillsAndInterestsResponse {
    status: boolean;
    message: string;
    body: {
        skils?: SkillItem[]; // Backend typo: skils
        skills?: SkillItem[];
        interests: InterestItem[];
    };
}
