import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

// 1. Login User (Simpan Token saat sukses)
export const LoginUser = createAsyncThunk("user/LoginUser", async(user, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/login', {
            email: user.email,
            password: user.password
        });
        
        // --- PERBAIKAN: Simpan Token ke LocalStorage ---
        if(response.data.accessToken){
            localStorage.setItem('token', response.data.accessToken);
        }
        
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

// 2. Register User
export const RegisterUser = createAsyncThunk("user/RegisterUser", async(user, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/register', {
            name: user.name,
            email: user.email,
            password: user.password,
            confPassword: user.confPassword,
            role: user.role
        });
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

// 3. Get Me (Kirim Token lewat Header)
export const getMe = createAsyncThunk("user/getMe", async(_, thunkAPI) => {
    try {
        // --- PERBAIKAN: Ambil Token & Masukkan ke Header ---
        const token = localStorage.getItem('token');
        
        // Jika token tidak ada, reject agar tidak lanjut request
        if(!token) {
            return thunkAPI.rejectWithValue("No token found");
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        
        const response = await axios.get('http://localhost:5000/me', config);
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        }
    }
});

// 4. Logout (Hapus Token)
export const LogOut = createAsyncThunk("user/LogOut", async() => {
    // Hapus token dari penyimpanan lokal
    localStorage.removeItem('token');
    
    await axios.delete('http://localhost:5000/logout');
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        // --- LOGIN ---
        builder.addCase(LoginUser.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(LoginUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload; 
        });
        builder.addCase(LoginUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        
        // --- REGISTER ---
        builder.addCase(RegisterUser.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(RegisterUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.message = "Register Berhasil! Silahkan Login."; 
        });
        builder.addCase(RegisterUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        // --- GET ME ---
        builder.addCase(getMe.pending, (state) =>{
            state.isLoading = true;
        });
        builder.addCase(getMe.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        });
        builder.addCase(getMe.rejected, (state, action) =>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;