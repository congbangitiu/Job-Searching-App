import classNames from 'classnames/bind';
import styles from './Application.module.scss';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Application({ company }) {
    return (
        <div className={cx('wrapper')}>
            <Link className={cx('backToSearch')} to={'/'}>
                <icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_1_136)">
                            <path
                                d="M2.35 11.65L5.14 8.86003C5.46 8.54003 6 8.76003 6 9.21003V11H20C20.55 11 21 11.45 21 12C21 12.55 20.55 13 20 13H6V14.79C6 15.24 5.46 15.46 5.15 15.14L2.36 12.35C2.16 12.16 2.16 11.84 2.35 11.65Z"
                                fill="#1E86FF"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_1_136">
                                <rect width="24" height="24" fill="white" transform="matrix(-1 0 0 1 24 0)" />
                            </clipPath>
                        </defs>
                    </svg>
                </icon>
                <p>Back to search</p>
            </Link>
            <div className={cx('applyingMethod')}>
                <p>HOW TO APPLY</p>
                <p>
                    Please email a copy of your resume and online portfolio to{' '}
                    <a href={company.refs?.landing_page}>{company.refs.landing_page}</a> & CC{' '}
                    <a href={company.refs?.jobs_page}>{company.refs.jobs_page}</a>
                </p>
            </div>
        </div>
    );
}

export default Application;
