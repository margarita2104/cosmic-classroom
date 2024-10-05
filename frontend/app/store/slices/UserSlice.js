import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice(
    {
        name: 'user',
        initialState: {
            accessToken: undefined,
        },
        reducers: {
            login_user: (state, action) => {
                state.accessToken = action.payload;
                if (typeof window !== "undefined") {
                    localStorage.setItem('accessToken', action.payload);
                }
            },
            logout_user: (state) => {
                state.accessToken = null;
                if (typeof window !== "undefined") {
                    localStorage.removeItem('accessToken');
                }
            },
        }
    }
)

export const {login_user, logout_user} = userSlice.actions

export default userSlice.reducer