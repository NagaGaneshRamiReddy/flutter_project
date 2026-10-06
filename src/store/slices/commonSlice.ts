import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';
import { InterestItem, PredictedBranch, PredictedCourse, SkillItem } from '../../types/onboarding';

interface CommonState {
    interests: InterestItem[];
    skills: SkillItem[];
    selectedInterests: number[];
    selectedSkills: number[];
    courses: any[];
    branches: any[]; // Branches for a specific course
    predictions: {
        courses: PredictedCourse[];
        branches: PredictedBranch[];
    };
    loading: boolean;
    error: string | null;
}

const initialState: CommonState = {
    interests: [],
    skills: [],
    selectedInterests: [],
    selectedSkills: [],
    courses: [],
    branches: [],
    predictions: {
        courses: [],
        branches: [],
    },
    loading: false,
    error: null,
};

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

export const fetchInterests = createAsyncThunk('common/fetchInterests', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/common/interests');
        return response.data.body;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const fetchSkills = createAsyncThunk('common/fetchSkills', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/common/skills');
        return response.data.body;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const fetchCourses = createAsyncThunk('common/fetchCourses', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/common/courses');
        return response.data.body;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const fetchBranches = createAsyncThunk('common/fetchBranches', async (courseId: number, { rejectWithValue }) => {
    try {
        const response = await api.get(`/common/courses/${courseId}/branches`);
        return response.data.body;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const predictCourse = createAsyncThunk('common/predictCourse', async (data: { interestIds: number[]; skillIds: number[] }, { rejectWithValue }) => {
    try {
        const response = await api.post('/common/predict/course', data);
        return response.data.body;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const predictBranch = createAsyncThunk('common/predictBranch', async (data: { interestIds: number[]; skillIds: number[]; courseId: number }, { rejectWithValue }) => {
    try {
        const response = await api.post('/common/predict/branch', data);
        return response.data.body;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        toggleInterest: (state, action) => {
            const id = action.payload;
            const exists = state.selectedInterests.includes(id);
            state.selectedInterests = exists
                ? state.selectedInterests.filter((x) => x !== id)
                : [...state.selectedInterests, id];
        },
        toggleSkill: (state, action) => {
            const id = action.payload;
            const exists = state.selectedSkills.includes(id);
            state.selectedSkills = exists
                ? state.selectedSkills.filter((x) => x !== id)
                : [...state.selectedSkills, id];
        },
    },
    extraReducers: (builder) => {
        const handlePending = (state: CommonState) => { state.loading = true; state.error = null; };
        const handleRejected = (state: CommonState, action: any) => { state.loading = false; state.error = action.payload as string; };

        // Interests
        builder.addCase(fetchInterests.pending, handlePending)
            .addCase(fetchInterests.fulfilled, (state, action) => {
                state.loading = false;
                state.interests = action.payload;
            })
            .addCase(fetchInterests.rejected, handleRejected);

        // Skills
        builder.addCase(fetchSkills.pending, handlePending)
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.loading = false;
                state.skills = action.payload;
            })
            .addCase(fetchSkills.rejected, handleRejected);

        // Courses
        builder.addCase(fetchCourses.pending, handlePending)
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, handleRejected);

        // Branches
        builder.addCase(fetchBranches.pending, handlePending)
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.loading = false;
                state.branches = action.payload;
            })
            .addCase(fetchBranches.rejected, handleRejected);

        // Predict Course
        builder.addCase(predictCourse.pending, handlePending)
            .addCase(predictCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.predictions.courses = action.payload;
            })
            .addCase(predictCourse.rejected, handleRejected);

        // Predict Branch
        builder.addCase(predictBranch.pending, handlePending)
            .addCase(predictBranch.fulfilled, (state, action) => {
                state.loading = false;
                state.predictions.branches = action.payload;
            })
            .addCase(predictBranch.rejected, handleRejected);
    },
});

export const { toggleInterest, toggleSkill } = commonSlice.actions;
export default commonSlice.reducer;
