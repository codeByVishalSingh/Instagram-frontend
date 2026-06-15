import { createSlice } from "@reduxjs/toolkit";

const scoketSlice = createSlice({
    name:"socketio",
    initialState:{
        socket:null
    },
    reducers:{
        setSocket:(state, action) =>{
            state.socket =action.payload;

        }
    }
});
export const {setSocket} = scoketSlice.actions;
export default scoketSlice.reducer