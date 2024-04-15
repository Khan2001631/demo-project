import { t } from "i18next";
import Card from "../card/card";
import { useEffect, useState } from "react";
import { fullPageLoader, updateAlertMessage } from "../../../api-integration/commonSlice";
import { usePromptStatisticsMutation } from "../../../api-integration/secure/prompts";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { convertToThousands } from "../../../util/util";
import TooltipComponent from "../bootstrap-component/tooltip-component";
import React from "react";

const Statistics = (props: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const params = useParams();

  const [getPromptsStatisticsAPI, { data: prompts, isLoading, isSuccess, isError, error }] =
  usePromptStatisticsMutation();
  
  useEffect(() => {
    dispatch(fullPageLoader(true));
    getPromptsStatisticsAPI({ GPTBluePromptId: Number(params?.id), statsType: props?.statsType});
  }, [props.reloadCheck])


  useEffect(() => {
  	if(props.reloadCheck){
      props.handleReloadCheck(false)
    }
    if (isSuccess || isError) {
      dispatch(fullPageLoader(false));
    }
    if (isError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('prompt.analytics_fetch_error') }));
    }
    if (isSuccess) {
      if (prompts?.success == false && prompts?.statusCode != 401) {
        if (prompts?.status == 'FETCH_ERROR' || prompts?.status == 'PARSING_ERROR') {
          dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
        } else {
          dispatch(updateAlertMessage({ status: 'error', message: prompts?.message }));
        }
      }
    }
  }, [isSuccess, isError]);
  
  return (
    <Card id={props?.id} titleType={1} title={t('card.analytics.title')} help={true} Feedback={true} logo={true} like={true} share={props.statsType=="corp"? false : true} cardHeightClass={props?.cardHeightClass} helpTitle={t('card.analytics.help.title')} helpContent={t('card.analytics.help.content')}>
      {prompts?.promptStats &&
        <div className="table-responsive">
          <table className="mb-4">
            <tbody>
              {Object.keys(prompts?.promptStats).map((key: any, index: number) => (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan={2}>
                      <h5 className="bc-line-before mb-3">{key}</h5>
                    </td>
                  </tr>
                    {prompts?.promptStats[key] && Object.keys(prompts?.promptStats[key]).map((element, innerIndex) => {
                      return (       
                        <tr key={innerIndex}>
                          <td className="text-end text-nowrap">
                            <TooltipComponent title={prompts?.promptStats[key][element]?.title ? prompts?.promptStats[key][element]?.title : ''}>
                              <strong>{prompts?.promptStats[key][element]?.count ? convertToThousands(prompts?.promptStats[key][element]?.count) : '0'}</strong>
                            </TooltipComponent>
                          </td>
                          <td className="text-nowrap ps-2">
                            <TooltipComponent title={prompts?.promptStats[key][element]?.title ? prompts?.promptStats[key][element]?.title : ''}>
                              {prompts?.promptStats[key][element]?.label}
                            </TooltipComponent>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))
              }
            </tbody>
          </table>
        </div>
      }
    </Card>
  )
}

export default Statistics;
