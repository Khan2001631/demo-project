import { useTranslation } from 'react-i18next';
import { AskGPTMessages, convertMarkdownToHtml, convertToThousands } from '../../../../util/util';
import Email from '../../../../assets/icons/email.svg';
import Like from '../../../../assets/icons/like.svg';
import Dislike from '../../../../assets/icons/dislike.svg';
import LikeFilled from '../../../../assets/icons/like-filled.svg';
import DislikeFilled from '../../../../assets/icons/dislike-filled.svg';
import Tab from '../../../../assets/icons/tab.svg';
import Comment from '../../../../assets/icons/comment.svg';
import Editor, { BtnBold, BtnItalic, EditorProvider, Toolbar } from 'react-simple-wysiwyg';
import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Card from '../../../common/card/card';
import {usePromptStatisticsMutation } from "../../../../api-integration/secure/prompts";
import { useGetUserProfileMutation } from '../../../../api-integration/secure/secure';
import { fullPageLoader, updateAlertMessage, updateUser, updateTileInfo } from "../../../../api-integration/commonSlice";
import TooltipComponent from '../../../common/bootstrap-component/tooltip-component';
import { useCommentPromptMutation, useGeneratePdfMutation, useRatePromptMutation, useSendAIResponseEmailMutation } from '../../../../api-integration/public/common';
import SendCommentModal from '../../../common/modal/send-comment';
import { Modal } from "bootstrap";
import SendEmailModal from "../../../common/modal/send-email";

const AiResponse = (props: any) => {
  const promptId = props?.prompt?.GPTBLUEPROMPTID;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const params = useParams();
  const [html, setHtml] = useState<any>();
  const [totalCCUsed, setTotalCCUsed] = useState('0');
  const [averageCCUsed, setAverageCCUsed] = useState('0');
  
  const sendCommentModalId = "sendCommentModal";
  const sendEmailModalId = "sendEmailModal";
  const emailPattern = /\S+@\S+\.\S+/;
  const [userEmail, setUserEmail] = useState('');
  const [thumbsUpIcon, setThumbsUpIcon] = useState(Like);
  const [thumbsDownIcon, setThumbsDownIcon] = useState(Dislike);
  
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userRating, setUserRating] = useState('0');
  const [userRatingDown, setUserRatingDown] = useState('1');
  
  const [userComment, setUserComment] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [likeDislikeEvent, setLikeDislikeEvent] = useState('');

  const [localUserFirstPromptId, setLocalUserFirstPromptId] = useState(0);

  const [randomMsg, setRandomMsg] = useState(AskGPTMessages[0]);
  let myInterval: any;
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const [isHidden, setIsHidden] = useState(props?.isLibraryTypeChanged);
      
  const [RateGPTResponse, { data: rateResponse, isLoading: isRateLoading, isSuccess: isRateSuccess, isError: isRateError, error: rateError }] = useRatePromptMutation()
  const [contentHeight, setContentHeight] = useState<number | string>(0);

  const [getUserDetailsAPI, { data: userInfo, isLoading: isUserDetailLoding, isSuccess: isUserDetailSuccess, isError  }] =
    useGetUserProfileMutation();

  const [generatePdfAPI, { data: pdfResponse, isLoading: isPdfLoading, isSuccess: isPdfSuccess, isError: isPdfError, error: pdfError }] = useGeneratePdfMutation()
  const [SendAIResponseEmail, { data: sendAIResponseEmailResponse, isLoading: isSendLoading, isSuccess: isSendSuccess, isError: isSendError, error: err }] =
  useSendAIResponseEmailMutation();
  const [getPromptsStatisticsAPI, { data: promptStats, isLoading, isSuccess: promptStatsIsSuccess, isError: promptStatsIsError, error }] =
    usePromptStatisticsMutation();
  const [commentAPI, { data: commentResposne, isLoading: isCommentLoading, isSuccess: isCommentSuccess, isError: isCommentError, error: ommentError }] =
    useCommentPromptMutation();

  const SetMessages = () => {
    setRandomMsg(AskGPTMessages[Math.floor(Math.random() * 2) + 1])
  }

  const onChange = (e: any) => {
    setHtml(e.target.value)
  }
  const rateGptBlue = async (rateVal: string) => {
    // dispatch(fullPageLoader(true));
    setUserRating(rateVal)
    setLikeDislikeEvent('like');
   RateGPTResponse({ userPromptId: props?.askGPTResponse?.userPromptId ? props?.askGPTResponse?.userPromptId : props?.askGPTResponse?.userPromptId, userRating: rateVal })
  }
  const rateDownGptBlue = async (rateVal: string) => {
    // dispatch(fullPageLoader(true));
    setUserRatingDown(rateVal)
    setLikeDislikeEvent('dislike');
    RateGPTResponse({ userPromptId: props?.askGPTResponse?.userPromptId ? props?.askGPTResponse?.userPromptId : props?.askGPTResponse?.userPromptId, userRating: rateVal })
  }
  const sendEmailDirectly = () => {
    dispatch(fullPageLoader(true));
    let user = JSON.parse(localStorage.getItem('user') as string) || {};
    const aiResponse = props?.askGPTResponse?.aiResponse? props?.askGPTResponse?.aiResponse:""
    sendAIResponseEmail({ GPTBlueUserPrompt: props?.prompt?.PROMPTNAME, GPTBlueUserEmail: user?.userEmail, userPromptId: props?.askGPTResponse?.userPromptId ? props?.askGPTResponse?.userPromptId : props?.askGPTResponse?.userPromptId, GPTBlueResponse: convertMarkdownToHtml(aiResponse, 'stdText') })
  }
  const sendEmail = () => {
    if (userEmail.length > 0 && emailPattern.test(userEmail)) {
      setEmailError(false);
      dispatch(fullPageLoader(true));
      sendAIResponseEmail({ 
        GPTBlueUserPrompt: props?.prompt?.PROMPTNAME, 
        GPTBlueUserEmail: userEmail, 
        userPromptId: props?.askGPTResponse?.userPromptId ? props?.askGPTResponse?.userPromptId : props?.askGPTResponse?.userPromptId, 
        GPTBlueResponse: props?.askGPTResponse?.aiResponse 
      })
      .then(() => {
        // Close the modal manually
        var myModalEl = document.getElementById(sendEmailModalId)
        if (myModalEl) {
          var modal = Modal.getInstance(myModalEl)
          modal?.hide()
        }
      })
    } else {
      setEmailError(true);
    }
  }

  const sendComment = () => {
    if (userComment.length > 0) {
      setCommentError(false);
      dispatch(fullPageLoader(true));
      commentAPI({
        "promptResponseId": props?.askGPTResponse?.userPromptId ? props?.askGPTResponse?.userPromptId : props?.askGPTResponse?.userPromptId,
        "userComment": userComment
      })
      .then(() => {
        // Close the modal manually
        var myModalEl = document.getElementById(sendCommentModalId)
        if (myModalEl) {
          var modal = Modal.getInstance(myModalEl)
          modal?.hide()
        }
      })
    } else {
      setCommentError(true);
    }
  }

  const generatePdf = () => {
    dispatch(fullPageLoader(true));
    const aiResponse = props?.askGPTResponse?.aiResponse? props?.askGPTResponse?.aiResponse:""
    generatePdfAPI({ "promptResponseId": props?.askGPTResponse?.userPromptId ? props?.askGPTResponse?.userPromptId : props?.askGPTResponse?.userPromptId, promptResponse: convertMarkdownToHtml(aiResponse, 'stdText') })
  }

  const emailClicked = () => {
    isLoggedIn ? sendEmailDirectly() : setShowEmailModal(true)
  }


  useEffect(() => {
    setIsHidden(props?.isLibraryTypeChanged);
  }, [props?.isLibraryTypeChanged]);


  const sendAIResponseEmail = async (data: any) => {
    dispatch(fullPageLoader(true));
    SendAIResponseEmail(data)
  }

useEffect(() => {
    if (sendAIResponseEmailResponse?.success == true) {
      dispatch(updateAlertMessage({ status: 'success', message: sendAIResponseEmailResponse?.message }))
      dispatch(fullPageLoader(false));
      setShowEmailModal(false)
    }
    else if ((sendAIResponseEmailResponse?.success == false)) {
      dispatch(updateAlertMessage({ status: 'error', message: sendAIResponseEmailResponse?.message }))
      dispatch(fullPageLoader(false));
      setShowEmailModal(false)
    }
  }, [isSendSuccess, isSendError])


  useEffect(() => {
    setTimeout(() => {
      const aiResponseEle = document.getElementById('io_promptResult')!;
      setContentHeight(props?.askGptResponse?.aiResponse ? aiResponseEle?.offsetHeight : '300');
    }, 100);
  }, [props?.askGptResponse]);

  useEffect(() => {
    if (props?.askGPTResponse || props?.refineResults) {
      dispatch(fullPageLoader(false));
    }
    if (props?.askGPTResponse?.aiResponse) {
      setTotalCCUsed('0');
      //setAverageCCUsed('0');
      //getPromptsStatisticsAPI({ GPTBluePromptId: Number(params?.id) });
      getUserDetailsAPI({accountType: 'user'});
      //clearInterval(myInterval);
      setLocalUserFirstPromptId(props?.askGPTResponse?.userPromptId);
      setHtml(convertMarkdownToHtml(props?.askGPTResponse?.aiResponse, 'stdText'));
      setTotalCCUsed(convertToThousands(props?.askGPTResponse?.totalUsedCC));
      //setAverageCCUsed(convertToThousands(props?.askGPTResponse?.averageCC));
    }
    if (props?.askGPTResponse?.aiAdvice) {
      setTotalCCUsed('0');
      //setAverageCCUsed('0');
      //getPromptsStatisticsAPI({ GPTBluePromptId: Number(params?.id) });
      getUserDetailsAPI({});
      //clearInterval(myInterval);
      setLocalUserFirstPromptId(props?.askGPTResponse?.userPromptId);
      setHtml(convertMarkdownToHtml(props?.askGPTResponse?.aiAdvice, 'stdText'));
      setTotalCCUsed(convertToThousands(props?.askGPTResponse?.totalUsedCC));
      //setAverageCCUsed(convertToThousands(props?.askGPTResponse?.averageCC));
    }
    if (props?.refineResults?.aiAdvice) {
      setTotalCCUsed('0');
      //setAverageCCUsed('0');
      //getPromptsStatisticsAPI({ GPTBluePromptId: Number(params?.id) });
      getUserDetailsAPI({});
      //clearInterval(myInterval);
      setHtml(convertMarkdownToHtml(props?.refineResults?.aiAdvice, 'stdText'));
      setTotalCCUsed(convertToThousands(props?.refineResults?.totalUsedCC));
      //setAverageCCUsed(convertToThousands(props?.refineResults?.averageCC));
    }
  }, [props?.askGPTResponse, props?.refineResults])

  useEffect(() => {
    if (isUserDetailSuccess) {
      dispatch(fullPageLoader(false));
      //if(userInfo?.user?.accountType && userInfo?.user?.accountType == 'user') {
      if(isLoggedIn) {
        let user = JSON.parse(localStorage.getItem('user') as string);
        user.totalCCPoints = userInfo?.user?.totalCCPoints;
        dispatch(updateUser(user));
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  }, [isUserDetailSuccess, userInfo])

  useEffect(() => {
    if (rateResponse?.success == true) {
      dispatch(updateAlertMessage({ status: 'success', message: rateResponse?.message }))
      dispatch(fullPageLoader(false));
      if (likeDislikeEvent == 'like') {
        if (userRating == "1") {
          setThumbsUpIcon(LikeFilled)
          if (thumbsDownIcon == DislikeFilled) {
            setThumbsDownIcon(Dislike)
            setUserRatingDown("1")
          }
        }
        else {
          setThumbsUpIcon(Like)
        }
        //getPromptsStatisticsAPI({ GPTBluePromptId: promptId })
        props?.onRatingPrompt()
      }
      if (likeDislikeEvent == 'dislike') {
        if (userRatingDown == '1') {
          setThumbsDownIcon(Dislike)
        } else {
          setThumbsDownIcon(DislikeFilled)
          if (thumbsUpIcon == LikeFilled) {
            setThumbsUpIcon(Like)
            setUserRating("0")
          }
        }
        //getPromptsStatisticsAPI({ GPTBluePromptId: promptId })
        props?.onRatingPrompt()
      }
    }
    else if ((rateResponse?.success == false)) {
      dispatch(updateAlertMessage({ status: 'error', message: rateResponse?.message }))
      dispatch(fullPageLoader(false));
    }

  }, [isRateSuccess, isRateError])

  useEffect(() => {
    if (commentResposne?.success == true) {
      dispatch(updateAlertMessage({ status: 'success', message: commentResposne?.message }))
      dispatch(fullPageLoader(false));
      //getPromptsStatisticsAPI({ GPTBluePromptId: promptId })
      props?.onRatingPrompt()
    }
    else if ((commentResposne?.success == false)) {
      dispatch(updateAlertMessage({ status: 'error', message: commentResposne?.message }))
      dispatch(fullPageLoader(false));
    }

  }, [isCommentSuccess, isCommentError])


  useEffect(() => {
    if (pdfResponse?.success == true) {
      dispatch(updateAlertMessage({ status: 'success', message: pdfResponse?.message }))
      dispatch(fullPageLoader(false));
      // window.open(pdfResponse?.pdfURL, '_blank');
      var file_path = pdfResponse?.pdfURL;
      var a = document.createElement('A') as any;
      a.href = file_path;
      a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    else if ((pdfResponse?.success == false)) {
      dispatch(updateAlertMessage({ status: 'error', message: pdfResponse?.message }))
      dispatch(fullPageLoader(false));
    }
    if (isPdfError) {
      dispatch(fullPageLoader(false));
      dispatch(updateAlertMessage({ status: 'error', message: t('message.generate_pdf_error') }))
    }

  }, [isPdfSuccess, isPdfError])


  useEffect(() => {
    if (promptStatsIsSuccess || promptStatsIsError) {
      dispatch(fullPageLoader(false));
    }
    if (promptStatsIsError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('prompt.analytics_fetch_error') }));
    }
    if (promptStatsIsSuccess) {
      if (promptStats?.success == false && promptStats?.statusCode != 401) {
        if (promptStats?.status == 'FETCH_ERROR' || promptStats?.status == 'PARSING_ERROR') {
          dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
        } else {
          dispatch(updateAlertMessage({ status: 'error', message: promptStats?.message }));
        }
      }
    }
  }, [promptStatsIsSuccess, promptStatsIsError]);

  useEffect(() => {
    myInterval = setInterval(SetMessages, 5000);
  }, [])
  
  useEffect(() => {
    //getPromptsStatisticsAPI({ GPTBluePromptId: promptId });
    setThumbsUpIcon(Like)
    setThumbsDownIcon(Dislike);
    setUserRating('0')
    setUserRatingDown('1')
  }, [props?.askGPTResponse])
  return (
    <>
      <Card id='io_promptResult' titleType={1} cardHeightClass={props?.page == 'dtd' ? '' : 'h-100'} title={t('prompt.card_title_prompt_framing_test_response')} help={true} Feedback={true} logo={true} share={true} helpTitle={props?.page == 'dtd' ? t('prompt.dtd_ai_response.help.title') : t('prompt.io_ai_response.help.title')} helpContent={props?.page == 'dtd' ? t('prompt.dtd_ai_response.help.content') : t('prompt.io_ai_response.help.content')}>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            <div className='fw-bold'>{t('text.total_cc_used.label')}: {totalCCUsed}</div>
            {/* <div className='fw-bold'>{t('text.average_cc_used.label')}: {totalCCUsed}</div> */}
          </div>
          <div className={`text-end ${props?.page === 'dtd' ? 'd-none' : ''} ${(!props?.askGPTResponse || props?.askGPTResponse?.success === false || props?.loading || !params.id) ? 'disabled-item' : ''}`}>
            <div className="d-inline-block text-center px-2">
              <div className="mb-1">{t('icons.like_prompt_response.label')}</div>
              <div className="d-inline-block"><TooltipComponent title={t('icons.like_prompt_response.tooltip')} ><img src={thumbsUpIcon} className='h-1-5 cursor-pointer' onClick={() => rateGptBlue(userRating == "0" ? "1" : "0")} /></TooltipComponent></div>
            </div>
            <div className="d-inline-block text-center px-2">
              <div className="mb-1">{t('icons.dislike_prompt_response.label')}</div>
              <div className="d-inline-block"><TooltipComponent title={t('icons.dislike_prompt_response.tooltip')} ><img src={thumbsDownIcon} className='h-1-5 cursor-pointer' onClick={() => rateDownGptBlue(userRatingDown == "1" ? "0" : "1")} /></TooltipComponent></div>
            </div>
            <div className="d-inline-block text-center px-2">
              <div className="mb-1">{t('icons.comment_prompt_response.label')}</div>
              <div className="d-inline-block">
                <TooltipComponent title={t('icons.comment_prompt_response.tooltip')} >
                  <img src={Comment} className='h-1-5 cursor-pointer' 
                    data-bs-toggle="modal"
                    data-bs-target={`#${sendCommentModalId}`}
                  />
                </TooltipComponent>
              </div>
            </div>
            <div className="d-inline-block text-center px-2">
              <div className="mb-1">{t('icons.email_prompt_response.label')}</div>
              <div className="d-inline-block">
                <TooltipComponent title={t('icons.email_prompt_response.tooltip')} >
                  <img src={Email} className='h-1-5 cursor-pointer' 
                    data-bs-toggle={isLoggedIn ? undefined : "modal"} 
                    data-bs-target={isLoggedIn ? undefined : `#${sendEmailModalId}`} 
                    onClick={isLoggedIn ? emailClicked : undefined}
                  />
                </TooltipComponent>
              </div>
            </div>
            <div className="d-inline-block text-center px-2">
              <div className="mb-1">{t('icons.pdf_prompt_response.label')}</div>
              <div className="d-inline-block"><TooltipComponent title={t('icons.pdf_prompt_response.tooltip')} ><img src={Tab} className='h-1-5 cursor-pointer' onClick={generatePdf} /></TooltipComponent></div>
            </div>
          </div>
        </div>
        {
          !(props?.refineLoading || props?.loading || isHidden) 
          && (
              props?.askGPTResponse?.aiResponse 
                || props?.askGPTResponse?.aiAdvice 
                || props?.refineResults?.aiAdvice) 
            && (
            props?.isIterative ?
              <>
                <div id="AIAdviceResponse" className="m-2 text-break">
                  <EditorProvider>
                  <div className="overflow-auto scrollbar" style={{ height: contentHeight + 'px' }} >
                    <Editor value={html} onChange={onChange}>
                      <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                      </Toolbar>
                    </Editor>
                    </div>
                  </EditorProvider>
                </div>
                <div className="mt-2 text-center">
                  <div className="d-inline-block">
                    <TooltipComponent title={t('prompt.btn.refine_result.tooltip')} >
                      <button type='button' disabled={props?.refineLoading} onClick={() => props.refineResult(html, localUserFirstPromptId)} className={`btn btn-primary btn-md rounded-pill px-5 mt-3 ${props?.refineLoading ? 'disabled' : ''}`} >
                        {t('prompt.btn.refine_result.label')}
                      </button>
                    </TooltipComponent>
                  </div>
                </div>
              </>
              :
              <div className="p-2 table-responsive overflow-auto scrollbar" 
                style={{ height: contentHeight + 'px' }}
                dangerouslySetInnerHTML={{ __html: html }}
              ></div>
        )}
        {
          !(props?.loading || props.refineLoading) && !props?.askGPTResponse && !props?.isAskGPTError &&
          <div id="askGptInfoSection" className="textRed stdText ps-2 py-1">
            {props?.page == 'dtd' ? t('prompt.click_AskGPTBlue') : t('prompt.click_AskGPTBlue_msg2')}
          </div>
        }
        {
          props?.isAskGPTError &&
          <div className="textRed stdText">
            <span className='fw-bold'>{t('message.failed')}</span>
            {t('message.error_try_again')}
          </div>
        }
      
        <div id="gptQuestionResponseSection" className="table-responsive">

        </div>
        {
          (props?.loading || props?.refineLoading) && <div className='ps-2 py-1'>
            <span id="processingMsg" className="textDarkGreen">
              {randomMsg}
              <div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading…</span></div>
            </span>
          </div>
        }
      </Card>
      <SendEmailModal 
        id={sendEmailModalId}
        onSendEmail={sendEmail}
        emailError={emailError}
        setEmailError={setEmailError}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        emailPattern={emailPattern}
      />
      <SendCommentModal 
        id={sendCommentModalId} 
        onSendComment={sendComment}
        commentError={commentError} 
        setCommentError={setCommentError} 
        userComment={userComment} 
        setUserComment={setUserComment}  
      />
    </>
  )
}

export default AiResponse;