import React, {useState} from 'react';
import {CContainer, CRow, CCol, CCard, CCardBody, CCardHeader, CButton} from '@coreui/react';
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {useNavigate} from "react-router-dom";

// Đăng ký các thành phần của ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ShopDashboard = () => {

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
                label: 'Active',
                data: [80, 85, 90, 95, 100, 110, 130, 125, 120, 130, 140, 150],
                fill: false,
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                borderColor: 'rgb(53, 162, 235)',
                borderWidth: 2,
                tension: 0.4,  // Độ cong của đường
            },
            {
                label: 'Inactive',
                data: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110],
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                tension: 0.4,  // Độ cong của đường
            },
            {
                label: 'Pending',
                data: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
                fill: false,
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgb(255, 159, 64)',
                borderWidth: 2,
                tension: 0.4,  // Độ cong của đường
            },
            {
                label: 'Rejected',
                data: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
                fill: false,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgb(153, 102, 255)',
                borderWidth: 2,
                tension: 0.4,  // Độ cong của đường
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
                            onClick={() => navigate('/shop-dashboard')} // Điều hướng đến ShopDashboard khi bấm vào Shop
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

            {/* Các số liệu khác có thể hiển thị */}
            <CRow className="mt-4">
                <CCol>
                    <CCard>
                        <CCardHeader className="text-center">Traffic (January - July 2023)</CCardHeader>
                        <CCardBody>
                            <Line data={trafficData} options={options}/>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default ShopDashboard;
