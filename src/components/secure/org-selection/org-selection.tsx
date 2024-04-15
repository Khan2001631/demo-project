import React, { useEffect } from 'react';
import Card from '../../common/card/card';
import { useGetOrgnizationsListMutation } from '../../../api-integration/secure/secure';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fullPageLoader } from '../../../api-integration/commonSlice';


interface OrgSelectionProps {
    triggerReload: boolean;
    onOrgSelect: (orgId: number) => void;
    onOrgListData: (orgListData: any) => void;
}

const OrgSelection: React.FC<OrgSelectionProps> = ({ triggerReload, onOrgSelect, onOrgListData}) => {
    const{t} = useTranslation();
    const dispatch = useDispatch();
    //console.log('triggerReload=>>>', triggerReload);
    
    const [getOrgnizationsListAPI, {data: orgListData, isLoading: isOrgListLoading, isSuccess: isOrgListSuccess, isError: isOrgListError, error: orgListError}] =
    useGetOrgnizationsListMutation();

    useEffect(() => {
        dispatch(fullPageLoader(true));
        getOrgnizationsListAPI({orgID: 0}); // Fetch org list
    }, [triggerReload]);

    useEffect(() => {
        if(isOrgListSuccess || isOrgListError || orgListError) {
            dispatch(fullPageLoader(false));
        }
    }, [isOrgListSuccess, orgListError, isOrgListError]);

    useEffect(() => {
        if (isOrgListSuccess && orgListData) {
          onOrgListData(orgListData);
        }
    }, [isOrgListSuccess, orgListData]);

    return (
        <Card id="organizationManagement_OurOrganizations" help={true} helpTitle={t('card.our_orginazation.help.title')} helpContent={t('card.our_orginazation.help.content')} titleType={1} title={t('card.our_orginazation.title')} Feedback={true} logo={true}>
            <p>List of Organizations</p>
            {isOrgListLoading ? (
                <p>{t('message.loading')}</p>
            ) : (
                <div className="mb-3">
                    <ul>
                        {isOrgListSuccess && orgListData && orgListData?.orgData && orgListData?.orgData.map(({ orgId, orgDepartmentName }: { orgId: number, orgDepartmentName: string }, index: number) => (
                            <li key={index} >
                                <span className='cursor-pointer' onClick={() => onOrgSelect(orgId)}>{orgDepartmentName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
};

export default OrgSelection;