import classNames from 'classnames/bind';
import styles from './LocationList.module.scss';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function LocationList({
    locationsData,
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    debouncedAPICall,
    setDebouncedSearchTerm,
    isSearching,
    setIsSearching,
    initialLocations,
    handleLocationSelect
}) {
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSelectedLocation, setIsSelectedLocation] = useState(null);

    const inputRef = useRef();

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setSearchTerm(inputValue); // Lưu giá trị ngay khi người dùng nhập vào ô input
        setDebouncedSearchTerm(inputValue); // Lưu giá trị sau khi đã chờ 1 giây
        setIsSearching(true);
        setIsLoading(true);
        if (!inputValue.trim()) {
            setSearchTerm(''); // Reset giá trị tìm kiếm khi ô input rỗng
            setDebouncedSearchTerm('');
            setFilteredLocations([]);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        inputRef.current.focus();
        setIsSearching(false);
        setFilteredLocations([]);
    };

    const handleRadioClick = (location) => {
        setIsSelectedLocation(location);
        handleLocationSelect(encodeURIComponent(location));
    };

    useEffect(() => {
        const filteredLocations = locationsData.reduce((acc, country) => {
            const locationWithChar = country.cities.filter((location) =>
                location.toLowerCase().startsWith(debouncedSearchTerm.toLowerCase()),
            );
            return [...acc, ...locationWithChar];
        }, []);
        setFilteredLocations(filteredLocations);
    }, [locationsData, debouncedSearchTerm]);

    useEffect(() => {
        if (searchTerm === '') {
            setIsSearching(false); // Nếu searchTerm rỗng, thiết lập isSearching thành false
            setFilteredLocations([]);
        } else {
            setIsSearching(true); // Nếu searchTerm có giá trị, thiết lập isSearching thành true
        }
    }, [searchTerm]);

    useEffect(() => {
        if (!debouncedSearchTerm.trim()) {
            setFilteredLocations([]);
        } else {
            setIsLoading(true);

            const fetchData = async () => {
                try {
                    const data = await debouncedAPICall(debouncedSearchTerm);
                    setFilteredLocations(data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [debouncedSearchTerm, debouncedAPICall]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('fulltime')}>
                <input type="checkbox" />
                <p>Full time</p>
            </div>
            <div className={cx('location')}>
                <h4>Location</h4>
                <div className={cx('search')}>
                    <icon className={cx('searchIcon')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <g clip-path="url(#clip0_964_150)">
                                <path
                                    d="M9.5 2C5.36 2 2 5.36 2 9.5C2 13.64 5.36 17 9.5 17C13.64 17 17 13.64 17 9.5C17 5.36 13.64 2 9.5 2ZM8.75 15.4475C5.7875 15.08 3.5 12.56 3.5 9.5C3.5 9.035 3.56 8.5925 3.6575 8.1575L7.25 11.75V12.5C7.25 13.325 7.925 14 8.75 14V15.4475ZM13.925 13.5425C13.73 12.935 13.175 12.5 12.5 12.5H11.75V10.25C11.75 9.8375 11.4125 9.5 11 9.5H6.5V8H8C8.4125 8 8.75 7.6625 8.75 7.25V5.75H10.25C11.075 5.75 11.75 5.075 11.75 4.25V3.9425C13.9475 4.835 15.5 6.9875 15.5 9.5C15.5 11.06 14.9 12.4775 13.925 13.5425Z"
                                    fill="#B9BDCF"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_964_150">
                                    <rect width="18" height="18" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </icon>
                    <input
                        className={cx('searchInput')}
                        placeholder="City, state, zip code or country"
                        onChange={handleInputChange}
                        spellCheck={false}
                        ref={inputRef}
                        value={searchTerm}
                    />
                    {isSearching && (
                        <icon className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </icon>
                    )}
                </div>
                <div className={cx('results')}>
                    {!!isSearching ? (
                        <div className={cx('searchResults')}>
                            {isLoading ? (
                                <p className={cx('loading')}>Loading...</p>
                            ) : filteredLocations && filteredLocations.length > 0 ? (
                                filteredLocations.map((location, index) => (
                                    <div className={cx('result')} key={index}>
                                        <input
                                            type="radio"
                                            checked={location === isSelectedLocation}
                                            onChange={() => handleRadioClick(location)}
                                        />
                                        <p>{location}</p>
                                    </div>
                                ))
                            ) : (
                                <p className={cx('noResult')}>There is no result ...</p>
                            )}
                        </div>
                    ) : (
                        <div className={cx('initialResults')}>
                            {initialLocations.map((location, index) => (
                                <div className={cx('result')}>
                                    <input
                                        type="radio"
                                        key={index}
                                        checked={location === isSelectedLocation}
                                        onChange={() => handleRadioClick(location)}
                                    />
                                    <p>{location}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LocationList;
