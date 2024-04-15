import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import { fullPageLoader, updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired } from "../../../api-integration/commonSlice";
import { useCopyPromptsMutation, useGetPromptsMutation, useDownloadPromptsMutation } from "../../../api-integration/secure/prompts";
import Card from '../card/card';
import Like from '../../../assets/icons/like.svg';
import Share from '../../../assets/icons/share.svg';
import DNA from '../../../assets/icons/dna.svg';
import Download from '../../../assets/icons/download.svg';
import Star from '../../../assets/icons/star.svg';
import {  getPageByURL } from "../../../util/util";

interface PromptLibraryProps {
  id: string;
  libraryType: string;
}

const PromptLibrary: React.FC<PromptLibraryProps> = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [functionToCallAfterRefresh, setFunctionToCallAfterRefresh] = useState<any>('')
  const [copyPromptId, setCopyPromptId] = useState<any>('')
  const { isSessionExpired, user } = useSelector((state: any) => state.commonSlice);
  const [navlinkToAddr, setNavlinkToAddr] = useState('');

  useEffect(() => {
    if(props.libraryType == 'org') {
      setNavlinkToAddr('/app/companyPortal');
    }else {
      setNavlinkToAddr('/home');
    }
  }, [props.libraryType])

  const [getPromptsAPI, { data: prompts, isLoading, isSuccess, isError, error }] =
    useGetPromptsMutation();

  const [copyPromptsAPI, { data: copyPromptsData, isLoading: isCopyPromptLoading, isSuccess: isCopyPromptSuccess, isError: isCopyPromptError, error: copyPromptError }] =
    useCopyPromptsMutation()

  const [downloadPromptsAPI, { data: downloadPromptsData, isLoading: isDownloadPromptLoading, isSuccess: isDownloadPromptSuccess, isError: isDownloadPromptError, error: DownloadPromptError }] =
    useDownloadPromptsMutation();

  const copyPrompt = (promptId: number) => {
    if (window.confirm(t('message.confirm_copy_prompt')) == true) {
      dispatch(fullPageLoader(true));
      setCopyPromptId(promptId);
      copyPromptsAPI({ "GPTBluePromptId": promptId });
    }
  }

  useEffect(() => {
    const payload = { "GPTBluePromptId": 0, "gptbluePrjOwnerId": 0, "gptbluePrjMemberId": 0, "gptBlueLibraryId": 1, "libraryType": props?.libraryType, "Page": getPageByURL(location.pathname)}
    dispatch(fullPageLoader(true));
    getPromptsAPI(payload);
  }, [])

  //SORTING PROMPTS
  type sortingData = {
    CREATEDON: string;
    Request: number;
    Productivity: number;
    PROMPTNAME: string;
  };
  
  type SortCriteria = 'newest' | 'most_used' | 'most_productive' | 'alphabetical';
  const [sortingData, setSortingData] = useState<sortingData[]>([]);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('newest');
  const [pageOrderText , setPageOrderText] = useState<string>(t('text.newest.label'));
  
  useEffect(() => {
    if (prompts) {
      setSortingData(prompts.promptDetail);
    }
    else {
      setSortingData([]);
    }
  }, [prompts]);
  
  useEffect(() => {
    if(isSuccess) {
      if(sortingData.length === 0) return;
      const sortedData = [...sortingData].sort((a, b) => {
        switch(sortCriteria) {
          case 'newest':
            setPageOrderText(t('text.newest.label') as string);
            return new Date(b.CREATEDON).getTime() - new Date(a.CREATEDON).getTime();
          case 'most_used':
            setPageOrderText(t('text.most_used.label') as string);
            return b.Request - a.Request;
          case 'most_productive':
            setPageOrderText(t('text.most_productive.label') as string);
            return b.Productivity - a.Productivity;
          case 'alphabetical':
            setPageOrderText(t('text.alphabetical.label') as string);
            return a.PROMPTNAME.localeCompare(b.PROMPTNAME);
          default:
            return 0;
        }
      });
      setSortingData(sortedData);
    }
  }, [sortCriteria]);


  useEffect(() => {
    if (isSuccess || isError || isCopyPromptSuccess) {
      dispatch(fullPageLoader(false));
    }
    if (isError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('prompt.prompts_fetching_error') }));
    }
    if (isCopyPromptError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('prompts.copy_error') }));
    }
    if (isSuccess) {
      if (prompts?.success == false && prompts?.statusCode != 401) {
        if (prompts?.status == 'FETCH_ERROR' || prompts?.status == 'PARSING_ERROR') {
          dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
        } 
        // else {
        //   dispatch(updateAlertMessage({ status: 'error', message: prompts?.message }));
        // }
      }
    }
    if (isCopyPromptSuccess) {
      if (copyPromptsData?.success == true) {
        navigate(`/app/prompts/edit/${copyPromptsData?.promptId}`)
      } else if (copyPromptsData?.status == 'FETCH_ERROR' || copyPromptsData?.status == 'PARSING_ERROR') {
        dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
      } else {
        dispatch(updateAlertMessage({ status: 'error', message: copyPromptsData?.message }));
      }
    }
  }, [isSuccess, isError, isCopyPromptSuccess, isCopyPromptError]);

  useEffect(() => {
    if (isDownloadPromptSuccess) {
      if (downloadPromptsData?.success == true) {
        dispatch(updateAlertMessage({ status: 'success', message: downloadPromptsData?.message }));
        navigate(`/home`);
      } else if (downloadPromptsData?.status == 'FETCH_ERROR' || downloadPromptsData?.status == 'PARSING_ERROR') {
        dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
      } else {
        dispatch(updateAlertMessage({ status: 'error', message: downloadPromptsData?.message }));
      }
    }
  }, [isDownloadPromptSuccess, isDownloadPromptError]);

  useEffect(() => {
    if (isSessionExpired == false && functionToCallAfterRefresh != '') {
      if (functionToCallAfterRefresh == 'copy') copyPromptsAPI({ "GPTBluePromptId": copyPromptId });
    }
  }, [isSessionExpired])

  const linkNames = [
    'Administration', 'Analytics', 'Architect', 'Artist', 
    'Author', 'Banking', 'Consultant', 'CX', 'Executive', 'Finance'
  ];

  return (
    <Card id={props?.id} titleType={1} title={t('card.Prompt_Library.title')} cardHeightClass='h-100' like={true} share={props?.libraryType== 'personal' ? true : false } help={true} Feedback={true} logo={true} helpTitle={t('card.Prompt_Library.help.title')} helpContent={t('card.Prompt_Library.help.content')}>
      {user?.blcFlag && user?.blcFlag == true &&
        <div className='row g-0'>
          <div className="col-md-2">
            {t('prompt_library.filter.text')}:
          </div>
          <div className="col-md-10">
            <div className="mb-2 h6">
              {Array.isArray(linkNames) && linkNames.map((name, index) => (
                <React.Fragment key={index}>
                  <NavLink to={navlinkToAddr} className="text-decoration-none">{name}</NavLink>
                  {index < linkNames.length - 1 && ' | '}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      }
      {isSuccess && prompts && prompts?.promptDetail ?(
        <div className='row g-0'>
          <div className="col-md-2">
            {t('prompt_library.order.text')}:
          </div>
          <div className="col-md-10">
            <div className="mb-5 h6">
              <TooltipComponent title={t('links.newest.tooltip')}>
                <span className='cursor-pointer' onClick={() => setSortCriteria('newest')}>
                  {t('links.newest.label')}
                </span>
              </TooltipComponent> | &nbsp;
              <TooltipComponent title={t('links.most_used.tooltip')}>
                <span className='cursor-pointer' onClick={() => setSortCriteria('most_used')}>
                  {t('links.most_used.label')}
                </span>
              </TooltipComponent> | &nbsp;
              <TooltipComponent title={t('links.most_productive.tooltip')}>
                <span className='cursor-pointer' onClick={() => setSortCriteria('most_productive')}>
                  {t('links.most_productive.label')}
                </span>
              </TooltipComponent> | &nbsp;
              <TooltipComponent title={t('links.alphabetical.tooltip')}>
                <span className='cursor-pointer' onClick={() => setSortCriteria('alphabetical')}>
                  {t('links.alphabetical.label')}
                </span>
              </TooltipComponent>
            </div>
          </div>
          <div className="col-md-12">
            <h6 className="mb-3"><strong>{pageOrderText}</strong></h6>
          </div>
        </div>
      ):(<p className='mt-2 text-center'>No Prompt available</p>)
      }
      
      <div className="row g-3 row-cols-4 mb-4">
        {isSuccess && sortingData && sortingData?.map((prompt: any, index: number) => (
            <div className="col" key={index}>
              <NavLink to={`/app/askgpt/${prompt?.URLCODE}`} className="text-decoration-none">
                <TooltipComponent title={prompt?.PROMPTDESCRIPTION} >
                  <div className='prompt-card'>
                    <div className="prompt-card-image-container">
                      <img src={prompt?.promptImage} className="object-fit-md-cover border border-primary rounded" alt="Prompt Image" />
                    </div>  
                    <div className="prompt-card-image-actions">
                      <div className='d-inline-block'>
                        <TooltipComponent title={t('prompt.home.icons_tooltips.download')} >
                          <img src={Download}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (window.confirm(t('prompt.icon.download.confirm_msg')) == true) {
                                dispatch(fullPageLoader(true));
                                downloadPromptsAPI({ "gptBluePromptId": prompt?.GPTBLUEPROMPTID })
                              }
                            }}
                          />
                        </TooltipComponent>
                      </div>
                      <div className="d-inline-block"><TooltipComponent title={t('prompt.home.icons_tooltips.dna')} ><img src={DNA} /></TooltipComponent></div>
                      <div className="d-inline-block"><TooltipComponent title={t('prompt.home.icons_tooltips.star')} ><img src={Star} /></TooltipComponent></div>
                      <div className="d-inline-block"><TooltipComponent title={t('prompt.home.icons_tooltips.like')} ><img src={Like} /></TooltipComponent></div>
                      <div className="d-inline-block"><TooltipComponent title={t('prompt.home.icons_tooltips.share')} ><img src={Share} /></TooltipComponent></div>
                    </div>
                  </div>
                </TooltipComponent>
              </NavLink>
            </div>
          ))
        }
      </div>
    </Card>
  );
};

export default PromptLibrary;