import React, { useState } from 'react';
import UserCard from '../../../components/common/user-card/user-card';
import AddUpdateCompany from '../../../components/secure/add-update-company/add-update-company';


const ManageCompany: React.FC = () => {
    return (
        <div className="container">
            <div className="row mb-3">
                <div className="col-lg-3 col-md-12 col-sm-12">
                    <UserCard />
                </div>
                <div className="col-lg-9 col-md-12 col-sm-12">
                    <AddUpdateCompany />
                </div>
            </div>
        </div>
    );
};

export default ManageCompany;