import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { updateIsRefreshTokenExpired, updateIsSessionExpired } from '../commonSlice';
import ApiMiddleWare from '../api-middleware';

// Define a service using a base URL and expected endpoints
export const commonStore = createApi({
  reducerPath: 'commonStore',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (header) => {
      header.set("Accept", 'application/json');
      return header
    },
  }),
  endpoints: (builder) => ({
    extendSession: builder.mutation({
      query: (body) => {
        return {
          url: '/gptblueSecurity/refreshAuthToken',
          method: 'POST',
          body: body
        }
      }
    }),
    Askgpt: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/askGPTBlue/',
          method: 'POST',
          body: body
        }
      }
    }),
    GetPromptDetails: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/getGPTPromptDetail/',
          method: 'POST',
          body: body
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    RatePrompt: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/rateGPTBlueAIResponse',
          method: 'POST',
          body: body
        }
      }
    }),
    publicPromptDetails: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/askGPTPromptDetail/',
          method: 'POST',
          body: body
        }
      }
    }),
    SendAIResponseEmail: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/sendAIResponseEmail',
          method: 'POST',
          body: body
        }
      }
    }),
    commentPrompt: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/updateGPTBlueResponseDetail',
          method: 'POST',
          body: body
        }
      }
    }),
    RefineAIResponse: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/askGPTBlueIterativePrompt/',
          method: 'POST',
          body: body
        }
      }
    }),
    generatePdf: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/generateGPTBlueResponsePDF/',
          method: 'POST',
          body: body
        }
      }
    }),
  }),
});

export const {
  useAskgptMutation, useGetPromptDetailsMutation, useRatePromptMutation, useExtendSessionMutation, usePublicPromptDetailsMutation, useSendAIResponseEmailMutation, useRefineAIResponseMutation, useCommentPromptMutation, useGeneratePdfMutation
} = commonStore;