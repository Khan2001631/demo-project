import React, { useEffect } from 'react';
import { IconType } from 'react-icons';
import { FaTwitter, FaEnvelope, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import { draggableBootstrapModal } from './draggable-modal';
import TooltipComponent from '../bootstrap-component/tooltip-component';
import { useTranslation } from 'react-i18next';
import { useGetUserProfileMutation, useGptBlueSocialShareMutation } from '../../../api-integration/secure/secure';
import { useDispatch } from 'react-redux';
import { fullPageLoader, updateAlertMessage, updateUser } from '../../../api-integration/commonSlice';


interface SocialShareProps {
    id: string;
    tileShareCode: string;
    tileShareTitle: string;
    tileShareDesc: string;
    tileShareUrl: string;
    tileShareImageUrl: string;
    tileShareParamId: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ id, tileShareCode, tileShareTitle, tileShareDesc, tileShareUrl, tileShareImageUrl, tileShareParamId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [gptBlueSocialShareAPI, { data: socialShareData, isLoading: isSocialShareLoading, isSuccess: isSocialShareSuccess, isError: isSocialShareError, error: socialShareError}] = 
        useGptBlueSocialShareMutation();
    const [getUserDetailsAPI, { data: userInfo, isLoading: isUserDetailLoding, isSuccess: isUserDetailSuccess, isError: isUserDetailError, error: userDetailError  }] =
        useGetUserProfileMutation();
    
    const title = tileShareTitle;
    const description = tileShareDesc;
    const shareURL = tileShareUrl;
    const content = `${tileShareTitle}\n${description}\n${tileShareUrl}`;
    const imageUrl = tileShareImageUrl;
    

    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
          draggableBootstrapModal(modalElement);
        }
    }, [id]);

    const shareToNetwork = (network: string) => {
        let url = '';
    
        switch (network) {
            case 'Twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
                dispatch(fullPageLoader(true));
                gptBlueSocialShareAPI({"socialnet": "Twitter", "tileCode": tileShareCode });
                break;
            case 'Email':
                const additionalContent = 'This is additional content for the email body.';
                url = `mailto:?subject=${encodeURIComponent('I would like to share this with you')}&body=${encodeURIComponent(content + '\n\n' + additionalContent)}`;
                dispatch(fullPageLoader(true));
                gptBlueSocialShareAPI({"socialnet": "Email", "tileCode": tileShareCode });
                break;
            case 'Facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content)}`;
                dispatch(fullPageLoader(true));
                gptBlueSocialShareAPI({"socialnet": "Facebook", "tileCode": tileShareCode });
                break;
            case 'LinkedIn':
                //url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(content)}`;
                url= `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareURL)}`;
                dispatch(fullPageLoader(true));
                gptBlueSocialShareAPI({"socialnet": "LinkedIn", "tileCode": tileShareCode });
                break;
            case 'WhatsApp':
                url = `https://api.whatsapp.com/send?text=${encodeURIComponent(content)}`;
                dispatch(fullPageLoader(true));
                gptBlueSocialShareAPI({"socialnet": "WhatsApp", "tileCode": tileShareCode });
                break;
            default:
                break;
        }
        window.open(url, '_blank');
    };
    useEffect(() => {
        if (isSocialShareSuccess && socialShareData) {
            dispatch(fullPageLoader(true));
            getUserDetailsAPI({accountType: 'user'});
        }
        if (isSocialShareSuccess || isSocialShareError || socialShareError) {
            dispatch(fullPageLoader(false));
        }
    }, [isSocialShareSuccess, isSocialShareError, socialShareError]);

    useEffect(() => {
        if (isUserDetailSuccess) {
            dispatch(fullPageLoader(false));
            let user = JSON.parse(localStorage.getItem('user') as string);
            user.totalCCPoints = userInfo?.user?.totalCCPoints;
            dispatch(updateUser(user));
            localStorage.setItem('user', JSON.stringify(user));
        }
        if (isUserDetailError || userDetailError) {
            dispatch(fullPageLoader(false));
            //dispatch(updateAlertMessage({ status: 'error', message: userInfo?.message }));
        }
    }, [isUserDetailSuccess, isUserDetailError, userDetailError]);

    // color="#3b5998" -- Facebook's brand color
    // color="#1DA1F2" -- Twitter's brand color
    // color="#D44638" -- Gmail's brand color
    // color="#25D366" -- WhatsApp's brand color
    // color="#0077B5" -- LinkedIn's brand color

    //FaTwitter
    const XTwitterIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="35" height="35">
          <path fill="white" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
        </svg>
    );

    const socialPlatforms = [
        { icon: FaLinkedinIn, label: 'LinkedIn', onClick: () => shareToNetwork('LinkedIn'), color: '#0077B5', size: 38 },
        { icon: FaWhatsapp, label: 'WhatsApp', onClick: () => shareToNetwork('WhatsApp'), color: '#25D366', size: 38 },
        { icon: XTwitterIcon, label: 'Twitter', onClick: () => shareToNetwork('Twitter'), color: '#000000', size: 38 },
        { icon: FaEnvelope, label: 'Email', onClick: () => shareToNetwork('Email'), color: 'var(--bs-dark)', size: 38 },
    ];

    return (
        <div className="modal fade modal-draggable" data-bs-backdrop="false" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog modal-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}Label`}>
                            Social Share
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    
                    <div className="modal-body" >
                        {/* id = {id}<br/>
                        tileShareTitle = {tileShareTitle}<br/>
                        tileShareDesc= {tileShareDesc}<br/>
                        tileShareUrl = {tileShareUrl}<br/>
                        tileShareImageUrl= {tileShareImageUrl}<br/>
                        tileShareParamId= {tileShareParamId} */}
                        <div className='d-flex justify-content-evenly'>
                        {socialPlatforms.map((platform, index) => {
                            const Icon = platform.icon;
                            return (
                                <div className='px-3 d-flex flex-column align-items-center' key={index} onClick={platform.onClick}>
                                    <div style={{ borderRadius: '50%', width: '60px', height: '60px', background: platform.color, display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon size={platform.size} color="white" />
                                    </div>
                                    {platform.label}
                                </div>
                            );
                        })}
                        </div>
                        <div className="modal-footer mt-3">
                            <TooltipComponent title={t('buttons.social_share_close.tooltip')}>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                    {t('buttons.social_share_close.label')}
                                </button>
                            </TooltipComponent>
                        </div>
                    </div>
                    

                </div>
            </div>
        </div>
    );
};

export default SocialShare;