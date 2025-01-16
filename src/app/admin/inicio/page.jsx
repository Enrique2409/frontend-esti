import React from 'react';

const Dashboard = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                <div style={{ width: '30%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h2>Users</h2>
                    <p>Manage users and their permissions.</p>
                </div>
                <div style={{ width: '30%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h2>Reports</h2>
                    <p>View and generate reports.</p>
                </div>
                <div style={{ width: '30%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h2>Settings</h2>
                    <p>Configure system settings.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;