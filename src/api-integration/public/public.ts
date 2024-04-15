import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import ApiMiddleWare from '../api-middleware';

// Define a service using a base URL and expected endpoints
export const publicStore = createApi({
  reducerPath: 'publicStore',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (header) => {
      header.set("Accept", 'application/json');
      return header
    },
  }),
  endpoints: (builder) => ({
    Login: builder.mutation({
      query: (body) => {
        return {
          url: '/gptBlueAccessCFC/UserAuthentication/',
          method: 'POST',
          body: body
        }
      }
    }),
    ForgotPwd: builder.mutation({
      query: (body) => {
        return {
          url: '/gptBlueAccessCFC/generatePassword/',
          method: 'POST',
          body: body
        }
      }
    }),
    ExternalIntegration: builder.mutation({
      query: (body) => {
        return {
          url: '/gptBlueAccessCFC/UserExtAuthentication',
          method: 'POST',
          body: body
        }
      }
    }),
    rateCard: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/rateGPTBluePageTile/',
          method: 'POST',
          body: body
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getPageTileInfo: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/getPageTileInfo/',
          method: 'POST',
          body: body
        }
      }
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPwdMutation,
  useExternalIntegrationMutation,
  useRateCardMutation,
  useGetPageTileInfoMutation
} = publicStore;