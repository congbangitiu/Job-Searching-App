import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Header({
    searchValue,
    setSearchValue,
    searchResult,
    setSearchResult,
    categoriesData,
    onResultClick,
    setIsFiltered,
    selectedResult,
    setSelectedResult,
    handleClearSearch
}) {
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const debouncedValue = useDebounce(searchValue, 500);
    

    const inputRef = useRef();

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }

        if (searchValue.trim() === '') {
            handleClearSearch();
        }

        if (!searchValue.trim()) {
            setSearchResult([]); // Ẩn kết quả nếu không có kí tự trong ô input
            setShowResult(false);
        } else {
            // Tìm các category chứa kí tự searchValue
            const filteredCategories = categoriesData.filter((category) =>
                category.toLowerCase().startsWith(searchValue.toLowerCase()),
            );
            // Giới hạn số lượng kết quả hiển thị lên tối đa 8 kết quả
            setSearchResult(
                filteredCategories.length > 0 ? filteredCategories.slice(0, 8) : categoriesData.slice(0, 8),
            );
            setShowResult(true); // Hiển thị kết quả nếu có kí tự trong ô input
        }
    };

    const handleResultItemClick = (selectedCategory) => {
        onResultClick(selectedCategory);
        setIsFiltered(true);
        setShowResult(false);
        setSelectedResult(selectedCategory);
    };

    const handleClearClick = () => {
        handleClearSearch();
    };

    useEffect(() => {
        setSelectedResult('');
    }, [searchValue]);

    return (
        <div className={cx('wrapper')}>
            <Tippy
                visible={showResult && searchResult?.length > 0}
                interactive={true}
                placement="bottom"
                render={(attrs) => (
                    <div className={cx('results')} tabIndex="-1" {...attrs}>
                        {!!searchResult?.length && showResult && (
                            <div className={cx('results')} tabIndex="-1">
                                {searchResult.map((category, index) => (
                                    <div
                                        key={index}
                                        className={cx('result')}
                                        onClick={() => handleResultItemClick(category)}
                                    >
                                        <FontAwesomeIcon className={cx('magnifyingGlass')} icon={faMagnifyingGlass} />
                                        <p>{category}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <icon className={cx('searchIcon')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none">
                            <g clip-path="url(#clip0_964_46)">
                                <path
                                    d="M10.5 5V3.5H7.5V5H10.5ZM3 7.25V14C3 14.4125 3.3375 14.75 3.75 14.75H14.25C14.6625 14.75 15 14.4125 15 14V7.25C15 6.8375 14.6625 6.5 14.25 6.5H3.75C3.3375 6.5 3 6.8375 3 7.25ZM15 5C15.8325 5 16.5 5.6675 16.5 6.5V14.75C16.5 15.5825 15.8325 16.25 15 16.25H3C2.1675 16.25 1.5 15.5825 1.5 14.75L1.5075 6.5C1.5075 5.6675 2.1675 5 3 5H6V3.5C6 2.6675 6.6675 2 7.5 2H10.5C11.3325 2 12 2.6675 12 3.5V5H15Z"
                                    fill="#B9BDCF"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_964_46">
                                    <rect width="18" height="18" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </icon>
                    <input
                        ref={inputRef}
                        value={selectedResult || searchValue}
                        className={cx('searchInput')}
                        placeholder="Title, companies, expertise or benefits"
                        spellCheck={false}
                        onChange={handleChange}
                        onFocus={() => setShowResult(true)}
                    />
                    {!!searchValue && !loading && (
                        <icon className={cx('clear')} onClick={handleClearClick}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </icon>
                    )}

                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                    <button className={cx('searchBtn')}>Search</button>
                </div>
            </Tippy>
        </div>
    );
}

export default Header;
