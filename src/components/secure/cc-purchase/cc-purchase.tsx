import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import Card from '../../common/card/card';
import { fullPageLoader, updateUser, updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired } from "../../../api-integration/commonSlice";
import { useGetSubPlanMutation} from "../../../api-integration/secure/secure";
import TooltipComponent from '../../common/bootstrap-component/tooltip-component';

interface CallomCoinPurchaseProps {
    id: string;
    accountType: string;
}

const CallomCoinPurchase: React.FC<CallomCoinPurchaseProps> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [selectedPlanId, setSelectedPlanId] = useState("");
    const [numberOfPacks, setNumberOfPacks] = useState(1);
    const [planPriceWithTax, setPlanPriceWithTax] = useState(0);
    const [isSelectedPlan, setIsSelectedPlan] = useState(false);
    const { user } = useSelector((state: any) => state.commonSlice);
    

    const [getSubPlanAPI, { data: subPlanData, isLoading: isSubPlanLoading, isSuccess: isSubPlanSuccess, isError: isSubPlanError, error: SubPlanError }] =
    useGetSubPlanMutation();
    
    useEffect(() => {
        dispatch(fullPageLoader(true));
        getSubPlanAPI({});
    }, [])

    const handlePlanIdChange = (event: React.ChangeEvent<HTMLInputElement>, transaction: any) => {
        setSelectedPlanId(event.target.value);
        setIsSelectedPlan(false);
        setPlanPriceWithTax(transaction.planPriceWithTax);
    }
    function validateInput(input: string) {
        // Check if input is not empty
        // if (input === '') {
        //     return false;
        // }
    
        // Check if input length is less than 8
        if (input.length >= 8) {
            return false;
        }
    
        // Check if input is an integer
        if (!Number.isInteger(Number(input))) {
            return false;
        }
    
        return true;
    }
    
    return (
        <Card id={props.id} like={false} share={false} help={true} helpTitle={t('cc_purchase.help.title')} helpContent={t('cc_purchase.help.content')} cardPadding='p-1' titleType={1} title={t('cc_purchase.title')} Feedback={true} logo={true}>
            <div className="table-responsive">
                <table className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th>{t('cc_purchase.table.select')}</th>
                            <th>{t('cc_purchase.table.amount')}</th>
                            <th>{t('cc_purchase.table.price')}</th>
                            <th>{t('cc_purchase.table.inc_vat')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isSubPlanSuccess && subPlanData?.map((transaction: any, index: number) => ( 
                            <tr key={index}>
                                <td>
                                    <div className="form-check d-flex justify-content-center">
                                        <input type="radio" name="planId" className="form-check-input" id="planId" value={transaction.planId} onChange={(event) => handlePlanIdChange(event, transaction)}/>
                                    </div>
                                </td>
                                <td className='text-end'>CC {transaction.planAmountCC ? new Intl.NumberFormat('en-US').format(transaction.planAmountCC) : ''}</td>
                                <td className='text-end'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-euro" viewBox="0 0 16 16">
                                        <path d="M4 9.42h1.063C5.4 12.323 7.317 14 10.34 14c.622 0 1.167-.068 1.659-.185v-1.3c-.484.119-1.045.17-1.659.17-2.1 0-3.455-1.198-3.775-3.264h4.017v-.928H6.497v-.936q-.002-.165.008-.329h4.078v-.927H6.618c.388-1.898 1.719-2.985 3.723-2.985.614 0 1.175.05 1.659.177V2.194A6.6 6.6 0 0 0 10.341 2c-2.928 0-4.82 1.569-5.244 4.3H4v.928h1.01v1.265H4v.928z"/>
                                    </svg>
                                    {transaction.planPrice ?
                                    new Intl.NumberFormat('en-US').format(transaction.planPrice) 
                                    : 
                                    ''}
                                </td>
                                <td className='text-end'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-euro" viewBox="0 0 16 16">
                                        <path d="M4 9.42h1.063C5.4 12.323 7.317 14 10.34 14c.622 0 1.167-.068 1.659-.185v-1.3c-.484.119-1.045.17-1.659.17-2.1 0-3.455-1.198-3.775-3.264h4.017v-.928H6.497v-.936q-.002-.165.008-.329h4.078v-.927H6.618c.388-1.898 1.719-2.985 3.723-2.985.614 0 1.175.05 1.659.177V2.194A6.6 6.6 0 0 0 10.341 2c-2.928 0-4.82 1.569-5.244 4.3H4v.928h1.01v1.265H4v.928z"/>
                                    </svg>
                                    {transaction.planPriceWithTax ? new Intl.NumberFormat('en-US').format(transaction.planPriceWithTax) : ''}
                                </td>
                            </tr>
                        ))}                           
                    </tbody>
                </table>
            </div>
            {
                isSelectedPlan? <small className="form-text text-danger">{t('cc_purchase.error')}</small>:""
            }

            {props?.accountType === 'corp' && selectedPlanId &&
                <div className="m-2">
                    <div className='row g-1'>
                        <div className="col-7">
                            <label htmlFor="noOfPacks" className="form-label">{t('cc_purchase.form_field.noOfPack.label')}</label>
                        </div>
                        <div className="col-5">
                            <input type="number" 
                            className= "form-control text-end" 
                                id='noOfPacks' 
                                value={numberOfPacks} 
                                required
                                placeholder={t('cc_purchase.form_field.noOfPack.placeholder')} 
                                // onChange={(e) => setNumberOfPacks(Number(e.target.value))}
                                onChange={(e) => {
                                    if (validateInput(e.target.value)) {
                                        setNumberOfPacks(Number(e.target.value));
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <h5 className="">
                        {t('cc_purchase.text.total')}:
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-euro" viewBox="0 0 16 16">
                            <path d="M4 9.42h1.063C5.4 12.323 7.317 14 10.34 14c.622 0 1.167-.068 1.659-.185v-1.3c-.484.119-1.045.17-1.659.17-2.1 0-3.455-1.198-3.775-3.264h4.017v-.928H6.497v-.936q-.002-.165.008-.329h4.078v-.927H6.618c.388-1.898 1.719-2.985 3.723-2.985.614 0 1.175.05 1.659.177V2.194A6.6 6.6 0 0 0 10.341 2c-2.928 0-4.82 1.569-5.244 4.3H4v.928h1.01v1.265H4v.928z"/>
                        </svg> 
                        {new Intl.NumberFormat('en-US').format(numberOfPacks * planPriceWithTax)}
                    </h5>
                </div>
            }

            <div className="text-center">
                <div className="d-inline-block">
                    <TooltipComponent title={t('accountDashboard.btn.buy.tooltip')}>
                        <a onClick={(e) => {
                            if (!selectedPlanId) {
                                e.preventDefault();
                                setIsSelectedPlan(true);
                            }
                            }} href={process.env.REACT_APP_PAYMENT_URL+'?userId='+user?.userId+'&CCPlan='+selectedPlanId+'&noOfPacks='+numberOfPacks} className={`btn btn-primary btn-sm rounded-pill px-4 mb-2`}>
                            {t('accountDashboard.btn.buy.label')}
                        </a>
                    </TooltipComponent>
                </div>
            </div>
        </Card>





            
        
    );
};

export default CallomCoinPurchase;