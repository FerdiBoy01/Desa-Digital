import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";

// Setup Adapter (Karena pakai UUID)
const usersAdapter = createEntityAdapter({
    selectId: (user) => user.uuid
});

const initialState = usersAdapter.getInitialState({
    isLoading: false,
    isError: false,
    message: ""
});

// --- API ACTIONS ---

// 1. GET ALL
export const getUsers = createAsyncThunk("users/getUsers", async(_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if(error.response) return thunkAPI.rejectWithValue(error.response.data.msg);
        return thunkAPI.rejectWithValue("Terjadi kesalahan jaringan");
    }
});

// 2. GET BY ID
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

// 3. CREATE
export const createUser = createAsyncThunk("users/createUser", async(user, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        // PERBAIKAN: Ambil response dari backend agar dapat UUID baru
        const response = await axios.post('http://localhost:5000/users', user, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Biasanya backend mengembalikan msg, tapi idealnya mengembalikan data user baru
        // Jika backend cuma return msg, kita return user input (tapi tanpa UUID valid)
        // Asumsi: Backend kamu return { msg: "..." } maka kita reload manual nanti.
        return response.data; 
    } catch (error) {
        if(error.response) return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

// 4. UPDATE
export const updateUser = createAsyncThunk("users/updateUser", async(user, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:5000/users/${user.uuid}`, user, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return user; // Return data yang diedit untuk update state lokal
    } catch (error) {
        if(error.response) return thunkAPI.rejectWithValue(error.response.data.msg);
    }
});

// 5. DELETE
export const deleteUser = createAsyncThunk("users/deleteUser", async(id, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return id; // Return ID untuk dihapus dari state lokal
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
            state.isError = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        // --- GET USERS ---
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            // setAll: Mengganti seluruh data dengan data baru dari server
            usersAdapter.setAll(state, action.payload);
        });

        // --- CREATE USER ---
        builder.addCase(createUser.fulfilled, (state) => {
            state.isLoading = false;
            state.isSuccess = true;
            // Kita tidak melakukan usersAdapter.addOne disini karena biasanya
            // setelah create kita redirect ke halaman list dan reload data (getUsers)
        });

        // --- UPDATE USER ---
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            // updateOne: Memperbarui data di state lokal agar UI berubah instan
            usersAdapter.upsertOne(state, action.payload); 
        });

        // --- DELETE USER ---
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            // removeOne: Menghapus dari state lokal
            usersAdapter.removeOne(state, action.payload);
        });
        
        // --- HANDLER GLOBAL UNTUK PENDING (LOADING) ---
        // Ini akan menangkap SEMUA action users/.../pending
        builder.addMatcher(
            (action) => action.type.endsWith('/pending'),
            (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            }
        );

        // --- HANDLER GLOBAL UNTUK REJECTED (ERROR) ---
        // Ini akan menangkap SEMUA action users/.../rejected
        builder.addMatcher(
            (action) => action.type.endsWith('/rejected'),
            (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            }
        );
    }
});

export const { resetState } = userSlice.actions;
export const userSelectors = usersAdapter.getSelectors(state => state.users);
export default userSlice.reducer;