import React, { useState } from 'react';

interface PaginationProps {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    paginationSize?: string;
    pervNextNavFlag?: boolean;
    previousText?: string;
    nextText?: string;
    noOfLinksOnPage?: number;
    paginate: (number: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, currentPage, paginationSize, paginate, noOfLinksOnPage, pervNextNavFlag, previousText, nextText }) => {
    const pageNumbers = [];
    const totalLinks = Math.ceil(totalItems / itemsPerPage);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(noOfLinksOnPage ? noOfLinksOnPage : totalLinks);

    for (let i = 1; i <= totalLinks; i++) {
        pageNumbers.push(i);
    }

    const handleNext = () => {
        if (currentPage < pageNumbers.length) {
            paginate(currentPage + 1);
            if (endPage < currentPage + 1) {
                setStartPage(startPage + 1);
                setEndPage(endPage + 1);
            }
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
            if (startPage > currentPage - 1) {
                setStartPage(startPage - 1);
                setEndPage(endPage - 1);
            }
        }
    };

    return (
        <nav>
            <ul className={`pagination ${paginationSize == 'large' ? 'pagination-lg' :''}`}>
                {pervNextNavFlag && (   
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <a onClick={(event) => {
                            event.preventDefault();
                            handlePrev();
                            // if (currentPage > 1) {
                            //     paginate(currentPage - 1);
                            // }
                        }} href='!#' className='page-link'>
                            {previousText ? previousText : '«'}
                        </a>
                    </li>
                )}


                {pageNumbers.slice(startPage - 1, endPage).map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={(event) => {
                            event.preventDefault();
                            paginate(number);
                        }} href='!#' className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}


                {pervNextNavFlag && (
                    <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                        <a onClick={(event) => {
                            event.preventDefault();
                            handleNext();
                            // if (currentPage < pageNumbers.length) {
                            //     paginate(currentPage + 1);
                            // }
                        }} href='!#' className='page-link'>
                            {nextText ? nextText : '»'}
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;