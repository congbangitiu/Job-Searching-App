import React from 'react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Header from '../../components/Header';
import JobList from '../../components/JobList';
import LocationList from '../../components/LocationList';
import categoriesData from '../../data/categories';

export default function HomePage() {
    const [locations, setLocations] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [totalPages, setTotalPages] = useState();
    const [pageNumber, setPageNumber] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [fields, setFields] = useState([]);
    // const [satisfiedCompany, setSatisfiedCompany] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isFiltered, setIsFiltered] = useState(false);
    const [selectedResult, setSelectedResult] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [companyID, setCompanyID] = useState(null);
    const [companyIDs, setCompanyIDs] = useState([]);

    const initialLocations = ['London', 'Amsterdam', 'New York', 'Berlin'];

    useEffect(() => {
        fetch(`https://www.themuse.com/api/public/jobs?location=London&page=${pageNumber}`)
            .then((res) => res.json())
            .then((res) => {
                setCompanies(res.results);
                setTotalPages(res.page_count);
                const categories = res.results.map((job) => job.categories[0]?.name); // Lấy danh sách tên categories từ mảng jobs
                setFields(categories);
                const companyData = res.results.map((company) => company.company.id);
                if (companyData) {
                    setCompanyIDs(companyData);
                }
            })
            .catch((error) => {
                console.error('Error fetching companies data:', error);
            });
    }, [pageNumber, totalPages]);


    useEffect(() => {
        if (companyIDs && companyIDs.length > 0) {
            const fetchCompanyData = async () => {
                try {
                    const requests = companyIDs?.map((id) => fetch(`https://www.themuse.com/api/public/companies/${id}`));
                    const responses = await Promise.all(requests);
                    const companyDataArray = await Promise.all(responses.map((res) => res.json()));
                    setCompanyID(companyDataArray);
                } catch (error) {
                    console.error('Error fetching companyID data:', error);
                }
            };
            fetchCompanyData();
        }
    }, [companyIDs]);    

    const handleLocationSelect = (selectedLocation) => {
        setSelectedLocation(selectedLocation);
        fetch(`https://www.themuse.com/api/public/jobs?location=${selectedLocation}&page=${pageNumber}`)
            .then((res) => res.json())
            .then((res) => {
                setCompanies(res.results);
                setTotalPages(res.page_count);
                const categories = res.results.map((job) => job.categories[0]?.name);
                setFields(categories);
            })
            .catch((error) => {
                console.error('Error fetching selected company data:', error);
            });
    };

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const debouncedAPICall = useDebouncedCallback((searchTerm) => {
        if (searchTerm) {
            fetch('https://countriesnow.space/api/v0.1/countries')
                .then((res) => res.json())
                .then((res) => {
                    setLocations(res.data);
                })
                .catch((error) => {
                    console.error('Error fetching location data:', error);
                });
        }
    }, 500);

    const handleResultClick = (selectedCategory) => {
        const satisfiedCompanies = companies.filter(
            (company) => company.categories[0]?.name.toLowerCase() === selectedCategory.toLowerCase(),
        );

        if (satisfiedCompanies.length > 0) {
            setSelectedCompany(satisfiedCompanies);
        }
        setSelectedCategory(selectedCategory);
    };

    const handleClearSearch = () => {
        setSearchValue('');
        setSearchResult([]);
        setSelectedResult('');
        setIsFiltered(false);
        setPageNumber(0);
    };

    useEffect(() => {
        if (!debouncedSearchTerm.trim()) {
            setSearchTerm('');
            return;
        }
        debouncedAPICall(debouncedSearchTerm);
    }, [debouncedSearchTerm, debouncedAPICall]);

    return (
        <div className="App">
            <div className="Inner">
                <p className="title">
                    <strong>Github</strong> Jobs
                </p>
                <Header
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    searchResult={searchResult}
                    setSearchResult={setSearchResult}
                    categoriesData={categoriesData}
                    onResultClick={handleResultClick}
                    setIsFiltered={setIsFiltered}
                    selectedResult={selectedResult}
                    setSelectedResult={setSelectedResult}
                    handleClearSearch={handleClearSearch}
                />
                <div className="body">
                    <LocationList
                        locationsData={locations}
                        setLocationsData={setLocations}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        debouncedSearchTerm={debouncedSearchTerm}
                        debouncedAPICall={debouncedAPICall}
                        setDebouncedSearchTerm={setDebouncedSearchTerm}
                        isSearching={isSearching}
                        setIsSearching={setIsSearching}
                        initialLocations={initialLocations}
                        selectedLocation={selectedLocation}
                        handleLocationSelect={handleLocationSelect}
                    />
                    <JobList
                        companies={companies}
                        setCompanies={setCompanies}
                        pageNumber={pageNumber}
                        setPageNumber={setPageNumber}
                        totalPages={totalPages}
                        selectedCategory={selectedCategory}
                        isFiltered={isFiltered}
                        companyID={companyID}
                    />
                </div>
            </div>
        </div>
    );
}
