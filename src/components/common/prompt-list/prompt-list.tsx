import Card from "../card/card";

import { useGetPromptsMutation } from "../../../api-integration/secure/prompts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fullPageLoader, updateAlertMessage, updateUser } from "../../../api-integration/commonSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Flag from '../../../assets/icons/bluePrompt.svg';
import TooltipComponent from "../bootstrap-component/tooltip-component";
import { getPageByURL } from "../../../util/util";

const PromptList = (props: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, trigger, formState: { errors } } = useForm();
  const { user } = useSelector((state: any) => state.commonSlice);
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const [libSwitch, setLibSwitch] = useState({switchVal: 0});
  const [promptCount, setPromptCount] = useState(0);
  
  const [getPromptsAPI, { data: prompts, isLoading, isSuccess, isError, error }] = useGetPromptsMutation();

  type SortCriteria = "newest_date" | "updated_date" | "alphabetical";
  const [sortingData, setSortingData] = useState<sortingData[]>([]);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>("alphabetical");
  const [isToggled, setIsToggled] = useState<boolean>(true);

  const handleToggle = (param: SortCriteria) => {
    setSortCriteria(param);
    setIsToggled(!isToggled);
  };

  //SORTING PROMPTS
  type sortingData = {
    CREATEDON: string;
    UPDATEDON: string;
    PROMPTNAME: string;
  };

  useEffect(() => {
    setLibSwitch({ switchVal: user?.libraryType === 'org' ? 1 : 0});
  }, [user]);

  useEffect(() => {
    if (isSuccess || isError) {
      dispatch(fullPageLoader(false));
    }
    if (isError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('prompt.prompts_fetching_error') }));
    }
    if (isSuccess) {
      if (prompts?.success == true) {
        if (prompts?.promptDetail) {
          //setSortingData(prompts.promptDetail);
          setPromptCount(prompts.promptDetail.length);
        }
      }
      if (prompts?.success == false && prompts?.statusCode != 401) {
        if (prompts?.status == 'FETCH_ERROR' || prompts?.status == 'PARSING_ERROR') {
          dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
        } else {
          //dispatch(updateAlertMessage({ status: 'error', message: prompts?.message }));
        }
      }
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (prompts?.promptDetail) {
      setSortingData(prompts.promptDetail);
    }
    else {
      setSortingData([]);
    }
  }, [prompts?.promptDetail]);


  useEffect(() => {
    dispatch(fullPageLoader(true));
    getPromptsAPI({includePublicPrompt:props?.includePublicPrompt, libraryType: user?.libraryType, "Page": getPageByURL(location.pathname) || 'home'});
  }, [user?.libraryType]);

  const selectAccType = (e: any) => {
    props.setIsLibraryTypeChanged(!props.isLibraryTypeChanged);
    setLibSwitch(prevVal => ({
      ...prevVal,
      switchVal: e.target.value
    }));

    if (e.target.value == 1) {
      let user = JSON.parse(localStorage.getItem('user') as string);
      user.libraryType = 'org';
      dispatch(updateUser(user));
      localStorage.setItem('user', JSON.stringify(user));
      getPromptsAPI({includePublicPrompt:props?.includePublicPrompt, libraryType: 'org'});
    } else {
      let user = JSON.parse(localStorage.getItem('user') as string);
      user.libraryType = 'personal';
      dispatch(updateUser(user));
      localStorage.setItem('user', JSON.stringify(user));
      getPromptsAPI({includePublicPrompt:props?.includePublicPrompt, libraryType: 'personal'});
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (sortingData.length === 0) return;
      const sortedData = [...sortingData].sort((a, b) => {
        switch (sortCriteria) {
          case "newest_date":
            if (isToggled) {
              return (
                new Date(a.CREATEDON).getTime() - new Date(b.CREATEDON).getTime()
                );
            } else {
              return (
                new Date(b.CREATEDON).getTime() - new Date(a.CREATEDON).getTime()
              );
            }
          case "updated_date":
            if (isToggled) {
              return (
                new Date(a.UPDATEDON).getTime() - new Date(b.UPDATEDON).getTime()
              );
            } else {
              return (
                new Date(b.UPDATEDON).getTime() - new Date(a.UPDATEDON).getTime()
              );
            }
          case "alphabetical":
            if (isToggled) {
              return a.PROMPTNAME.localeCompare(b.PROMPTNAME);
            } else {
              return b.PROMPTNAME.localeCompare(a.PROMPTNAME);
            }
          default:
            return 0;
        }
      });
      setSortingData(sortedData);
    }
  }, [sortCriteria, isToggled]);

  return (
    <Card id="io_promptLibrary" 
      cardGlow={isSuccess && prompts && (!prompts.promptDetail || (prompts.promptDetail && promptCount < 3)) ? true : false} 
      logo={true} titleType={1} title={t('prompt.my_prompt_library.title')} 
      help={true} Feedback={true} helpTitle={t('prompt.my_prompt_library.help.title')} helpContent={t('prompt.my_prompt_library.help.content')}>
      {isLoggedIn && user?.accountType == 'corp' &&
      (  
      <div className="d-flex justify-content-center">
        <div className="mb-3 w-75">
            <input type="range" className="form-range bc-range" {...register('libType')} min="0" max="1" step="1" value={libSwitch.switchVal} id="libType" onChange={selectAccType} />
            <div className="d-flex justify-content-between">
              <TooltipComponent title={t('text.personal.tooltip')}>
                  <small>{t('text.personal.label')}</small>
                </TooltipComponent>
                <TooltipComponent title={t('text.business.tooltip')}>
                  <small>{t('text.business.label')}</small>
                </TooltipComponent>
            </div>
          </div>
        </div>
      )}
      {isSuccess && sortingData && sortingData.length > 0 &&
        <h6 className="mb-3 d-flex justify-content-evenly">
          <TooltipComponent title={t('links.alphabetical_sort.tooltip')}>
            <span className="cursor-pointer" onClick={() => handleToggle("alphabetical")}>
              {t('links.alphabetical_sort.label')}
            </span>
          </TooltipComponent>
          &nbsp; | &nbsp;
          <TooltipComponent title={t('links.newest_sort.tooltip')}>
            <span className="cursor-pointer" onClick={() => handleToggle("newest_date")}>
              {t('links.newest_sort.label')}
            </span>
          </TooltipComponent>
          &nbsp; | &nbsp;
          <TooltipComponent title={t('links.updated_sort.tooltip')}>
            <span className="cursor-pointer" onClick={() => handleToggle("updated_date")}>
            {t('links.updated_sort.label')}
            </span>
          </TooltipComponent>
        </h6>
      }
      <div className="overflow-auto scrollbar h-35vh">
         {isLoading 
        ? (
          <p>{t('prompt.personal_library_loading')}</p>
        ) 
        : isSuccess && sortingData && sortingData.length > 0  ?
        (sortingData.map((prompt: any, index: number) => (
            <h6 
              className="cursor-pointer mb-3" 
              key={index} 
              onClick={() => {
                props.onLibraryTypeChange();
                if (props?.actionURL) {
                  navigate(`${props?.actionURL}/${prompt?.GPTBLUEPROMPTID}`);
                } else {
                  navigate(`/app/askgpt/${prompt.URLCODE}`);
                }
              }}
            >
              <div className="row g-0">
                <div className="col-auto">
                  {prompt?.BLUEPROMPT == 1 ? <TooltipComponent title={t('images.bluePromptFlag.tooltip')}><img src={Flag} className='h-1 cursor-pointer'/></TooltipComponent> : <div style={{width:'1.1rem'}}></div>}
                </div>
                <div className="col">
                  <TooltipComponent title={prompt?.PROMPTDESCRIPTION? prompt?.PROMPTDESCRIPTION : 'No description available'}>  
                    {prompt?.PROMPTNAME ? prompt?.PROMPTNAME : '-'}
                  </TooltipComponent>
                </div>
              </div>
            </h6>
          ))
        ) 
        : 
        (
          <p dangerouslySetInnerHTML={{ __html: user.libraryType == 'personal' ? t('prompt.personal_library_empty') : t('prompt.org_library_empty') }}></p>
        )
        }
      </div>
    </Card>
  )
};
export default PromptList;
