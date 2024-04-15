import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import {useShareModalDataMutation, useShareTaskMutation, useGetRoleListMutation,} from "../../../api-integration/secure/prompts";
import TooltipComponent from "../../common/bootstrap-component/tooltip-component";
import {fullPageLoader, updateAlertMessage,} from "../../../api-integration/commonSlice";
import { draggableBootstrapModal } from "../../common/modal/draggable-modal";
import { Modal } from "bootstrap";

interface TeamMember {
  LASTNAME: string;
  ROLESCOLOR: string;
  ROLESID: string;
  picPath: string;
  USERID: number;
  ACCOUNTID: number;
  COMPANYNAME: string;
  BIZZEMAIL: string;
  FIRSTNAME: string;
  DEPARTMENTNAME: string;
  ROLESNAME: string;
}

interface Users {
  USERID: number;
  ACC_ID: number;
  LASTNAME: string;
  COMPANYNAME: string;
  FIRSTNAME: string;
  BIZZEMAIL: string;
  DEPARTMENTNAME: string;
  picPath: string;
}

interface IPromptShareProps {
  id: string;
  gptBluePromptId: number;
}

const PromptShareModal: React.FC<IPromptShareProps> = ({id, gptBluePromptId,}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [fetchShareModelDataErr, setFetchShareModelDataErr] = useState(false);
  const [userListToShare, setUserListToShare] = useState<Users[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<{ userId: number; roleId: number }[]>([]);
  const [projectTeam, setProjectTeam] = useState<TeamMember[]>([]);
  const [role, setRole] = useState<{ rolesId: number; rolesName: string}[]>([]);
  const [error, setError] = useState<string>("");
  const [
    getShareModalDataApi,
    {
      data: shareModalData,
      isLoading: isShareModalLoading,
      isSuccess: isShareModalSuccess,
      isError: isShareModalError,
      error: shareModalError,
    },
  ] = useShareModalDataMutation();
  const [
    shareTaskApi,
    {
      data: shareTaskData,
      isLoading: isShareTaskLoading,
      isSuccess: isShareTaskSuccess,
      isError: isShareTaskError,
      error: shareTaskError,
    },
  ] = useShareTaskMutation();

  const [
    getRoleListAPi,
    {
      data: getRoleListData,
      isLoading: isGetRoleListLoading,
      isSuccess: isGetRoleListSuccess,
      isError: isGetRoleListError,
      error: getRoleListError,
    },
  ] = useGetRoleListMutation();

  useEffect(() => {
    dispatch(fullPageLoader(true));
    getRoleListAPi({
      gptblueRoleId: 0,
      gptblueRoleStatus: "",
    });
  }, [gptBluePromptId]);

  useEffect(() => {
    dispatch(fullPageLoader(true));
    getShareModalDataApi({
      GPTBluePromptId: gptBluePromptId,
      searchedText: "",
    });
  }, [gptBluePromptId, isShareTaskSuccess]);

  useEffect(() => {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      draggableBootstrapModal(modalElement);
    }
  }, [id]);

  const handlSearch = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      // Update the state with the new input value
      dispatch(fullPageLoader(true));
      await getShareModalDataApi({
        GPTBluePromptId: gptBluePromptId,
        searchedText: event.target.value,
      });
    },
    [getShareModalDataApi, gptBluePromptId]
  );
  
  useEffect(() => {
    if (isGetRoleListSuccess) {
      dispatch(fullPageLoader(false));
      if (getRoleListData?.roleDetail) {
        setRole(getRoleListData?.roleDetail);
      }
    }
  }, [isGetRoleListSuccess, getRoleListError]);

  useEffect(() => {
    if (isShareModalSuccess) {
      dispatch(fullPageLoader(false));
      if (shareModalData?.user && shareModalData?.user) {
        setUserListToShare(shareModalData?.user);
        setProjectTeam(shareModalData?.team);
      }
    }
  }, [isShareModalSuccess, shareModalError]);

  const handleRoleChange = useCallback(
    (userId: number, roleId: number) => {
      const existingIndex = selectedRoles.findIndex(
        (role) => role.userId === userId
      );
      // remove error message
      setError("");
      if (existingIndex !== -1) {
        setSelectedRoles((prevRoles) => [
          ...prevRoles.slice(0, existingIndex),
          { userId, roleId },
          ...prevRoles.slice(existingIndex + 1),
        ]);
      } else {
        setSelectedRoles((prevRoles) => [...prevRoles, { userId, roleId }]);
      }
    },
    [selectedRoles]
  );

  useEffect(() => {
    if (isShareTaskSuccess) {
      dispatch(fullPageLoader(false));
      if (shareTaskData?.success == true) {
        dispatch(
          updateAlertMessage({
            status: "success",
            message: shareTaskData?.message,
          })
        );
      } else {
        dispatch(
          updateAlertMessage({
            status: "error",
            message: shareTaskData?.message,
          })
        );
      }
    }
    if (isShareTaskError) {
      dispatch(fullPageLoader(false));
      dispatch(
        updateAlertMessage({ status: "error", message: shareTaskData?.message })
      );
    }
  }, [isShareTaskSuccess, isShareTaskError]);

  const shareTask = useCallback(() => {
    if (selectedRoles.length === 0) {
      setError(t("share_modal.error"));
      return;
    }

    // Close the modal manually
    const myModalEl = document.getElementById(id);
    if (myModalEl) {
      const modal = Modal.getInstance(myModalEl);
      if (modal) {
        modal?.hide();
      }
    }

    dispatch(fullPageLoader(true));
    shareTaskApi({
      promptId: gptBluePromptId,
      users: selectedRoles,
    });
  }, [id, selectedRoles, shareTaskApi, gptBluePromptId]);
  // clear error when modal is hidden
  useEffect(() => {
    const myModalEl = document.getElementById(id);
    const modalHideHandler = () => setError("");
    if (myModalEl) {
      myModalEl.addEventListener("hide.bs.modal", modalHideHandler);
    }
    return () => {
      if (myModalEl) {
        myModalEl.removeEventListener("hide.bs.modal", modalHideHandler);
      }
    };
  }, [id]);

  useEffect(() => {
    if (error) {
      // Stop modal closing when there is an error
      const myModalEl = document.getElementById(id);
      const modal = Modal.getInstance(myModalEl!);
      if (modal) {
        modal?.show();
      }
    }
  }, [error, id]);
  return (
    <div
      className="modal fade modal-draggable"
      data-bs-backdrop="false"
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>
              {t("modals.share_prompt.title")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className={`form-control mb-1 ${
                fetchShareModelDataErr ? "is-invalid" : ""
              }`}
              id="userInputEmail"
              name="userInputEmail"
              placeholder={t("share_modal.form_field.user_email.placeholder")}
              onChange={handlSearch}
            />
            <form id="sharingForm" name="sharingForm">
              <div className="row">
                <div className="col-lg-10">
                  <h5>{t("share_modal.text.user_search")}</h5>
                </div>
              </div>
              <div className="m-2 overflow-auto h-7 scrollbar">
                {/* user team row start*/}
                {userListToShare.map((user: Users, index: number) => (
                  <div className="row g-0 my-3" key={index}>
                    <div className="col-lg-7">
                      <div className="d-flex align-items-center">
                        <div>
                          <TooltipComponent
                            title={user.FIRSTNAME + " " + user.LASTNAME}
                          >
                            <img
                              src={user.picPath}
                              alt={user.FIRSTNAME + " " + user.LASTNAME}
                              className="m-1 rounded-circle blc_image_sm"
                            />
                          </TooltipComponent>
                        </div>
                        <div className="ps-2">
                          <h4>
                            {user.FIRSTNAME} {user.LASTNAME}
                          </h4>

                          <h4>
                            {user.COMPANYNAME} | {user.DEPARTMENTNAME}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="me-2">
                        <select
                          className="form-select"
                          name={`invitedMemberRole${user.USERID}`}
                          id={`invitedMemberRole${user.USERID}`}
                          onChange={(e) =>
                            handleRoleChange(
                              user.USERID,
                              parseInt(e.target.value, 10)
                            )
                          }
                          value={
                            (
                              selectedRoles.find(
                                (role) => role.userId === user.USERID
                              ) || {}
                            ).roleId || ""
                          }
                        >
                          <option value="">
                            {t("share_modal.form_field.invite_member.label")}
                          </option>
                          <optgroup label={t("common.roles")}>
                            {role &&
                              role.map((roleDetail) => (
                                <option
                                  key={roleDetail.rolesId}
                                  value={roleDetail.rolesId}
                                >
                                  {roleDetail.rolesName}
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {/* user team row end*/}
              </div>
              <hr className="border border-primary border-2 opacity-75 m-1" />
              <div className="mb-1">
                {t("share_modal.text.user_access")}
              </div>
              <div className="m-2 overflow-auto h-7 scrollbar">
                {/* project team user row */}
                {projectTeam.map((teamMember: TeamMember, index: number) => (
                  <div className="row g-0 my-3" key={index}>
                    <div className="col-lg-7">
                      <div className="d-flex align-items-center">
                        <div>
                          <TooltipComponent title="{teamMember.FIRSTNAME + '' + teamMember.LASTNAME}">
                            <img
                              src={teamMember.picPath}
                              alt={
                                teamMember.FIRSTNAME + "" + teamMember.LASTNAME
                              }
                              className="m-1 rounded-circle blc_image_sm"
                            />
                          </TooltipComponent>
                        </div>
                        <div className="ps-2">
                          <h4>
                            {teamMember.FIRSTNAME} {teamMember.LASTNAME}
                          </h4>
                          <h4>
                            {teamMember.COMPANYNAME} |{" "}
                            {teamMember.DEPARTMENTNAME}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      {teamMember.ROLESID == "1" ? (
                        <p>{teamMember.ROLESNAME}</p>
                      ) : (
                        <div className="me-2">
                          <select
                            className="form-select"
                            name={`teamMemberRole${teamMember.USERID}`}
                            id={`teamMemberRole${teamMember.USERID}`}
                            // value={teamMember.ROLESID}
                            value={
                              (
                                selectedRoles.find(
                                  (role) => role.userId === teamMember.USERID
                                ) || {}
                              ).roleId ||
                              teamMember.ROLESID  ||
                              ""
                            }
                            onChange={(e) =>
                              handleRoleChange(
                                teamMember.USERID,
                                parseInt(e.target.value, 10)
                              )
                            }
                          >
                            <optgroup label={t("common.roles")}>
                              {role &&
                                role.map((roleDetail) => (
                                  <option
                                    key={roleDetail.rolesId}
                                    value={roleDetail.rolesId}
                                  >
                                    {roleDetail.rolesName}
                                  </option>
                                ))}
                            </optgroup>
                            <optgroup label={t("common.access")}>
                              <option value="-1">
                                {t("common.remove_access")}
                              </option>
                            </optgroup>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/* project team user row end */}
              </div>
            </form>
            <div className="modal-footer">
              {error && <div className="text-danger">{error}</div>}
              <TooltipComponent title={t("share_modal.btn.close.tooltip")}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  {t("share_modal.btn.close.label")}
                </button>
              </TooltipComponent>

              <TooltipComponent title={t("share_modal.btn.share.tooltip")}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={shareTask}
                >
                  {t("share_modal.btn.share.label")}
                </button>
              </TooltipComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptShareModal;