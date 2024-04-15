import { createSlice } from '@reduxjs/toolkit'
import { commonSliceInterface } from '../interfaces/common/common.interface'

const initialState: commonSliceInterface = {
  isLoggedIn: false,
  fullPageLoader: false,
  alertMessage: { status: '', message: '', timeout: null },
  isSessionExpired: false,
  isRefreshTokenExpired: false,
  reloadPageAfterSessionExpired: true,
  user: {
    userEmail: '',
    userId: 0,
    firstName: '',
    lastName: '',
    picPath: '',
    totalCCPoints: '',
    usrCreatedDate: '',
    referralId: '',
    libraryType: 'personal',
    roleInOrg: '',
    blcUsercount: 0,
    GPTBlueID: 0,
    blcFlag: false,
    accId: 0,
    orgId: 0,
    accountType: '',
  },
  currentPrompt: {},
  TileInfo: []
}

export const commonSlice = createSlice({
  name: 'commonSlice',
  initialState,
  reducers: {
    updateLogin: (state) => {
      state.isLoggedIn = true;
    },
    updateLogout: (state) => {
      state.isLoggedIn = false;
    },
    fullPageLoader: (state, action) => {
      state.fullPageLoader = action.payload;
    },
    updateAlertMessage: (state, action) => {
      state.alertMessage = action.payload;
    },
    updateIsSessionExpired: (state, action) => {
      state.isSessionExpired = action.payload;
    },
    updateIsRefreshTokenExpired: (state, action) => {
      state.isRefreshTokenExpired = action.payload;
    },
    updateReloadPageAfterSessionExpired: (state, action) => {
      state.reloadPageAfterSessionExpired = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updateCurrentPrompt: (state, action) => {
      state.currentPrompt = action.payload;
    },
    updateTileInfo: (state, action) => {
      state.TileInfo = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateLogin, updateLogout, fullPageLoader, updateAlertMessage, updateIsSessionExpired, updateIsRefreshTokenExpired, updateReloadPageAfterSessionExpired, updateUser, updateCurrentPrompt, updateTileInfo } = commonSlice.actions

// export default commonSlice.reducer