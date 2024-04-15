import React, { useState, useEffect }  from 'react';
import { useTranslation } from "react-i18next";
import Card from "../../common/card/card";
import { useDispatch, useSelector } from "react-redux";
import { useGetGptBlueAccTransHistoryMutation} from "../../../api-integration/secure/secure";
import { fullPageLoader, updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired } from "../../../api-integration/commonSlice";
import { FormatDate } from '../../../util/util';
import Pagination from '../../common/pagination/pagination';

interface TransactionsProps {
    id: string;
    accountType: string;
}

const Transactions: React.FC<TransactionsProps> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // PAGINATION - State
    const [goldCurrentPage, setGoldCurrentPage] = useState(1);
    const [statusCurrentPage, setStatusCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [goldCurrentItems, setGoldCurrentItems] = useState([]);
    const [statusCurrentItems, setStatusCurrentItems] = useState([]);

    const [getGptBlueAccTransHistoryGoldAPI, { data: transactionHistoryGoldData, isLoading: isTransactionHistoryGoldDataLoading, isSuccess: isTransactionHistoryGoldDataSuccess, isError: isTransactionHistoryGoldDataError, error: transactionHistoryGoldDataError }] =
    useGetGptBlueAccTransHistoryMutation();

    const [getGptBlueAccTransHistoryStatusAPI, { data: transactionHistoryStatusData, isLoading: isTransactionHistoryStatusDataLoading, isSuccess: isTransactionHistoryStatusDataSuccess, isError: isTransactionHistoryStatusDataError, error: transactionHistoryStatusDataError }] =
    useGetGptBlueAccTransHistoryMutation();

    useEffect(() => {
        dispatch(fullPageLoader(true));
        getGptBlueAccTransHistoryGoldAPI({accountType: props?.accountType, coinType: 'o'})
    }, [])

    useEffect(() => {
        dispatch(fullPageLoader(true));
        getGptBlueAccTransHistoryStatusAPI({accountType: props?.accountType, coinType: 's'})
    }, [])

    
    useEffect(() => {
        if (Array.isArray(transactionHistoryGoldData)) {
            dispatch(fullPageLoader(false));
            const indexOfLastGoldItem = goldCurrentPage * itemsPerPage;
            const indexOfFirstGoldItem = indexOfLastGoldItem - itemsPerPage;
            setGoldCurrentItems(transactionHistoryGoldData.slice(indexOfFirstGoldItem, indexOfLastGoldItem) as never[]);   
        }
    }, [transactionHistoryGoldData, goldCurrentPage, itemsPerPage, dispatch])
    // PAGINATION - Change page
    const paginateGold = (pageNumber: number) => setGoldCurrentPage(pageNumber);

    useEffect(() => {
        if (Array.isArray(transactionHistoryStatusData)) {
            dispatch(fullPageLoader(false));
            const indexOfLastStatusItem = statusCurrentPage * itemsPerPage;
            const indexOfFirstStatusItem = indexOfLastStatusItem - itemsPerPage;
            setStatusCurrentItems(transactionHistoryStatusData.slice(indexOfFirstStatusItem, indexOfLastStatusItem)as never[]);   
        }
    }, [transactionHistoryStatusData, statusCurrentPage, itemsPerPage, dispatch])
    // PAGINATION - Change page
    const paginateStatus = (pageNumber: number) => setStatusCurrentPage(pageNumber);
    
    return (
        <Card id={props?.id} like={false} share={false} help={true} helpTitle={t('transaction.help.title')} helpContent={t('transaction.help.content')} titleType={1} title={t('transaction.title')} Feedback={true} logo={true}>
            <div className="table-responsive">
                <h4>{t('transaction.table.title.gold_table')}</h4>
                <table className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th>{t('transaction.table.date')}</th>
                            <th>{t('transaction.table.activity')}</th>
                            <th>{t('transaction.table.type')}</th>
                            <th>{t('transaction.table.coin_spent')}</th>
                            <th>{t('transaction.table.coin_added')}</th>
                            <th>{t('transaction.table.balance')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionHistoryGoldData && (!goldCurrentItems || (goldCurrentItems.length == 0) ?
                            (
                                <tr>
                                    <td colSpan={6}>
                                        {t('message.no_record_found')}                               
                                    </td>
                                </tr>
                            ) : (
                                goldCurrentItems.map((transaction: any, index: number) => (
                                        <tr key={index}>
                                            <td>
                                                {new Date(transaction.transactionDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                            </td>
                                            <td>{transaction.activity}</td>
                                            <td>{transaction.coinName}</td>
                                            <td className='text-end'>{transaction.spent ? new Intl.NumberFormat('en-US').format(transaction.spent) : ''}</td>
                                            <td className='text-end'>{transaction.received ? new Intl.NumberFormat('en-US').format(transaction.received) : ''}</td>
                                            <td className='text-end'>{transaction.balance ? new Intl.NumberFormat('en-US').format(transaction.balance) : ''}</td>
                                        </tr>
                                ))
                            )
                            )}
                    </tbody>
                </table>
            </div>
            {isTransactionHistoryGoldDataLoading &&
                <div className="text-center">
                    {t('message.loading')}
                </div>}
            {isTransactionHistoryGoldDataSuccess && transactionHistoryGoldData && transactionHistoryGoldData.length > 0 && 
            
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={transactionHistoryGoldData.length}
                    paginate={paginateGold}
                    currentPage={goldCurrentPage}
                    pervNextNavFlag={true}
                    noOfLinksOnPage={10}
                    previousText={t('pagination.text.prev')}
                    nextText={t('pagination.text.next')}
                />
            }
            
            {/* {Transaction history for status coin >> only if Accounttype is user for corporate there is no Status coin in the system} */}
            {props?.accountType === 'user' && (
                <>
                <hr className="my-4 border border-primary border-2 opacity-75" />
                    <div className="table-responsive">
                        <h4>{t('transaction.table.title.status_table')}</h4>
                        <table className="table table-sm table-bordered">
                            <thead>
                                <tr>
                                    <th>{t('transaction.table.date')}</th>
                                    <th>{t('transaction.table.activity')}</th>
                                    <th>{t('transaction.table.type')}</th>
                                    <th>{t('transaction.table.coin_spent')}</th>
                                    <th>{t('transaction.table.coin_added')}</th>
                                    <th>{t('transaction.table.balance')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionHistoryStatusData && (!statusCurrentItems || (statusCurrentItems.length == 0) ? 
                                (       <tr>
                                            <td colSpan={6}> 
                                                {t('message.no_record_found')}
                                            </td>
                                        </tr>
                                    ) : (
                                        statusCurrentItems.map((transaction: any, index: number) => (
                                                <tr key={index}>
                                                    <td>
                                                        {new Date(transaction.transactionDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                                    </td>
                                                    <td>{transaction.activity}</td>
                                                    <td>{transaction.coinName}</td>
                                                    <td className='text-end'>{transaction.spent ? new Intl.NumberFormat('en-US').format(transaction.spent) : ''}</td>
                                                    <td className='text-end'>{transaction.received ? new Intl.NumberFormat('en-US').format(transaction.received) : ''}</td>
                                                    <td className='text-end'>{transaction.balance ? new Intl.NumberFormat('en-US').format(transaction.balance) : ''}</td>
                                                </tr>
                                        ))
                                    )
                                    )}
                            </tbody>
                        </table>
                    </div>
                    {isTransactionHistoryStatusDataLoading && 
                        <div className="text-center">
                            {t('message.loading')}
                        </div>
                    }
                    {isTransactionHistoryStatusDataSuccess && transactionHistoryStatusData && transactionHistoryStatusData.length > 0 && 
                    
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={transactionHistoryStatusData.length}
                            paginate={paginateStatus}
                            currentPage={statusCurrentPage}
                            pervNextNavFlag={true}
                            noOfLinksOnPage={10}
                            previousText={t('pagination.text.prev')}
                            nextText={t('pagination.text.next')}
                        />
                    }
                        
                </>
            )}
       
        </Card>
    );
};

export default Transactions;