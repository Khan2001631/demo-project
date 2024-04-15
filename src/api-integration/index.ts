import { configureStore } from '@reduxjs/toolkit'
import { commonSlice } from './commonSlice'
import { publicStore } from './public/public'
import { secureStore } from './secure/secure'
import { promptsStore } from './secure/prompts'
import { commonStore } from './public/common'

export const store = configureStore({
  reducer: {
    [commonSlice.name]: commonSlice.reducer,
    [publicStore.reducerPath]: publicStore.reducer,
    [secureStore.reducerPath]: secureStore.reducer,
    [promptsStore.reducerPath]: promptsStore.reducer,
    [commonStore.reducerPath]: commonStore.reducer,

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(publicStore.middleware, secureStore.middleware, promptsStore.middleware, commonStore.middleware),
})


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
