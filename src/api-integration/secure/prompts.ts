import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { updateIsRefreshTokenExpired, updateIsSessionExpired } from '../commonSlice';
import ApiMiddleWare from '../api-middleware';

// Define a service using a base URL and expected endpoints
export const promptsStore = createApi({
  reducerPath: 'promptsStore',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (header) => {
      header.set("Accept", 'application/json');
      return header
    },
  }),
  endpoints: (builder) => ({
    CreatePrompt: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/addGptBluePrompt',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getPrompts: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/getGPTPromptDetail/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    versionHistory: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/getGPTBluePromptVersionHistory/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    copyPrompts: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/copyGptBluePrompt/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    promptStats: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/getGPTBluePromptStats/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    promptTeam: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/getGPTPromptTeam/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    updatePrompts: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/changeGptBluePromptStatus/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    askGPTTest: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/testGptBlueFramedPrompt/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    publicAskGPT: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/askGPTBlue/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    askGPTRefineResultTest: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/testGptBlueRepetitiveFramedPrompt/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    publicAskGPTRefineResult: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePublicCFC/askGPTBlueIterativePrompt/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    promptStatistics: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/getGPTBluePromptStats/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    deployPrompts: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/deployGptBluePrompt/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    downloadPrompts: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/downloadGptBluePrompt/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    shareModalData: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/getUserListToShare/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    shareTask: builder.mutation({
      query: (body) => {
        return {
          url: '/gptbluePrompt/gptBlueShareTask/',
          method: 'POST',
          body: {
            ...body
          }
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getFunctionDetail: builder.mutation({
      query: (body) => {
        return {
          url: 'gptbluePrompt/getGPTFunctionDetail/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
     getRoleList: builder.mutation({
      query: (body) => {
        return {
          url: 'gptbluePrompt/getGPTBlueRole/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
  }),
});


export const {
  useCreatePromptMutation,
  useGetPromptsMutation,
  useCopyPromptsMutation,
  usePromptStatsMutation,
  usePromptTeamMutation,
  useUpdatePromptsMutation,
  useAskGPTTestMutation,
  useAskGPTRefineResultTestMutation,
  usePromptStatisticsMutation,
  usePublicAskGPTRefineResultMutation,
  usePublicAskGPTMutation,
  useDeployPromptsMutation,
  useDownloadPromptsMutation,
  useShareModalDataMutation,
  useShareTaskMutation,
  useGetFunctionDetailMutation,
  useVersionHistoryMutation,
  useGetRoleListMutation
} = promptsStore;