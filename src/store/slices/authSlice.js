import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi } from '../../services/authService'; // Will rename api to services

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const data = await loginApi(username, password);
            console.log('AuthSlice Login Data:', data); // DEBUG

            if (!data || !data.token) {
                // Try alternative structure commonly used
                if (data?.data?.token) {
                    data.token = data.data.token;
                    data.user = data.data.user;
                } else {
                    throw new Error('Invalid response structure: Token missing');
                }
            }

            await AsyncStorage.setItem('jwt_token', data.token);
            if (data.user) {
                await AsyncStorage.setItem('user_info', JSON.stringify(data.user));
            }
            return data;
        } catch (error) {
            console.error('AuthSlice Login Error:', error);
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await AsyncStorage.removeItem('jwt_token');
            await AsyncStorage.removeItem('user_info');
            return true;
        } catch (error) {
            return rejectWithValue('Logout failed');
        }
    }
);

export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('jwt_token');
            const userInfo = await AsyncStorage.getItem('user_info');
            if (token) {
                return { token, user: userInfo ? JSON.parse(userInfo) : null };
            }
            return rejectWithValue('No token found');
        } catch (error) {
            return rejectWithValue('Failed to load user');
        }
    }
);

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user; // Ensure backend returns 'user'
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Logout
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });

        // Load User
        builder
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(loadUser.rejected, (state) => {
                state.isAuthenticated = false;
                state.token = null;
                state.user = null;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
