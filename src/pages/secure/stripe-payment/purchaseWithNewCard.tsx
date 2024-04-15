import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {  useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
/*import {useGetPaymentIntentMutation} from "../../../api-integration/secure/secure";*/
import { fullPageLoader, updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired } from "../../../api-integration/commonSlice";

import Card from '../../../components/common/card/card';
import UserCard from "../../../components/common/user-card/user-card";
import Statistics from "../../../components/common/statistics/statistics";
/*import loadStripeElements from '../../../JS/stripe_client';
import stripe from "https://js.stripe.com/v3/";*/
const AccountDashboard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    dispatch(fullPageLoader(false));
    const { user } = useSelector((state: any) => state.commonSlice);

    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch(fullPageLoader(true));
        dispatch(updateAlertMessage(""));
        dispatch(updateIsSessionExpired(false));
        dispatch(updateReloadPageAfterSessionExpired(false));
        dispatch(fullPageLoader(false));
    }, []);
/*
    const [stripePaymentAPI, { data: freezePromptsData, isLoading: isUFreezePromptLoading, isSuccess: isFreezePromptSuccess, isError: isFreezePromptError, error: freezePromptError }] =
    useGetPaymentIntentMutation();
    const stripePayment = (data: any) => {
        stripePaymentAPI({
          GPTBluePromptId: parseInt(singlePrompt?.promptDetail[0]?.GPTBLUEPROMPTID || '0'),
          ...data
        })
      }*/
    return (
        <>
            <div className="container">
                <div className="row pt-5">
                    <div className="col-lg-3"></div>
                    <div className="col-lg-6">
                  
                        <form id="payment-form">
                            <span className="stdText" id="paymentAmount">Amount :  </span>
                            <input type="hidden" id="paymentIntentId" name="paymentIntentId" value=""></input>
                            <div id="card-element"></div>
                            <div className="d-grid"> 
                            <button id="btnPay" className="submitButton stdText">
                                <div className="spinner hidden" id="spinner"></div>
                                <span id="button-text">Pay</span>
                            </button>
                            </div>
                            <p id="card-error" className="stdText textRed" role="alert"></p>
                            <p id="card-success" className="result-message hidden stdText">
                                Payment succeeded, see the result in your
                                <a href="" target="_blank">Stripe dashboard.</a> Refresh the page to pay again.
                            </p>
                            <div className="d-grid">
                                <button id="refundbutton" className="submitButton stdText">
                                    <div className="spinner hidden" id="spinnerRefund"></div>
                                    <span id="button-text">Click here to refund</span>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-3"></div>
                </div>
            </div>
           
            <div className="container">
                
                    <div className="row d-flex mb-4">
                        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                            <UserCard />
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12"> THis is the CardPayment
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
                                            <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 me-2" data-tooltip-id="tooltip" aria-label={t('accountDashboard.btn.buy.tooltip')} data-tooltip-html={t('accountDashboard.btn.buy.tooltip')} /*onClick={() => navigate('/app/accountDashboard')}*/>
                                                {t('accountDashboard.btn.buy.label')}
                                            </button>
                                            <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 me-2" data-tooltip-id="tooltip" aria-label={t('accountDashboard.btn.payout.tooltip')} data-tooltip-html={t('accountDashboard.btn.payout.tooltip')} onClick={() => navigate('/app/payout')}>
                                                {t('accountDashboard.btn.payout.label')}
                                            </button>
                                            <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 me-2" data-tooltip-id="tooltip" aria-label={t('accountDashboard.btn.list.tooltip')} data-tooltip-html={t('accountDashboard.btn.list.tooltip')} /*onClick={() => navigate('/app/accountDashboard')}*/>
                                                {t('accountDashboard.btn.list.label')}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <h6>{t('accountDashboard.text.acc_balance')}: {t('text.cc.label')}:657,776</h6>
                                        <h6>{t('accountDashboard.text.acc_balance_ytd')}: CC:657,776</h6>
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
                            <Card id='cc_purchase' like={false} share={false} help={true} titleType={1} title={t('cc_purchase.title')} Feedback={true} settings={true} logo={true}>
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                    <thead>
                                        <tr>
                                            <th><h6>{t('cc_purchase.table.select')}</h6></th>
                                            <th><h6>{t('cc_purchase.table.amount')}</h6></th>
                                            <th><h6>{t('cc_purchase.table.price')}</h6></th>
                                            <th><h6>{t('cc_purchase.table.inc_vat')}</h6></th>
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
                                <div className="text-center">
                                <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 me-2" data-tooltip-id="tooltip" aria-label={t('accountDashboard.btn.buy.tooltip')} data-tooltip-html={t('accountDashboard.btn.buy.tooltip')} /*onClick={() => navigate('/app/accountDashboard')}*/>
                                    {t('accountDashboard.btn.buy.label')}
                                </button>
                                </div>
                                
                            </Card>
                        </div>
                        <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                            <Card id='transactions' like={false} share={false} help={true} titleType={1} title={t('transaction.title')} Feedback={true} settings={true} logo={true}>
                            <div className="table-responsive">
                                <table className="table table-sm table-bordered">
                                    <thead>
                                        <tr>
                                            <th><h6>{t('transaction.table.date')}</h6></th>
                                            <th><h6>{t('transaction.table.activity')}</h6></th>
                                            <th><h6>{t('transaction.table.type')}</h6></th>
                                            <th><h6>{t('transaction.table.coin_spent')}</h6></th>
                                            <th><h6>{t('transaction.table.coin_added')}</h6></th>
                                            <th><h6>{t('transaction.table.balance')}</h6></th>
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
                                                <td>{transaction.coinAdded}</td>
                                                <td>{transaction.coinStatus}</td>
                                            </tr>
                                        ))*/}
                                    </tbody>
                                </table>
                            </div>
                            </Card>
                        </div>
                    </div>
            </div>
        </>
    );
}


export default AccountDashboard;
