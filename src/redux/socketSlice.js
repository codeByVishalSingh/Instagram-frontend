import { createSlice } from "@reduxjs/toolkit";

const scoketSlice = createSlice({
    name:"socketio",
    initialState:{
        Socket:null
    },
    reducers:{
        setSocket:(state, action) =>{
            state.Socket =action.payload;

        }
    }
});
export const {setSocket} = scoketSlice.actions;
export default scoketSlice.reducer