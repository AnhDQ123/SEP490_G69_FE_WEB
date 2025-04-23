import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CFormInput,
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle, CCardHeader, CNavLink, CNavItem, CNav,
} from '@coreui/react';
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { useGetShopByIdQuery, useInactivateShopMutation } from '../../service/shopService.js';
import {Line} from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ShopActive = () => {
    const [timePeriod, setTimePeriod] = useState('day'); // State để lưu lựa chọn thời gian (Ngày, Tháng, Năm)
    const [shop, setShop] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetShopByIdQuery(id);
    const [inactivateShop] = useInactivateShopMutation();
    const [showImageBackground, setShowImageBackground] = useState(false);
    const [showImageRegistrationCertificate, setShowImageRegistrationCertificate] = useState(false);
    const [showFoodSafetyCertificate, setShowFoodSafetyCertificate] = useState(false);
    const [showCitizenId, setShowCitizenId] = useState(false);

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);  // Add state for success modal
    const [successMessage, setSuccessMessage] = useState('');  // Add state for success message

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date for hourly chart


    useEffect(() => {
        if (data) {
            setShop(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu cửa hàng</p>;
    if (!shop) return <p>Không tìm thấy thông tin cửa hàng</p>;

    // Inactive shop
    const handleBlockShop = async () => {
        setIsFormSubmitted(true); // Đánh dấu người dùng đã nhấn "Xác nhận"

        if (!blockReason.trim()) {
            return; // Nếu lý do trống, không làm gì cả
        }

        try {
            // Gửi yêu cầu chặn cửa hàng
            await inactivateShop({ shopId: id, reason: blockReason }).unwrap();
            setShop({ ...shop, isActive: 'INACTIVE' });

            // Hiển thị modal thông báo thành công
            setSuccessMessage('Đã dừng hoạt động cửa hàng');
            setShowSuccessModal(true);  // Mở modal khi thành công

            // Đóng modal và chuyển hướng sau 2 giây
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/shop-list');
            }, 2000); // Đợi 2 giây trước khi chuyển hướng

        } catch (error) {
            console.error('Error in blocking shop:', error);
            toast.error("Cập nhật thất bại!", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const handleConfirmBlock = () => {
        setShowBlockModal(true);
    };

    const imagesBackground = shop?.images || [shop.backgroundImage];
    const imageRegistrationCertificate = shop?.images || [shop.registrationCertificate];
    const foodSafetyCertificate = shop?.foodSafetyCertificate || [];
    const citizenIdFront = shop?.citizenIdFront || [];
    const citizenIdBack = shop?.citizenIdBack || [];

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesBackground.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagesBackground.length) % imagesBackground.length);
    };

    const chartData = {
        day: {
            labels: ['16-04', '17-04', '18-04', '19-04', '20-04', '21-04', '22-04'],
            datasets: [{
                label: 'Doanh thu',
                data: [1000, 2000, 1500, 2500, 3000, 3500, 4000],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
        month: {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
            datasets: [{
                label: 'Doanh thu',
                data: [5000, 7000, 6000, 8500],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
        year: {
            labels: ['2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Doanh thu',
                data: [60000, 70000, 75000, 80000],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
        orderByHour: {
            labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
            datasets: [{
                label: 'Số lượng đơn hàng',
                data: [20, 30, 50, 40, 60, 70, 80, 90],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
    };

    const handleTimePeriodChange = (period) => {
        setTimePeriod(period); // Cập nhật thời gian khi người dùng chọn tab
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleSelectedDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách cửa hàng {'>'} Cửa hàng đang hoạt động</h4>
                <CRow className="mb-3">
                    <CCol>
                        <label>Tên cửa hàng</label>
                        <CFormInput disabled value={shop.name} />
                    </CCol>
                    <CCol>
                        <label>Chủ cửa hàng</label>
                        <CFormInput disabled value={shop.owner.username} />
                    </CCol>
                    <CCol>
                        <label>Số điện thoại</label>
                        <CFormInput disabled value={shop.phone} />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={8}>
                        <label>Địa chỉ</label>
                        <CFormInput disabled value={shop.address} />
                    </CCol>
                    <CCol md={4}>
                        <label>Đánh giá</label>
                        <CFormInput disabled value={shop.rate} />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={4}>
                        <label>Loại cửa hàng</label>
                        <CFormInput disabled value={shop.sellType} />
                    </CCol>
                    <CCol md={4}>
                        <label>Giờ hoạt động</label>
                        <CFormInput disabled value={shop.openTime} />
                    </CCol>
                    <CCol md={4}>
                        <label>Giờ đóng cửa</label>
                        <CFormInput disabled value={shop.closeTime} />
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Mã số thuế</label>
                        <CFormInput disabled value={shop.owner.profile.taxCode} />
                    </CCol>
                    <CCol md={6}>
                        <label>Trạng thái</label>
                        <CFormInput disabled value={shop.isActive} />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={() => setShowImageBackground(true)}
                        >
                            Ảnh cửa hàng
                        </label>
                    </CCol>
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={() => setShowImageRegistrationCertificate(true)}
                        >
                            Giấy phép kinh doanh
                        </label>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={() => setShowFoodSafetyCertificate(true)}
                        >
                            Giấy phép vệ sinh an toàn thực phẩm
                        </label>
                    </CCol>
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{ cursor: 'pointer', color: 'blue' }}
                            onClick={() => setShowCitizenId(true)}
                        >
                            Căn cước công dân
                        </label>
                    </CCol>
                </CRow>

                {/*Revenue*/}
                <CRow className="mb-4">
                    {/* Revenue chart */}
                    <CCol md={6}>
                        <CCard>
                            <CCardHeader>
                                <strong>Doanh thu cửa hàng</strong>
                            </CCardHeader>
                            <CCardBody>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex" style={{ width: '100%', justifyContent: 'space-between' }}>
                                        <div style={{ width: '48%' }}>
                                            <label>Ngày bắt đầu</label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={handleStartDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                        <div style={{ width: '48%' }}>
                                            <label>Ngày kết thúc</label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={handleEndDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                className="form-control"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Time period tabs */}
                                    <CNav variant="pills" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '10' }}>
                                        {['day', 'month', 'year'].map((tab) => (
                                            <CNavItem key={tab}>
                                                <CNavLink
                                                    active={timePeriod === tab}
                                                    onClick={() => handleTimePeriodChange(tab)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        fontSize: '0.875rem',
                                                        fontWeight: timePeriod === tab ? '600' : '400',
                                                        backgroundColor: timePeriod === tab ? '#6c757d' : '#f8f9fa',
                                                        color: timePeriod === tab ? '#fff' : '#495057'
                                                    }}
                                                >
                                                    {tab === 'day' ? 'Ngày' : tab === 'month' ? 'Tháng' : 'Năm'}
                                                </CNavLink>
                                            </CNavItem>
                                        ))}
                                    </CNav>
                                </div>

                                <div style={{ height: '250px' }}>
                                    <Line
                                        data={chartData[timePeriod]} // Use the selected time period data
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: true },
                                                tooltip: { enabled: true, mode: 'index', intersect: false }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: { font: { size: 10 } }
                                                },
                                                x: {
                                                    ticks: { font: { size: 10 } }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>

                </CRow>

                {/*Button*/}
                <CRow className="text-center mt-4">
                    <CCol md={6}>
                        <CButton color="danger" className="w-100" onClick={() => setShowBlockModal(true)}>
                            Chặn cửa hàng
                        </CButton>
                    </CCol>
                    <CCol md={6}>
                        <CButton color="secondary" className="w-100" onClick={() => navigate('/shop-list')}>
                            Quay lại
                        </CButton>
                    </CCol>
                    <CCol md={6} className="mt-3">
                        <CButton color="primary" className="w-100" onClick={() => navigate(`/products-list/${id}`)}>
                            Xem danh sách sản phẩm
                        </CButton>
                    </CCol>
                    <CCol md={6} className="mt-3">
                        <CButton color="info" className="w-100" onClick={() => navigate(`/reports-list/shop/:shopId`)}>
                            Xem danh sách khiếu nại
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>

            <CModal visible={showImageBackground} onClose={() => setShowImageBackground(false)} size="lg" centered>
                <CModalBody
                    className="d-flex justify-content-center align-items-center bg-white position-relative"
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px'
                    }}
                >
                    <FaArrowCircleLeft
                        size={40}
                        className="position-absolute start-0 ms-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handlePrevImage}
                    />
                    {imagesBackground.length > 0 && (
                        <img
                            src={imagesBackground[currentImageIndex]}
                            alt="Ảnh cửa hàng"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    )}
                    <FaArrowCircleRight
                        size={40}
                        className="position-absolute end-0 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextImage}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowImageBackground(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>
            {/* Modal for registration certificate */}
            <CModal visible={showImageRegistrationCertificate} onClose={() => setShowImageRegistrationCertificate(false)} size="lg" centered>
                <CModalBody
                    className="d-flex justify-content-center align-items-center bg-white position-relative"
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px'
                    }}
                >
                    <FaArrowCircleLeft
                        size={40}
                        className="position-absolute start-0 ms-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handlePrevImage}
                    />
                    {imageRegistrationCertificate.length > 0 && (
                        <img
                            src={imageRegistrationCertificate[currentImageIndex]}
                            alt="Giấy phép kinh doanh"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    )}
                    <FaArrowCircleRight
                        size={40}
                        className="position-absolute end-0 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextImage}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowImageRegistrationCertificate(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>
            {/* Modal for food safety certificate */}
            <CModal visible={showFoodSafetyCertificate} onClose={() => setShowFoodSafetyCertificate(false)} size="lg" centered>
                <CModalBody
                    className="d-flex justify-content-center align-items-center bg-white position-relative"
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px'
                    }}
                >
                    <FaArrowCircleLeft
                        size={40}
                        className="position-absolute start-0 ms-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handlePrevImage}
                    />
                    {foodSafetyCertificate.length > 0 && (
                        <img
                            src={foodSafetyCertificate[currentImageIndex]}
                            alt="Giấy phép vệ sinh an toàn thực phẩm"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    )}
                    <FaArrowCircleRight
                        size={40}
                        className="position-absolute end-0 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextImage}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowFoodSafetyCertificate(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>
            {/* Modal for Citizen ID */}
            <CModal visible={showCitizenId} onClose={() => setShowCitizenId(false)} size="lg" centered>
                <CModalBody
                    className="d-flex justify-content-center align-items-center bg-white position-relative"
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        margin: 'auto',
                        padding: '20px',
                        borderRadius: '10px'
                    }}
                >
                    <FaArrowCircleLeft
                        size={40}
                        className="position-absolute start-0 ms-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handlePrevImage}
                    />
                    {citizenIdFront.length > 0 && (
                        <img
                            src={citizenIdFront[currentImageIndex]}
                            alt="Căn cước công dân mặt trước"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    )}
                    <FaArrowCircleRight
                        size={40}
                        className="position-absolute end-0 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={handleNextImage}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowCitizenId(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal inactive */}
            <CModal visible={showBlockModal} onClose={() => setShowBlockModal(false)} centered>
                <CModalHeader>
                    <CModalTitle>Lý do chặn cửa hàng</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        placeholder="Nhập lý do chặn cửa hàng"
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}  // Update reason as user types
                    />
                    {/* Hiển thị lỗi nếu lý do từ chối là trống và người dùng đã nhấn "Xác nhận" */}
                    {isFormSubmitted && !blockReason.trim() && (
                        <div className="text-danger mb-2">Lý do không được để trống.</div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowBlockModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleBlockShop}>Xác nhận</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={showSuccessModal} onClose={() => setShowSuccessModal(false)} centered>
                <CModalHeader>
                    <CModalTitle>Thông báo</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {successMessage}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowSuccessModal(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>

            <ToastContainer />
        </CCard>
    );
};

export default ShopActive;
