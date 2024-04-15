import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { fullPageLoader, updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired } from "../../../api-integration/commonSlice";
import Card from '../../../components/common/card/card';
import UserCard from "../../../components/common/user-card/user-card";
import Statistics from "../../../components/common/statistics/statistics";
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
//import { saveData } from './payoutActions';

const Payout: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    dispatch(fullPageLoader(false));
    const { user } = useSelector((state: any) => state.commonSlice);
    const [time, setTime] = useState<string>(String(new Date().getHours() + ':' + new Date().getMinutes()))
    const [formData, setFormData] = useState({
        ccTradeIn: 0
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        //dispatch(saveData(formData));
        
    };

    return (
        <div className="container">
            <div className="row d-flex mb-4">
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                    <UserCard />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <Card id='account_dashboard'  like={false} share={false} help={true} titleType={1} title={t('accountDashboard.title')} Feedback={true} settings={true} logo={true}>
                        <div className="row">
                            <div className="col-8">
                                <div className='p-4 border border-secondary rounded mb-3'>
                                    <div className="row">
                                        <div className="col-4">
                                            <h5>{t('accountDashboard.text.balance')}:</h5>
                                        </div>
                                        <div className="col-8">
                                            <h5>{t('text.cc.label')} {user?.totalCCPoints ? new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(user?.totalCCPoints) : ''}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="d-inline-block">
                                        <TooltipComponent title={t('accountDashboard.btn.buy.tooltip')}>
                                            <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 me-2" /*onClick={() => navigate('/app/accountDashboard')}*/>
                                                {t('accountDashboard.btn.buy.label')}
                                            </button>
                                        </TooltipComponent>
                                    </div>
                                    <div className="d-inline-block">
                                        <TooltipComponent title={t('accountDashboard.btn.payout.tooltip')}>
                                            <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 me-2" /*onClick={() => navigate('/app/payout')}*/>
                                                {t('accountDashboard.btn.payout.label')}
                                            </button>
                                        </TooltipComponent>
                                    </div>
                                    <div className="d-inline-block">
                                        <TooltipComponent title={t('accountDashboard.btn.list.tooltip')}>
                                            <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 me-2" /*onClick={() => navigate('/app/accountDashboard')}*/>
                                                {t('accountDashboard.btn.list.label')}
                                            </button>
                                        </TooltipComponent>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                            <div className="mb-2 form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="autoPayout" name="autoPayout"/>
                                <label className="form-check-label" htmlFor="autoPayout">{t('cc_payout.form_field.auto_payout.label')}</label></div>
                            </div>
                        </div>
                        
                    </Card>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                    <Statistics statsType="user"/>
                </div>
            </div>
            <div className="row d-flex">
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                    <Card id='cc_payout' like={false} share={false} help={true} titleType={1} title={t('payout_history.title')} Feedback={true} settings={true} logo={true}>
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th><h6>{t('payout_history.table.amount')}</h6></th>
                                        <th><h6>{t('payout_history.table.price')}</h6></th>
                                        <th><h6>{t('payout_history.table.date')}</h6></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Render your transaction rows using the fetched data */}
                                    {/*data.map(transaction => (
                                        <tr key={transaction.id}>
                                            <td>{transaction.date}</td>
                                            <td>{transaction.activity}</td>
                                            <td>{transaction.balance}</td>
                                            <td>{transaction.coinSpent}</td>
                                            
                                        </tr>
                                    ))*/}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-center">
                            <div className="d-inline-block"><TooltipComponent title={t('common.content_coming_soon')}><button type="button" className="btn btn-primary btn-md rounded-pill px-4" >{time} h</button></TooltipComponent></div>
                        </div>
                        
                    </Card>
                </div>
                <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                    <Card id='cc_payout' like={false} share={false} help={true} titleType={1} title={t('cc_payout.title')} Feedback={true} settings={true} logo={true}>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-1"></div>
                                <div className="col-10">
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            {t('cc_payout.text.current_balance')}
                                        </div>
                                        <div className="col-3 text-end">
                                            {user?.totalCCPoints ? new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(user?.totalCCPoints) : ''}
                                        </div>
                                        <div className="col-3 text-end">
                                            Euro 136,78
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            {t('cc_payout.text.cc_trade_in')}
                                        </div>
                                        <div className="col-3 text-end">
                                            <input type="number" className="form-control" id="ccTradeIn" name="ccTradeIn" />
                                        </div>
                                        <div className="col-3"></div>
                                    </div>
                                </div>
                                <div className="col-1"></div>
                            </div>
                            <p className='mt-5 text-center'>
                                {t('cc_payout.text.info')} IABN 12344-567867-90888
                            </p>
                        </form>
                    </Card>
                </div>
            </div>
    </div>
    );
};

export default Payout;
