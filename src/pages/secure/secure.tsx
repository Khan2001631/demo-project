import React, { useEffect } from "react";
import { Suspense } from "react"
import { useTranslation } from "react-i18next";
import { Routes, Route, Navigate } from "react-router-dom"
import { toggleCaptchaBadge } from "../../util/util";
import PromptsApproval from "./approve-prompt/approve-prompt";

const FramePrompt = React.lazy(() => import("./frame-prompt/frame-prompt"));
const UserProfileEdit = React.lazy(() => import("./user-profile/user-profile-edit"));
const AccountDashboard = React.lazy(() => import("./account-dashboard/account-dashboard"));
const Payout = React.lazy(() => import("./payout/payout"));
const CardPayment = React.lazy(()=> import("./stripe-payment/purchaseWithNewCard"))
const CompanyPortal = React.lazy(() => import("./company-portal/company-portal"));
const OrgCoinManagement = React.lazy(() => import("./org-coin-management/org-coin-management"));
const UploadUsers = React.lazy(() => import("./upload-users/upload-users"));
const UpdatePwd = React.lazy(() => import("./change-password/change-password"));
const ManageTeam = React.lazy(() => import("./manage-team/manage-team"));
const ManageCorp = React.lazy(() => import("./manage-corp/manage-corp"));
const ManageOrg = React.lazy(() => import("./manage-org/manage-org"));
const PromptsVersionHistory = React.lazy(() => import("./frame-prompt/promptVersionHistory"));
const RequestCompany = React.lazy(() => import("./request-company/request-company"));
const CustomModel = React.lazy(() => import("./custom-model/custom-model"));
const SimpleChat = React.lazy(() => import("./simple-chat/simple-chat"));
const ApproveAccRequest = React.lazy(() => import("./approve-acc-request/approve-acc-request"));
const UserFeedback = React.lazy(() => import("./user-feedback/user-feedback"))

const Secure = () => {
  const { t } = useTranslation();

  useEffect(() => {
    toggleCaptchaBadge(false);
    setTimeout(() => {
      toggleCaptchaBadge(false);
    }, 1000);
  }, [])
  return (
    <>
      <Suspense fallback={<div>{t('message.loading')}</div>}>
        <Routes>
          <Route path="/prompts/create" element={<FramePrompt key="/prompts/create" />} ></Route>
          <Route path="/prompts/edit/:id" element={<FramePrompt key="/prompts/edit/:id" />} ></Route>
          <Route path="/prompts/versionhistory/:id" element={<PromptsVersionHistory key="/prompts/versionhistory/:id" />} ></Route>
          <Route path="/prompts/approval" element={<PromptsApproval key="/prompts/approval" />} ></Route>
          <Route path="/userProfileEdit" element={<UserProfileEdit />} ></Route>
          <Route path="/accountDashboard" element={<AccountDashboard />} ></Route>
          <Route path="/PaymentNewCard" element={<CardPayment />} ></Route>
          <Route path="/companyPortal" element={<CompanyPortal />} ></Route>
          <Route path="/orgCoinManagement" element={<OrgCoinManagement />} ></Route>
          <Route path="/payout" element={<Payout />} ></Route>
          {/* <Route path="/uploadUsers" element={<UploadUsers />} ></Route> */}
          <Route path="/updatePwd" element={<UpdatePwd />} ></Route>
          <Route path="/manageTeam" element={<ManageTeam/>}></Route>
          <Route path="/manageCorp" element={<ManageCorp />} ></Route>
          <Route path="/manageOrg" element={<ManageOrg />} ></Route>
          <Route path="/manageOrg/edit/:id" element={<ManageOrg key="/manageOrg/edit/:id" />} ></Route>
          <Route path="/requestCompany" element={<RequestCompany />} ></Route>
          <Route path="/customModel" element={<CustomModel />} ></Route>
          <Route path="/simpleChat" element={<SimpleChat />} ></Route>
          <Route path="/approveAccRequest" element={<ApproveAccRequest />} ></Route>
          <Route path="/manageuserfeedback" element={<UserFeedback />} ></Route>
          <Route path="*" element={<Navigate to="/home" replace />} ></Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default Secure;