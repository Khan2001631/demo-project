import React, { useEffect, useState } from 'react';
import Card from '../../common/card/card';
import { useTranslation } from 'react-i18next';
import { useGetCountryListMutation, useGetOrgnizationsListMutation } from '../../../api-integration/secure/secure';
import { fullPageLoader } from '../../../api-integration/commonSlice';
import { useDispatch } from 'react-redux';
import TooltipComponent from '../../common/bootstrap-component/tooltip-component';
import DateTimeComponent from '../../common/date-time/date-time';

interface iTeamSelectionProps {
    onCountryChange: (selectedCountryCode: string, selectedCountryText: string) => void;
    onOrgChange: (selectedOrgId: string, selectedOrgText: string) => void;
}
const TeamSelection: React.FC<iTeamSelectionProps> = ({ onCountryChange, onOrgChange }) => {
    const{t} = useTranslation();
    const dispatch = useDispatch();
    
    const [countryListAPI, { data: countryListData, isLoading: isCountryListLoading, isSuccess: isCountryListSuccess, isError: isCountryListError  }] = 
    useGetCountryListMutation();

    const [getOrgnizationsListAPI, {data: orgListData, isLoading: isOrgListLoading, isSuccess: isOrgListSuccess, isError: isOrgListError, error: orgListError}] =
    useGetOrgnizationsListMutation();

    useEffect(() => {
        dispatch(fullPageLoader(true));
    
        Promise.all([
            countryListAPI({}), // Fetch country list
            getOrgnizationsListAPI({orgID: 0}) // Fetch org list
        ])
        .then(([countryListData, orgListData]) => {
            // Handle success here. The data from the country list API is in countryListData,
            // and the data from the org list API is in orgListData.
            dispatch(fullPageLoader(false));
        })
        .catch((error) => {
            // Handle error here. If any of the promises reject, this block will be executed.
            dispatch(fullPageLoader(false));
        })
        .finally(() => {
            dispatch(fullPageLoader(false));
        });
    }, []);
    
    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountryCode = event.target.value;
        const selectedCountryText = event.target.options[event.target.selectedIndex].text;
        onCountryChange(selectedCountryCode, selectedCountryText);
    };
    const handleOrgChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOrgId = event.target.value;
        const selectedOrgText = event.target.options[event.target.selectedIndex].text;
        onOrgChange(selectedOrgId, selectedOrgText);
    }

    return (
        <Card id='teamManagement_OurTeam' like={false} share={false} help={true} helpTitle={t('card.team_selection.help.title')} helpContent={t('card.team_selection.help.content')} titleType={1} title={t('card.team_selection.title')} Feedback={true} logo={true}>
            <div >
                <div>{t('prompt_library.filter.text')}:</div>
                <div className='mt-3'>
                    {isCountryListLoading ? (
                        <p>{t('message.loading')}</p>
                    ) : (
                        <div className="mb-3">
                            <label htmlFor='filterCountry' className="form-label">{t('inputs.select.country.label')}</label>
                            <select className="form-select" id="filterCountry" onChange={handleCountryChange}>
                                <option value=''>{t('inputs.select.country.default_option')}</option>
                                {isCountryListSuccess && countryListData && countryListData.countryData && countryListData?.countryData.map(({ country_ID, country_code, country }: { country_ID: number; country_code: string; country:string;}) => (
                                    <option key={country_ID} value={country_code}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className='mt-3'>
                    {isOrgListLoading ? (
                        <p>{t('message.loading')}</p>
                    ) : (
                        <div className="mb-3">
                            <label htmlFor='filterOrg' className="form-label">{t('inputs.select.org.label')}</label>
                            <select className="form-select" id="filterOrg" onChange={handleOrgChange}>
                                <option value=''>{t('inputs.select.org.default_option')}</option>
                                {isOrgListSuccess && orgListData && orgListData.orgData && orgListData?.orgData.map(({ orgId, orgDepartmentName }: { orgId: number; orgDepartmentName:string;},index:number) => (
                                    <option key={index} value={orgId}>
                                        {orgDepartmentName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
            <div className="my-4 text-center">
                <TooltipComponent title={t('prompt.home.time_tooltip')} >
                    <button type="button" className="btn btn-primary btn-md rounded-pill px-4">
                        < DateTimeComponent />
                    </button>
                </TooltipComponent>
            </div>
        </Card>
    );
};

export default TeamSelection;