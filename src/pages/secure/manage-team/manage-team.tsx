import React, {  useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import UserCard from "../../../components/common/user-card/user-card";
import Statistics from "../../../components/common/statistics/statistics";
import { useDispatch } from 'react-redux';
import { fullPageLoader, updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired, updateUser } from "../../../api-integration/commonSlice";
import Card from '../../../components/common/card/card';
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import Settings from '../../../assets/icons/settings.svg';
import { useGetTeamMutation } from '../../../api-integration/secure/secure';
import ManageTeamDashboard from '../../../components/secure/manage-team-dashboard/manage-team-dashboard';
import Pagination from '../../../components/common/pagination/pagination';
import ManageUserModal from '../../../components/secure/modals/manage-user';
import TeamSelection from '../../../components/secure/team-selection/team-selection';
import UploadUsersModal from '../../../components/secure/modals/upload-users';

type tUser = {
    USERID: number;
    FIRSTNAME: string;
    LASTNAME: string;
    EMAIL: string;
    BIZZEMAIL: string;
    CITY: string;
    COUNTRY: string;
    ROLEID: string[];
    userRoles: any;
    Y_GPTBLUE_ROLES__NAME: string;
};

const ManageTeam:React.FC = ({}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const manageUserModalId = 'manageUserModal';
    const manageUpdateUserModalId = 'manageUpdateUserModal';

    const [currentUser, setCurrentUser] = useState<tUser | null>(null);
    const [selectedCountryCode, setSelectedCountryCode] = useState<string>('');
    const [selectedCountryText, setSelectedCountryText] = useState<string>('All');
    const [selectedOrgId, setSelectedOrgId] = useState<number>(0);
    const [selectedOrgName, setSelectedOrgName] = useState<string>('All');
    const [reloadComponent, setReloadComponent] = useState<boolean>(false);
    const [newUser, setNewUser] = useState(
        {
            USERID: 0, 
            FIRSTNAME: '', 
            LASTNAME: '', 
            EMAIL: '', 
            BIZZEMAIL: '', 
            CITY: '', 
            COUNTRY: '',
            ROLEID: [],
            userRoles: {},
            Y_GPTBLUE_ROLES__NAME: ""
        }
    );

    const [getTeamAPI, {data: teamData, isLoading: isTeamLoading, isSuccess: isTeamSuccess, isError: isTeamError, error: teamError}] = 
    useGetTeamMutation();

    // PAGINATION - State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [currentItems, setCurrentItems] = useState([]);

    useEffect(()=>{
        dispatch(fullPageLoader(true));
        getTeamAPI({userRoleId: 0, userStatusCode: 0, orgid: selectedOrgId, country: selectedCountryCode})
        setReloadComponent(false);
    },[selectedOrgId, selectedCountryCode, reloadComponent])
    
    useEffect(() => {
        if (isTeamSuccess || isTeamError || teamError) {
            dispatch(fullPageLoader(false));
        }
    }, [isTeamSuccess, isTeamError, teamError])

    useEffect(() => {
        if (Array.isArray(teamData?.usersData)) {
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            setCurrentItems(teamData?.usersData.slice(indexOfFirstItem, indexOfLastItem) as never[]);   
        }
    }, [isTeamSuccess, teamData, currentPage, itemsPerPage, dispatch])

    // PAGINATION - Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    const handleSettingsClick = (user: tUser) => {
        setCurrentUser(user);
    };

    const handleCountryChange = (selectedCountryCode: string, selectedCountryText: string) => {
        setSelectedCountryCode(selectedCountryCode);
        setSelectedCountryText(selectedCountryText);
    };
    const handleOrgChange = (selectedOrgId: string, selectedOrgText: string) => {
        setSelectedOrgId(parseInt(selectedOrgId));
        setSelectedOrgName(selectedOrgText);
    }

    return(
        <>
            <div className="container">
                <div className="row mb-3">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-3">
                        <UserCard />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-3">
                        <ManageTeamDashboard id="teamManagement_UserDashboard"
                            accountType="user"
                            title={t('card.org_user_dashboard.title')} 
                            helpTitle={t('card.org_user_dashboard.help.title')} 
                            helpContent={t('card.org_user_dashboard.help.content')}
                        />
                       
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-3">
                        <Statistics id="teamManagement_Analytics" cardHeightClass={'h-100'} statsType="user"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-3">
                        <TeamSelection onCountryChange={handleCountryChange} onOrgChange={handleOrgChange}/>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 mb-3">     
                        <Card id='teamManagement_UserDetails' like={false} share={false} help={true} helpTitle={t('card.user_list.help.title')} helpContent={t('card.user_list.help.content')} titleType={1} title={t('card.user_list.title')} Feedback={true} logo={true}>
                            <h5>{t('inputs.select.country.label')}: {selectedCountryText}</h5>
                            <h5>{t('inputs.select.org.label')}: {selectedOrgName}</h5>
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                    <thead>
                                        <tr>
                                            <th>{t('table.user_image.label')}</th>
                                            <th>{t('table.user_name.label')}</th>
                                            <th>{t('table.prompt_used.label')}</th>
                                            <th>{t('table.prompt_created.label')}</th>
                                            <th>
                                                <TooltipComponent title={t('table.user_ppg.tooltip')}>
                                                    {t('table.user_ppg.label')}
                                                </TooltipComponent>
                                            </th>
                                            <th>{t('table.user_role.label')}</th>
                                            <th>{t('table.user_domain.label')}</th>
                                            <th>{t('table.user_status.label')}</th>
                                            <th>{t('table.user_type.label')}</th>
                                            <th>{t('table.actions.label')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamData && (!currentItems || (currentItems.length == 0) 
                                            ?
                                            (
                                                <tr>
                                                    <td colSpan={10}>
                                                        {t('message.no_record_found')}                               
                                                    </td>
                                                </tr>
                                            ) 
                                            : 
                                            (
                                                currentItems.map((user: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <img src={user.picPath} className="rounded-circle photoCanvas" alt={t('icons.user_image.alt')} />
                                                        </td>
                                                        <td>
                                                            {user.FIRSTNAME} {user.LASTNAME}
                                                        </td>
                                                        <td>
                                                            <div className='text-end'>
                                                                {new Intl.NumberFormat('en-US').format(user.PROMPTUSED)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='text-end'>
                                                                {new Intl.NumberFormat('en-US').format(user.PROMPTCREATED)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='text-end'>
                                                                {new Intl.NumberFormat('en-US').format(user.PROMPTPRODUCTIVITY)}  
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {user.USERROLE}
                                                        </td>
                                                        <td>
                                                            {user.USERDOMAIN}
                                                        </td>
                                                        <td>
                                                            {user.USERSTATUS}
                                                        </td>
                                                        <td>
                                                            {user.USERTYPE}
                                                        </td>
                                                        <td className='text-center'>
                                                            <TooltipComponent title={t('card.common.icon.tooltip.setting')} >
                                                                <img src={Settings} className='h-1-5 cursor-pointer'
                                                                    alt={t('icons.user_image.alt')} 
                                                                    data-bs-toggle="modal" 
                                                                    data-bs-target={`#${manageUserModalId}`}
                                                                    onClick={() => handleSettingsClick(user)} 
                                                                />
                                                            </TooltipComponent>
                                                        </td>
                                                    </tr>
                                                ))
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {isTeamLoading &&
                                <div className="text-center">
                                    {t('message.loading')}
                                </div>}
                            {isTeamSuccess && teamData && teamData?.usersData.length > 0 && 
                                <Pagination
                                    itemsPerPage={itemsPerPage}
                                    totalItems={teamData?.usersData.length}
                                    paginate={paginate}
                                    currentPage={currentPage}
                                    pervNextNavFlag={true}
                                    noOfLinksOnPage={2}
                                    previousText={t('pagination.text.prev')}
                                    nextText={t('pagination.text.next')}
                                />
                            }
                            <div className="row">
                                <div className="col-md-3">
                                    <TooltipComponent title={t('buttons.add_user.tooltip')} >
                                        <button type="button" 
                                            className="btn btn-primary btn-md rounded-pill px-4"
                                            data-bs-toggle="modal" 
                                            data-bs-target={`#${manageUserModalId}`}
                                            onClick={() => handleSettingsClick(newUser)} 
                                        >
                                            {t('buttons.add_user.label')}
                                        </button>
                                    </TooltipComponent>
                                </div>
                                <div className="col-md-3">
                                    <TooltipComponent title="Upload User">
                                        <button type="button" 
                                            className="btn btn-primary btn-md rounded-pill px-4"
                                            data-bs-toggle="modal" 
                                            data-bs-target={`#${manageUpdateUserModalId}`}
                                        >
                                            Upload User
                                        </button>
                                    </TooltipComponent>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <ManageUserModal id={manageUserModalId} currentUser={currentUser} setReloadComponent={setReloadComponent}/>
            <UploadUsersModal id={manageUpdateUserModalId}/>
        </> 
    ) 
}

export default ManageTeam;
