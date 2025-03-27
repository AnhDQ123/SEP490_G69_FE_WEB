import React, { useState } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CButton, CFormLabel, CFormInput } from '@coreui/react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import style for date picker

// Đăng ký các thành phần của ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(26000);
    const [shopData, setShopData] = useState(150);
    const [shipperData, setShipperData] = useState(120);
    const [orderData, setOrderData] = useState(15000);
    const [reportData, setReportData] = useState(5);

    // State for date range
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const trafficData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Active Users',
                data: [50, 60, 70, 90, 100, 110, 130, 100, 80, 70, 100, 150],
                fill: true,
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                borderColor: 'rgb(53, 162, 235)',
                tension: 0.4,
            },
            {
                label: 'Inactive Users',
                data: [70, 80, 90, 110, 120, 130, 160, 100, 80, 100, 130, 180],
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    // Handle filter date change
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    return (
        <CContainer>
            <CRow className="d-flex justify-content-between">
                {/* Card User */}
                <CCol sm="6" md="2" className="mb-3 px-0">
                    <CCard>
                        <CButton
                            color="primary"
                            block
                            onClick={() => navigate('/user-dashboard')}
                        >
                            User
                        </CButton>
                        <CCardBody>
                            <h3 className="text-center">{userData}</h3>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Card Shop */}
                <CCol sm="6" md="2" className="mb-3 px-0">
                    <CCard>
                        <CButton
                            color="success"
                            block
                            onClick={() => navigate('/shop-dashboard')}
                        >
                            Shop
                        </CButton>
                        <CCardBody>
                            <h3 className="text-center">{shopData}</h3>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Card Shipper */}
                <CCol sm="6" md="2" className="mb-3 px-0">
                    <CCard>
                        <CButton
                            color="warning"
                            block
                            onClick={() => navigate('/shipper-dashboard')}
                        >
                            Shipper
                        </CButton>
                        <CCardBody>
                            <h3 className="text-center">{shipperData}</h3>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Card Order */}
                <CCol sm="6" md="2" className="mb-3 px-0">
                    <CCard>
                        <CButton
                            color="info"
                            block
                            onClick={() => navigate('/order-dashboard')}
                        >
                            Orders
                        </CButton>
                        <CCardBody>
                            <h3 className="text-center">{orderData}</h3>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Card Report */}
                <CCol sm="6" md="2" className="mb-3 px-0">
                    <CCard>
                        <CButton
                            color="danger"
                            block
                            onClick={() => navigate('/report-dashboard')}
                        >
                            Report
                        </CButton>
                        <CCardBody>
                            <h3 className="text-center">{reportData}</h3>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Date Range Filter */}
            <CRow className="mt-3">
                <CCol sm="6" md="3">
                    <CFormLabel>Start Date</CFormLabel>
                    <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                    />
                </CCol>
                <CCol sm="6" md="3">
                    <CFormLabel>End Date</CFormLabel>
                    <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                    />
                </CCol>
            </CRow>

            {/* Biểu đồ Traffic */}
            <CRow className="mt-4">
                <CCol sm="12" md="12">
                    <CCard>
                        <CCardHeader className="text-center">Người dùng</CCardHeader>
                        <CCardBody>
                            <Line data={trafficData} options={options} />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default UserDashboard;
