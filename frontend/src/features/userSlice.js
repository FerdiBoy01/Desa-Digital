import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";

// Setup Adapter (Karena pakai UUID)
const usersAdapter = createEntityAdapter({
    selectId: (user) => user.uuid
});

const initialState = usersAdapter.getInitialState({
    isLoading: false,
    isSuccess: false, // Tambahan state isSuccess untuk trigger navigasi
    isError: false,
    message: ""
});

// --- API ACTIONS ---

// 1. GET ALL USERS
export const getUsers = createAsyncThunk("users/getUsers", async(_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if(error.response) return thunkAPI.rejectWithValue(error.response.data.msg);
        return thunkAPI.rejectWithValue("Gagal mengambil data users");
    }
});

// 2. GET USER BY ID
export const getUserById = createAsyncThunk("users/getUserById", async(id, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if(error.response) return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

// 3. CREATE USER
export const createUser = createAsyncThunk("users/createUser", async(user, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/users', user, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data; 
    } catch (error) {
        if(error.response) return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

// 4. UPDATE USER (PENTING: Perhatikan return value)
export const updateUser = createAsyncThunk("users/updateUser", async(user, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        // Backend kita di Users.js menggunakan method PATCH (sesuaikan dengan route backend)
        await axios.patch(`http://localhost:5000/users/${user.uuid}`, {
            name: user.name,
            email: user.email,
            password: user.password,
            confPassword: user.confPassword,
            role: user.role
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Return data user yang dikirim agar Redux state lokal terupdate tanpa reload
        return user; 
    } catch (error) {
        if(error.response) return thunkAPI.rejectWithValue(error.response.data.msg);
        return thunkAPI.rejectWithValue("Gagal mengupdate user");
    }
});

// 5. DELETE USER
export const deleteUser = createAsyncThunk("users/deleteUser", async(id, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return id; 
    } catch (error) {
        if(error.response) return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        resetState: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        // --- GET USERS ---
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            usersAdapter.setAll(state, action.payload);
        });

        // --- CREATE USER ---
        builder.addCase(createUser.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
        });

        // --- UPDATE USER ---
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = true;
            // Update data di state lokal secara instan
            usersAdapter.upsertOne(state, action.payload); 
        });

        // --- DELETE USER ---
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            usersAdapter.removeOne(state, action.payload);
        });
        
        // --- HANDLER GLOBAL: PENDING (LOADING) ---
        // Menangani loading untuk SEMUA action di atas
        builder.addMatcher(
            (action) => action.type.endsWith('/pending'),
            (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            }
        );

        // --- HANDLER GLOBAL: REJECTED (ERROR) ---
        // Menangani error untuk SEMUA action di atas (termasuk Update)
        // INI YANG MENCEGAH INFINITE LOADING
        builder.addMatcher(
            (action) => action.type.endsWith('/rejected'),
            (state, action) => {
                state.isLoading = false; // Matikan loading
                state.isError = true;
                state.message = action.payload; // Simpan pesan error dari backend
            }
        );
    }
});

export const { resetState } = userSlice.actions;
export const userSelectors = usersAdapter.getSelectors(state => state.users);
export default userSlice.reducer;