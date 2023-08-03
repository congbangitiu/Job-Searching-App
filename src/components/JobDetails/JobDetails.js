import classNames from 'classnames/bind';
import styles from './JobDetails.module.scss';
import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
const cx = classNames.bind(styles);

function JobDetails({ company, job }) {
    const [showBackToTopButton, setShowBackToTopButton] = useState(false);
    const [isShowing, setIsShowing] = useState(false);

    const convertToHtml = (str) => {
        return ReactDOMServer.renderToString(React.createElement('div', { dangerouslySetInnerHTML: { __html: str } }));
    };
    useEffect(() => {
        if (isShowing) {
            setShowBackToTopButton(true);
        } else {
            setShowBackToTopButton(false);
        }
    }, [isShowing]);

    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatTimeDifference = (timeStr) => {
        const apiTime = new Date(timeStr);
        const currentTime = new Date();
        const timeDifference = currentTime - apiTime;
        const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return daysAgo > 1 ? `${daysAgo} days ago` : '1 day ago';
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('vacancy')}>
                {job.name}
                <div className={cx('workingTime')}>
                    <p>Fulltime</p>
                </div>
            </div>
            <div className={cx('postingTime')}>
                <icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
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
                <p>{formatTimeDifference(job.publication_date)}</p>
            </div>
            <div className={cx('company')}>
                <img className={cx('logo')} src={company.refs.logo_image} alt="Company logo" />
                <div className={cx('information')}>
                    <p className={cx('name')}>{company.name}</p>
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
                        <p>{company.locations[0]?.name}</p>
                    </div>
                </div>
            </div>
            <div
                className={cx('jobDescription', { showing: isShowing }, { hiding: !isShowing })}
                dangerouslySetInnerHTML={{ __html: convertToHtml(job.contents) }}
            />
            {!isShowing && (
                <p className={cx({ showing: !isShowing })} onClick={() => setIsShowing(true)}>
                    <span className={cx('showText')}>Show more</span>
                </p>
            )}
            {isShowing && (
                <p className={cx({ hiding: isShowing })} onClick={() => setIsShowing(false)}>
                    <span className={cx('hideText')}>Show less</span>
                </p>
            )}
            {showBackToTopButton && (
                <div className={cx('backToTopButton')} onClick={() => handleBackToTop()}>
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
            )}
        </div>
    );
}

export default JobDetails;
