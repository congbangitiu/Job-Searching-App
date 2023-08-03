import classNames from 'classnames/bind';
import styles from './JobList.module.scss';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function JobList({ companies, pageNumber, setPageNumber, totalPages, selectedCategory, isFiltered, companyID }) {
    console.log(selectedCategory);

    const [displayedCompanies, setDisplayedCompanies] = useState([]);
    const [currentPageGroup, setCurrentPageGroup] = useState(0);
    const [startIndex, setStartIndex] = useState(currentPageGroup * 10);
    const [endIndex, setEndIndex] = useState(startIndex + 10);
    const [isActive, setIsActive] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const formatTimeDifference = (timeStr) => {
        const apiTime = new Date(timeStr);
        const currentTime = new Date();
        const timeDifference = currentTime - apiTime;
        const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return daysAgo > 1 ? `${daysAgo} days ago` : '1 day ago';
    };

    const pagesArray = Array.from({ length: totalPages }, (_, index) => index + 1);
    // Tính toán số trang hiển thị trong nhóm trang hiện tại
    const displayedPages = pagesArray.slice(startIndex, endIndex);

    const handleNextPageGroup = () => {
        setStartIndex(startIndex + 10);
        setEndIndex(endIndex + 10);
    };

    const handlePreviousPageGroup = () => {
        setStartIndex(startIndex - 10);
        setEndIndex(endIndex - 10);
    };

    // Hàm xử lý sự kiện khi người dùng nhấp vào trang
    const handleSetActivePage = (page) => {
        setPageNumber(page - 1);
        setIsActive(true);
    };

    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollPercentage = (scrollPosition / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage >= 40) {
            setShowBackToTop(true);
        } else {
            setShowBackToTop(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsActive(true);
    }, []);

    useEffect(() => {
        if (isFiltered) {
            const filteredCompanies = companies.filter((company) => company.categories[0]?.name === selectedCategory);
            setDisplayedCompanies(filteredCompanies);
        } else {
            setDisplayedCompanies(companies);
        }
    }, [companies, selectedCategory, isFiltered]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('companies')}>
                {displayedCompanies && displayedCompanies.length > 0 ? (
                    displayedCompanies.map((company,index) => (
                        <Link className={cx('company')} key={company.id} to={`/jobs/${company.id}`}>
                            <img
                                className={cx('logo')}
                                src={companyID?.[index]?.refs?.logo_image}
                                alt="Company logo"
                            />
                            <div className={cx('information')}>
                                <p className={cx('name')}>{companies?.[index]?.company?.name}</p>
                                <p className={cx('vacancy')}>{companies?.[index]?.categories?.[0]?.name}</p>
                                <div className={cx('details')}>
                                    <div className={cx('workingTime')}>
                                        <p>Fulltime</p>
                                    </div>
                                    <div className={cx('moreDetails')}>
                                        <div className={cx('workingPlace')}>
                                            <icon>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                >
                                                    <g clip-path="url(#clip0_964_59)">
                                                        <path
                                                            d="M9 2C4.86 2 1.5 5.36 1.5 9.5C1.5 13.64 4.86 17 9 17C13.14 17 16.5 13.64 16.5 9.5C16.5 5.36 13.14 2 9 2ZM8.25 15.4475C5.2875 15.08 3 12.56 3 9.5C3 9.035 3.06 8.5925 3.1575 8.1575L6.75 11.75V12.5C6.75 13.325 7.425 14 8.25 14V15.4475ZM13.425 13.5425C13.23 12.935 12.675 12.5 12 12.5H11.25V10.25C11.25 9.8375 10.9125 9.5 10.5 9.5H6V8H7.5C7.9125 8 8.25 7.6625 8.25 7.25V5.75H9.75C10.575 5.75 11.25 5.075 11.25 4.25V3.9425C13.4475 4.835 15 6.9875 15 9.5C15 11.06 14.4 12.4775 13.425 13.5425Z"
                                                            fill="#B9BDCF"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_964_59">
                                                            <rect width="18" height="18" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </icon>
                                            <p>{companies?.[index]?.locations?.[1]?.name || 'Updating ...'}</p>
                                        </div>
                                        <div className={cx('postingTime')}>
                                            <icon>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 18 18"
                                                    fill="none"
                                                >
                                                    <g clip-path="url(#clip0_964_54)">
                                                        <path
                                                            d="M8.9925 1.5C4.8525 1.5 1.5 4.86 1.5 9C1.5 13.14 4.8525 16.5 8.9925 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 8.9925 1.5ZM9 15C5.685 15 3 12.315 3 9C3 5.685 5.685 3 9 3C12.315 3 15 5.685 15 9C15 12.315 12.315 15 9 15ZM8.835 5.25H8.79C8.49 5.25 8.25 5.49 8.25 5.79V9.33C8.25 9.5925 8.385 9.84 8.6175 9.975L11.73 11.8425C11.985 11.9925 12.315 11.9175 12.465 11.6625C12.6225 11.4075 12.54 11.07 12.2775 10.92L9.375 9.195V5.79C9.375 5.49 9.135 5.25 8.835 5.25Z"
                                                            fill="#B7BCCE"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_964_54">
                                                            <rect width="18" height="18" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </icon>
                                            <p>
                                                {formatTimeDifference(companies?.[index]?.publication_date) ||
                                                    'Updating ...'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>
                        There is no result for <b>{selectedCategory}</b> category in this page. Please turn to next one
                        ...
                    </p>
                )}
            </div>
            <div className={cx('pagesContainer')}>
                <div className={cx('page')} onClick={() => handlePreviousPageGroup()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M14.71 15.88L10.83 12L14.71 8.12001C15.1 7.73001 15.1 7.10001 14.71 6.71001C14.32 6.32001 13.69 6.32001 13.3 6.71001L8.71001 11.3C8.32001 11.69 8.32001 12.32 8.71001 12.71L13.3 17.3C13.69 17.69 14.32 17.69 14.71 17.3C15.09 16.91 15.1 16.27 14.71 15.88Z"
                            fill="#B7BCCE"
                        />
                    </svg>
                </div>
                <div className={cx('pages')}>
                    {displayedPages.map((page) => (
                        <div
                            className={cx('page', { active: isActive && page === pageNumber + 1 })}
                            key={page}
                            onClick={() => handleSetActivePage(page)}
                        >
                            <p>{page}</p>
                        </div>
                    ))}
                </div>
                <div className={cx('page')} onClick={() => handleNextPageGroup()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M9.29001 8.11999L13.17 12L9.29 15.88C8.9 16.27 8.9 16.9 9.29 17.29C9.68 17.68 10.31 17.68 10.7 17.29L15.29 12.7C15.68 12.31 15.68 11.68 15.29 11.29L10.7 6.69999C10.31 6.30999 9.68001 6.30999 9.29001 6.69999C8.91001 7.08999 8.90001 7.72999 9.29001 8.11999Z"
                            fill="#B7BCCE"
                        />
                    </svg>
                </div>

                <div
                    className={cx('backToTopButton')}
                    onClick={() => handleBackToTop()}
                    style={{ display: showBackToTop ? 'block' : 'none' }}
                >
                    <div className={cx('tooltip')}>
                        <span className={cx('tooltiptext')}>Back to top</span>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        height="20px"
                        width="20px"
                        version="1.1"
                        id="Layer_1"
                        viewBox="0 0 330 330"
                    >
                        <path
                            id="XMLID_224_"
                            d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394  l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393  C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default JobList;
