import React, { useEffect, useState } from 'react';
import Like from '../../../assets/icons/like.svg';
import LikeFilled from '../../../assets/icons/like-filled.svg';
import Plus from '../../../assets/icons/plus.svg';
import Share from '../../../assets/icons/share.svg';
import Logo from '../../../assets/images/logo.png';
import Settings from '../../../assets/icons/settings.svg';
import Help from '../../../assets/icons/help.svg';
import FeedbackIcon from '../../../assets/icons/feedback.svg';
import Logout from '../../../assets/icons/logout.svg';
import Home from '../../../assets/icons/home.svg';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRateCardMutation } from '../../../api-integration/public/public';
import { updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired } from '../../../api-integration/commonSlice';
import TooltipComponent from '../bootstrap-component/tooltip-component';
import SocialShare from '../modal/social-share';
import CogWheelSvg from '../icons/cog-wheel-svg';
const HelpModal = React.lazy(() => import('../help-modal/help-modal'));

interface Props {
  id: string,
  children?: any,
  title?: string,
  titleType?: number,
  cardHeightClass?: string,
  cardGlow?: boolean,
  cardPadding?: string,
  like?: boolean,
  share?: boolean,
  home?: boolean;
  homeDisabled?: boolean;
  logo?: boolean,
  settings?: boolean,
  settingsDisabled?: boolean,
  help?: boolean,
  Feedback?: boolean,
  logout?: boolean,
  helpTitle?: string,
  bottomTextFlag?: boolean,
  bottomText?: string,
  helpContent?: string,
  plus?: boolean,
  plusDisabled?: boolean,
  plusUrl?: string,
  onLogout?: () => void,
  settingsClicked?: () => void
}

const Card = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const params = useParams();
  const { protocol, host } = window.location;
  const navigate = useNavigate();
  const helpModalId = `${props.id}_help`;
  const socialShareModalId = `${props.id}_socialShare`;
  const [liked, setLiked] = useState<boolean>(false);
  const [rateCardPayload, setRateCardPayload] = useState<any>()
  const [functionToCallAfterRefresh, setFunctionToCallAfterRefresh] = useState<any>('')
  const { children, title, titleType, cardHeightClass, cardGlow, cardPadding, like, share, logo, settings, help, home, Feedback, logout, plus, plusUrl, plusDisabled, settingsDisabled, onLogout, bottomTextFlag, bottomText } = props;
  const {  TileInfo } = useSelector((state: any) => state.commonSlice);
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const { isSessionExpired, user} = useSelector((state: any) => state.commonSlice);
  const [localConstTileCode, setLocalConstTileCode] = useState<string>('');
  const [localConstTileShareTitle, setLocalConstTileShareTitle] = useState<string>('');
  const [localConstTileShareDesc, setLocalConstTileShareDesc] = useState<string>('');
  const [localConstTileShareUrl, setLocalConstTileShareUrl] = useState<string>('');
  const [localConstTileShareImageUrl, setLocalConstTileShareImageUrl] = useState<string>('');
  const [localParamId, setLocalParamId] = useState<string>('');
  const [cogWheelColor, setCogWheelColor] = useState<string>('#007dba');
  const [cogWheelTooltip, setCogWheelTooltip] = useState<string>(t('card.common.icon.tooltip.setting'));
  const [rateCardAPI, { data: rateCardResposne, isLoading: isRateCardLoading, isSuccess: isRateCardSuccess, isError: isRateCardError, error: rateCardError }] =
    useRateCardMutation();

  const settingsClicked = () => {
    if (props.settingsClicked && typeof props.settingsClicked === 'function') {
      props.settingsClicked();
    }
  }

  const RateCard = (data: number) => {
    const payload = {
      "tileCode": props?.id,
      "userRating": data
    }
    setRateCardPayload(payload)
    rateCardAPI(payload)
  }

  useEffect(() => {
    if(user?.isProfileComplete == false && props?.id == 'user_profile') {
      setCogWheelColor('var(--bs-danger)');
      setCogWheelTooltip(t('card.common.icon.tooltip.new_user_setting'));
    }
    else{
      setCogWheelColor('var(--bs-secondary)');
      setCogWheelTooltip(t('card.common.icon.tooltip.setting'));
    }
  }, [user?.isProfileComplete])

  useEffect(() => {
    if (params?.id) {
      setLocalParamId(params?.id);
    }
    else {
      setLocalParamId('');
    }
  }, [params?.id])

  useEffect(() => {
    if (isRateCardSuccess) {
      if (rateCardResposne?.statusCode == 200 && rateCardResposne?.success == true) {
        setLiked(!liked)
      }
      else if (rateCardResposne?.statusCode == 401) {
        dispatch(updateIsSessionExpired(true));
        dispatch(updateReloadPageAfterSessionExpired(false));
        setFunctionToCallAfterRefresh('rate');
      }
      else {
        dispatch(updateAlertMessage({ status: 'error', message: rateCardResposne?.message }));
      }
    }
    if (isRateCardError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('message.error_rating_card') }));
    }
  }, [isRateCardSuccess, isRateCardLoading, isRateCardError])

  useEffect(() => {
    if (isSessionExpired == false && functionToCallAfterRefresh != '') {
      if (functionToCallAfterRefresh == 'rate') rateCardAPI(rateCardPayload);
    }
  }, [isSessionExpired])

  useEffect(() => {
    TileInfo?.map((item: any, i: number) => {
      if (item?.tileCode == props?.id) {
        setLiked(item?.tileRating == 1 ? true : false);
        setLocalConstTileCode(item?.tileCode);
        setLocalConstTileShareTitle(item?.shareTitle);
        setLocalConstTileShareDesc(item?.shareDescription);
        setLocalConstTileShareUrl(`${protocol}//${host}${item?.shareURL}`);
        setLocalConstTileShareImageUrl(`${protocol}//${host}${item?.shareImageURL}`);
      }
    });
  }, [props?.id, TileInfo])
  

  return (
    <>
      <div className={`card ${cardGlow ? 'bc-card-glow' : ''} ${cardHeightClass ? cardHeightClass : ''}`} id={props?.id}>
        <div className="card-head">
          <div className='row'>
            <div className='col text-start'>
              {
                title &&
                <>
                  {
                    titleType == 1 &&
                    <h5 className="card-title bc-line-before ms-3">
                      {title}
                    </h5>
                  }
                  {
                    titleType == 2 &&
                    <h6>
                      {title}
                    </h6>
                  }
                </>
              }
            </div>
            {
              (like || share) &&
              <div className="col text-end">
                {/* {like && isLoggedIn && <img src={Like} className={`icon ${isRateCardLoading ? '' : 'disabled-item'}`} onClick={() => RateCard(1)} />} */}
                {like && isLoggedIn &&
                  <div className="d-inline-block">
                    <TooltipComponent title={liked ? t('card.common.icon.tooltip.dislike') : t('card.common.icon.tooltip.like')} >
                      <img src={liked ? LikeFilled : Like} className={`icon cursor-pointer ${isRateCardLoading ? 'disabled-item' : ''}`} onClick={() => RateCard(liked ? 0 : 1)} />
                    </TooltipComponent>
                  </div>
                }
                {share &&
                  <div className="d-inline-block">
                    <TooltipComponent title={t('icons.social_share.tooltip')} >
                      <img src={Share} className='icon cursor-pointer' 
                        data-bs-toggle="modal" 
                        data-bs-target={`#${socialShareModalId}`}
                      />
                    </TooltipComponent>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <div className={`card-body ${cardPadding ? props.cardPadding : 'p-3'}`}>
          {children}
        </div>
        {
          (settings || help || Feedback || logout || logo || home) &&
          <div className="card-footer">
            <div className='d-flex justify-content-between'>
              <div>
                {Feedback && <div className="d-inline-block"><TooltipComponent title={t('card.common.icon.tooltip.feedback')} ><img src={FeedbackIcon} className='icon cursor-pointer' /></TooltipComponent></div>}
                {help && 
                <div className="d-inline-block">
                  <TooltipComponent title={t('card.common.icon.tooltip.help')} >
                    <img src={Help} className='icon cursor-pointer' 
                      data-bs-toggle="modal" 
                      data-bs-target={`#${helpModalId}`} 
                    />
                  </TooltipComponent>
                </div>}
                {settings && 
                  <div className="d-inline-block icon">
                    <TooltipComponent title={cogWheelTooltip} >
                      <span className={`cursor-pointer ${settingsDisabled ? 'disabled-item' : ''}`} onClick={settingsClicked}>
                        <CogWheelSvg color={cogWheelColor} />
                      </span>
                      {/* <img src={Settings} className={`icon cursor-pointer ${settingsDisabled ? 'disabled-item' : ''}`} onClick={settingsClicked} /> */}
                    </TooltipComponent>
                  </div>
                }
                {plus && <div className="d-inline-block"><TooltipComponent title={title + ' ' + t('icons.new_prompt.tooltip')} ><NavLink to={plusUrl ?? ''} ><img src={Plus} className={`icon cursor-pointer ${props?.plusDisabled ? 'disabled-item' : ''}`} /></NavLink></TooltipComponent></div>}
                {home && <div className="d-inline-block"><TooltipComponent title={t('card.common.icon.tooltip.home')} ><img src={Home} className={`icon cursor-pointer ${props?.homeDisabled ? 'disabled-item' : ''}`} onClick={() => navigate('/home')} /></TooltipComponent></div>}
                {logout && <div className="d-inline-block"><TooltipComponent title={t('card.common.icon.tooltip.logout')} ><img src={Logout} className='icon cursor-pointer ms-3 me-0' onClick={onLogout} /></TooltipComponent></div>}
              </div>
              <div >
                {
                  bottomTextFlag &&
                  <h6>
                    {bottomText}
                  </h6>
                }
              </div>

              {logo &&
                <span>
                  { user?.blcFlag == true ? 
                    <TooltipComponent title={t('images.logo.tooltip')} >
                      <a href={process.env.REACT_APP_CF_ROOT_URL + '_/apps/AppsBizz/iims/admin/adm_home.cfm'}>
                        <img src={Logo} className='icon logo cursor-pointer' />
                      </a>
                    </TooltipComponent>
                  :
                    <img src={Logo} className='icon logo' />
                  }
                </span>
              }
            </div>
          </div>
        }
      </div>
      <HelpModal title={props?.helpTitle} content={props?.helpContent} id={helpModalId} />
      <SocialShare id={socialShareModalId} tileShareCode={localConstTileCode} tileShareTitle={localConstTileShareTitle} tileShareDesc= {localConstTileShareDesc} tileShareUrl={localConstTileShareUrl} tileShareImageUrl={localConstTileShareImageUrl} tileShareParamId={localParamId}/>
    </>
  )
}
export default Card;