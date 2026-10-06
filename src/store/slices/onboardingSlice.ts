import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';
import { InterestItem, SkillItem, UpdateAgeResponse, UserSkillsAndInterestsResponse } from '../../types/onboarding';

interface OnboardingState {
    loading: boolean;
    error: string | null;
    success: boolean;
    userSkills: SkillItem[];
    userInterests: InterestItem[];
}

const initialState: OnboardingState = {
    loading: false,
    error: null,
    success: false,
    userSkills: [],
    userInterests: [],
};

// Helper to extract error message
const extractErrorMessage = (err: any): string => {
    console.log('Server Response:', err.response?.data);
    if (err.response) {
        const data = err.response.data;
        if (data && typeof data === 'object') {
            if (data.err && typeof data.err === 'string') return data.err;
            if (data.message) return data.message;
            if (data.error) return data.error;
        }
        if (typeof data === 'string') return data;
    }
    return err.message || 'An unexpected error occurred';
};

export const updateAge = createAsyncThunk(
    'onboarding/updateAge',
    async (age: number, { rejectWithValue }) => {
        try {
            const response = await api.put<UpdateAgeResponse>('/onboarding/age', { age });
            // Return full response including ageGroup for navigation logic
            return response.data.body;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);


export const onboardKid = createAsyncThunk(
    'onboarding/kid',
    async (data: { learningStyle: string; weeklyLearningHours: number; avatar: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/onboarding/kids/profile', data);
            return response.data.body;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const updateSkillsAndInterests = createAsyncThunk(
    'onboarding/updateSkillsAndInterests',
    async (data: { skillIds: number[]; interestIds: number[] }, { rejectWithValue }) => {
        try {
            const response = await api.put<{ status: boolean; message: string; body: any }>('/onboarding/skills-interests', data);
            return response.data.body;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const getSkillsAndInterests = createAsyncThunk(
    'onboarding/getSkillsAndInterests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<UserSkillsAndInterestsResponse>('/onboarding/skills-interests');
            return response.data.body;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const onboardTeen = createAsyncThunk(
    'onboarding/teen',
    async (data: { learningStyle: string; weeklyLearningHours: number; courseId: number; branchId: number; skillIds: number[]; interestIds: number[] }, { rejectWithValue }) => {
        try {
            const response = await api.post('/onboarding/teens/interests', data);
            return response.data.body;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const onboardStudent = createAsyncThunk(
    'onboarding/student',
    async (data: { courseId: number; branchId: number; learningStyle: string; weeklyLearningHours: number }, { rejectWithValue }) => {
        try {
            const response = await api.post('/onboarding/students/details', data);
            return response.data.body;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const onboardProfessional = createAsyncThunk(
    'onboarding/professional',
    async (data: { courseId: number; branchId: number; learningStyle: string; weeklyLearningHours: number; currentRole: string; industry: string; yearsOfExperience: number; targetRole: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/onboarding/professionals/details', data);
            return response.data.body;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const onboardSenior = createAsyncThunk(
    'onboarding/senior',
    async (data: { learningStyle: string; weeklyLearningHours: number; courseId: number; branchId: number; accessibilitySettings: any }, { rejectWithValue }) => {
        try {
            const response = await api.post('/onboarding/seniors/details', data);
            return response.data.body;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        resetOnboardingState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state: OnboardingState) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        };
        const handleFulfilled = (state: OnboardingState) => {
            state.loading = false;
            state.success = true;
        };
        const handleRejected = (state: OnboardingState, action: any) => {
            state.loading = false;
            state.error = action.payload as string;
        };

        builder
            .addCase(updateAge.pending, handlePending)
            .addCase(updateAge.fulfilled, handleFulfilled)
            .addCase(updateAge.rejected, handleRejected)

            .addCase(onboardKid.pending, handlePending)
            .addCase(onboardKid.fulfilled, handleFulfilled)
            .addCase(onboardKid.rejected, handleRejected)

            .addCase(onboardTeen.pending, handlePending)
            .addCase(onboardTeen.fulfilled, handleFulfilled)
            .addCase(onboardTeen.rejected, handleRejected)

            .addCase(updateSkillsAndInterests.pending, handlePending)
            .addCase(updateSkillsAndInterests.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                if (action.payload) {
                    state.userSkills = action.payload.skils || action.payload.skills || [];
                    state.userInterests = action.payload.interests || [];
                }
            })
            .addCase(updateSkillsAndInterests.rejected, handleRejected)

            .addCase(getSkillsAndInterests.pending, handlePending)
            .addCase(getSkillsAndInterests.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.userSkills = action.payload.skils || action.payload.skills || [];
                    state.userInterests = action.payload.interests || [];
                }
            })
            .addCase(getSkillsAndInterests.rejected, handleRejected)

            .addCase(onboardStudent.pending, handlePending)
            .addCase(onboardStudent.fulfilled, handleFulfilled)
            .addCase(onboardStudent.rejected, handleRejected)

            .addCase(onboardProfessional.pending, handlePending)
            .addCase(onboardProfessional.fulfilled, handleFulfilled)
            .addCase(onboardProfessional.rejected, handleRejected)

            .addCase(onboardSenior.pending, handlePending)
            .addCase(onboardSenior.fulfilled, handleFulfilled)
            .addCase(onboardSenior.rejected, handleRejected);
    },
});

export const { resetOnboardingState } = onboardingSlice.actions;
export default onboardingSlice.reducer;
