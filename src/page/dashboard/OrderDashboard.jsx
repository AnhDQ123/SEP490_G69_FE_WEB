import React, { useState } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CButton } from '@coreui/react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";

// Đăng ký các thành phần của ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OrderDashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(26000);
    const [shopData, setShopData] = useState(150);
    const [shipperData, setShipperData] = useState(120);
    const [orderData, setOrderData] = useState(15000);
    const [reportData, setReportData] = useState(5);

    const trafficData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Successful Orders',
                data: [1000, 1200, 1400, 1600, 1800, 1900, 2100, 2300, 2400, 2500, 2600, 2700],
                fill: false,
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                borderColor: 'rgb(53, 162, 235)',
                borderWidth: 2,
                tension: 0.4,
            },
            {
                label: 'Failed Orders',
                data: [300, 400, 450, 500, 600, 650, 700, 750, 800, 850, 900, 950],
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                tension: 0.4,
            },
            {
                label: 'Returned Orders',
                data: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
                fill: false,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgb(255, 159, 64)',
                borderWidth: 2,
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

            {/* Biểu đồ Traffic */}
            <CRow className="mt-4">
                <CCol sm="12" md="12">
                    <CCard>
                        <CCardHeader className="text-center">Order Traffic (January - December 2023)</CCardHeader>
                        <CCardBody>
                            <Line data={trafficData} options={options} />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

        </CContainer>
    );
};

export default OrderDashboard;
