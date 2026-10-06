import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

interface ClipState {
    info: any | null;
    comparisonResult: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: ClipState = {
    info: null,
    comparisonResult: null,
    loading: false,
    error: null,
};

const extractErrorMessage = (err: any): string => {
    console.log('Server Response:', err.response?.data);
    if (err.response) {
        const data = err.response.data;
        if (data && typeof data === 'object') {
            if (data.message) return data.message;
            if (data.error) return data.error;
        }
        if (typeof data === 'string') return data;
    }
    return err.message || 'An unexpected error occurred';
};

export const fetchClipInfo = createAsyncThunk('clip/fetchInfo', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/clip/info');
        return response.data.body;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const compareImages = createAsyncThunk('clip/compare', async (formData: FormData, { rejectWithValue }) => {
    try {
        const response = await api.post('/clip/compare', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.body;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

const clipSlice = createSlice({
    name: 'clip',
    initialState,
    reducers: {
        clearComparison: (state) => { state.comparisonResult = null; }
    },
    extraReducers: (builder) => {
        const handlePending = (state: ClipState) => { state.loading = true; state.error = null; };
        const handleRejected = (state: ClipState, action: any) => { state.loading = false; state.error = action.payload as string; };

        // Info
        builder.addCase(fetchClipInfo.pending, handlePending)
            .addCase(fetchClipInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.info = action.payload;
            })
            .addCase(fetchClipInfo.rejected, handleRejected);

        // Compare
        builder.addCase(compareImages.pending, handlePending)
            .addCase(compareImages.fulfilled, (state, action) => {
                state.loading = false;
                state.comparisonResult = action.payload;
            })
            .addCase(compareImages.rejected, handleRejected);
    },
});

export const { clearComparison } = clipSlice.actions;
export default clipSlice.reducer;
