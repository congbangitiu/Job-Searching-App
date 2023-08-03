import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import JobDetails from '../../components/JobDetails';
import Application from '../../components/Application';

const JobDetailPage = () => {
    const { id } = useParams();
    const [job, setJob] = useState();
    const [company, setCompany] = useState();

    useEffect(() => {
        if (id) {
            fetch(`https://www.themuse.com/api/public/jobs/${id}`)
                .then((res) => res.json())
                .then((res) => {
                    setJob(res);
                })
                .catch((error) => {
                    console.error('Error fetching companies data:', error);
                    throw error;
                });
        }
    }, [id]);

    useEffect(() => {
        if (job) {
            fetch(`https://www.themuse.com/api/public/companies/${job.company.id}`)
                .then((res) => res.json())
                .then((res) => {
                    setCompany(res);
                })
                .catch((error) => {
                    console.error('Error fetching companies data:', error);
                });
        }
    }, [job]);

    return (
        <>
            {job && company && (
                <div className="App">
                    <div className="Inner">
                        <p className="title">
                            <strong>Github</strong> Jobs
                        </p>
                        <div className="body">
                            <Application company={company}/>
                            <JobDetails job={job} company={company} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default JobDetailPage;
