import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    biodata: null,      
    biodataList: [], 
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
};

// 1. Ambil Data Biodata Sendiri (GET - User)
export const getMyBiodata = createAsyncThunk("biodata/getMyBiodata", async(_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/biodata', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if(error.response){
            if (error.response.status === 404) return null; 
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
});

// 2. Simpan / Update Biodata (POST - User)
export const updateBiodata = createAsyncThunk("biodata/updateBiodata", async(data, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/biodata', data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
});

// 3. Ambil Semua Data (GET - Admin)
export const getAllBiodata = createAsyncThunk("biodata/getAllBiodata", async(_, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/biodata/all', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
});

// 4. Ambil Detail Biodata by ID (GET - Admin & Surveyor)
export const getBiodataById = createAsyncThunk("biodata/getBiodataById", async(uuid, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/biodata/${uuid}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
});

// 5. Verifikasi Biodata (PATCH - Admin)
export const verifyUserBiodata = createAsyncThunk("biodata/verifyUserBiodata", async({uuid, status, catatan}, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`http://localhost:5000/biodata/verify/${uuid}`, { status, catatan }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
});

// 6. Submit Data Survey (PATCH - Surveyor) --- [BARU] ---
export const submitSurveyData = createAsyncThunk("biodata/submitSurveyData", async({uuid, data}, thunkAPI) => {
    try {
        const token = localStorage.getItem('token');
        // Endpoint ini harus sesuai dengan route backend yang dibuat
        const response = await axios.patch(`http://localhost:5000/biodata/survey/${uuid}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        if(error.response){
            return thunkAPI.rejectWithValue(error.response.data.msg);
        }
    }
});

const biodataSlice = createSlice({
    name: "biodata",
    initialState,
    reducers: {
        resetBiodataState: (state) => {
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        // GET MY BIODATA
        builder.addCase(getMyBiodata.pending, (state) => { state.isLoading = true; });
        builder.addCase(getMyBiodata.fulfilled, (state, action) => {
            state.isLoading = false;
            state.biodata = action.payload; 
        });
        builder.addCase(getMyBiodata.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // UPDATE BIODATA
        builder.addCase(updateBiodata.pending, (state) => { state.isLoading = true; });
        builder.addCase(updateBiodata.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.msg;
        });
        builder.addCase(updateBiodata.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // GET ALL BIODATA
        builder.addCase(getAllBiodata.pending, (state) => { state.isLoading = true; });
        builder.addCase(getAllBiodata.fulfilled, (state, action) => {
            state.isLoading = false;
            state.biodataList = action.payload; 
        });
        builder.addCase(getAllBiodata.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // GET BIODATA BY ID
        builder.addCase(getBiodataById.pending, (state) => { state.isLoading = true; });
        builder.addCase(getBiodataById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.biodata = action.payload; 
        });
        builder.addCase(getBiodataById.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // VERIFY BIODATA (Admin)
        builder.addCase(verifyUserBiodata.pending, (state) => { state.isLoading = true; });
        builder.addCase(verifyUserBiodata.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.msg;
        });
        builder.addCase(verifyUserBiodata.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });

        // SUBMIT SURVEY (Surveyor)
        builder.addCase(submitSurveyData.pending, (state) => { state.isLoading = true; });
        builder.addCase(submitSurveyData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = action.payload.msg;
        });
        builder.addCase(submitSurveyData.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
    }
});

export const { resetBiodataState } = biodataSlice.actions;
export default biodataSlice.reducer;