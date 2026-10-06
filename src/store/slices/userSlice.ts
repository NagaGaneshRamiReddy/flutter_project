import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';
import { User } from '../../types/auth'; // Import User type

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
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

export const fetchAllUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/users');
        return response.data.body;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const createUser = createAsyncThunk('users/create', async (data: any, { rejectWithValue }) => {
    try {
        const response = await api.post('/users', data);
        return response.data.body;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const handlePending = (state: UserState) => { state.loading = true; state.error = null; };
        const handleRejected = (state: UserState, action: any) => { state.loading = false; state.error = action.payload as string; };

        // Fetch Users
        builder.addCase(fetchAllUsers.pending, handlePending)
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, handleRejected);

        // Create User
        builder.addCase(createUser.pending, handlePending)
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload); // Optimistic update or refetch
            })
            .addCase(createUser.rejected, handleRejected);
    },
});

export default userSlice.reducer;
