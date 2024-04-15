import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getCookie } from '../../util/util';
import { updateIsRefreshTokenExpired, updateIsSessionExpired } from '../commonSlice';
import ApiMiddleWare from '../api-middleware';

// Define a service using a base URL and expected endpoints
export const secureStore = createApi({
  reducerPath: 'secureStore',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (header) => {
      header.set("Accept", 'application/json');
      return header
    },
  }),
  endpoints: (builder) => ({
    Logout: builder.mutation({
      query: (body) => {
        return {
          url: 'gptblueSecurity/logOutUser/',
          method: 'POST',
          body: {
          }
        }
      }
    }),
    getUserProfile: builder.mutation({
      query: (body) => {
        return {
          url: 'userManagerCFC/getUserProfile/',
          method: 'POST',
          body: {}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getSubPlan: builder.mutation({
      query: (body) => {
        return {
          url: 'gptBlueSystemCFC/getGptBlueSubPlan/',
          method: 'POST',
          body: {}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    postUserProfile: builder.mutation({
      query: (userPostData) => {
        return {
          url: 'userManagerCFC/updateUserProfile/',
          method: 'POST',
          body: {...userPostData}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getGptBlueAccTransHistory: builder.mutation({
      query: (body)=>{
        return {
          url: 'gptBlueSystemCFC/getGptBlueAccTransHistory/ ',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getCountryList: builder.mutation({
      query: () => {
        return {
          url: 'gptBlueSystemCFC/getCountry/',
          method: 'POST',
          body: {}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getOrgnizationsList: builder.mutation({
      query: (body) => {
        return {
          url: '/gptBlueSCCCFC/getOrganizations/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getOrgnizationsLevel: builder.mutation({
      query: (body) => {
        return {
          url: 'gptBlueSCCCFC/getOrgLevel/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getUserFeedback: builder.mutation({
      query: (body) => {
        return {
          url: "/gptBlueUserFeedback/getUserFeedback/",
          method: "POST",
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    addUpdateOrg: builder.mutation({
      query: (body) => {
        return {
          url: '/gptBlueSCCCFC/addUpdateOrg/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getCompanyDetail: builder.mutation({
      query: (body) => {
        return {
          url: 'gptBlueSCCCFC/getCompanyDetail/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getOrganizationRoles: builder.mutation({
      query:(body) => {
        return {
          url: '/gptBlueSCCCFC/getAllSCCRoles/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    connectAccount: builder.mutation({
      query: (body) => {
        return {
          url: 'userManagerCFC/ConnectAccount/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    generateImage: builder.mutation({
      query: (body) => {
        return {
          url: 'gptBlueSystemCFC/generateImage/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    generateReferralId: builder.mutation({
      query: (body) => {
        return {
          url: 'userManagerCFC/generateRefKey/',
          method: 'POST',
          body: {}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    uploadImage: builder.mutation({
      query: (payload) => {
        return {
          url: 'userManagerCFC/uploadImage/',
          method: 'POST',
          body: {...payload}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    uploadUsers: builder.mutation({
      query: (formData) => {
        return {
          url: 'gptBlueTeamManager/uploadUsers/',
          method: 'POST',
          body: {...formData}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    changePassword: builder.mutation({
      query: (body) => {
        return {
          url: 'gptBlueAccessCFC/changePassword/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    checkCCBalance: builder.mutation({
      query: (body) => {
        return {
          url: 'gptCommerce/checkUserCCBalance/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    gptBlueSocialShare: builder.mutation({
      query: (body) => {
        return {
          url: 'gptbluePrompt/gptBlueSocialShare/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getPromptsApproval: builder.mutation({
      query: (body) => {
        return {
          url: 'gptblueManagePrompt/getPromptsForReview/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    postPromptsApproval: builder.mutation({
      query: (body) => {
        return {
          url: 'gptblueManagePrompt/promptReview/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    updateModel: builder.mutation({
      query: (body) => {
        return {
         url: "/gptBlueCustomModel/getGPTCustomModel/",
          method:"POST",
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    addModel: builder.mutation({
      query: (body) => {
        return {
         url: "/gptBlueCustomModel/addUpdateCustomModel/",
          method:"POST",
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    askChatGPT:  builder.mutation({
      query: (body) => {
        return {
         url: "/gptbluePublicCFC/askGPTBlueSimpleMode/ ",
          method:"POST",
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    addUser: builder.mutation({
      query: (body)=>{
        return {
          url: 'userManagerCFC/addUser/',
          method: 'POST',
          body:{...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getTeam: builder.mutation({
      query: (body)=>{
        return {
          url: '/gptBlueTeamManager/getTeam/',
          method: 'POST',
          body:{...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    verifySecurityCodes: builder.mutation({
      query: (body)=>{
        return {
          url: '/userManagerCFC/verifySecurityCodes/',
          method: 'POST',
          body:{...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    resendCode: builder.mutation({
      query: () => {
        return {
          url: '/userManagerCFC/resendCode/',
          method: 'POST',
          body: {}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    diassociateAccount: builder.mutation({
      query: () => {
        return {
          url: '/userManagerCFC/DisassociateAccount/',
          method: 'POST',
          body: {}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    companyCreateRequest: builder.mutation({
      query: (body) => {
        return {
          url: '/gptBlueSCCCFC/CompanyCreateRequest',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    getAccCreateRequest: builder.mutation({
      query: (body) => {
        return {
          url: '/gptBlueSCCCFC/getAccCreateRequest/',
          method: 'POST',
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    requestApprovalAction:  builder.mutation({
      query: (body) => {
        return {
         url: "/gptBlueAdmin/accCreateRequestReview/",
          method:"POST",
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
    requestApproval:  builder.mutation({
      query: (body) => {
        return {
         url: "/gptBlueAdmin/getAccCreateRequest/",
          method:"POST",
          body: {...body}
        }
      },
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => { try { ApiMiddleWare(await queryFulfilled, dispatch) } catch (error: any) { } }
    }),
  }),
});

export const {
  useLogoutMutation,
  useGetUserProfileMutation,
  usePostUserProfileMutation,
  useGetSubPlanMutation,
  useGetGptBlueAccTransHistoryMutation,
  useGetCountryListMutation,
  useGetOrgnizationsListMutation,
  useGetOrgnizationsLevelMutation,
  useAddUpdateOrgMutation,
  useGetCompanyDetailMutation,
  useConnectAccountMutation,
  useGenerateImageMutation,
  useGenerateReferralIdMutation,
  useUploadImageMutation,
  useUploadUsersMutation,
  useChangePasswordMutation,
  useCheckCCBalanceMutation,
  useGptBlueSocialShareMutation,
  useGetPromptsApprovalMutation,
  usePostPromptsApprovalMutation,
  useAddUserMutation,
  useGetTeamMutation,
  useUpdateModelMutation,
  useAddModelMutation,
  useAskChatGPTMutation,
  useVerifySecurityCodesMutation,
  useResendCodeMutation,
  useDiassociateAccountMutation,
  useCompanyCreateRequestMutation,
  useGetAccCreateRequestMutation,
  useRequestApprovalActionMutation,
  useRequestApprovalMutation,
  useGetUserFeedbackMutation,
  useGetOrganizationRolesMutation
} = secureStore;
