import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
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
    CModalTitle, CCardHeader, CNavLink, CNavItem, CNav, CTable, CTableRow, CTableDataCell, CTableBody,
} from '@coreui/react';
import {FaArrowCircleRight, FaArrowCircleLeft} from 'react-icons/fa';
import {
    useGetShopByIdQuery,
    useGetShopRevenueByDayQuery,
    useGetShopRevenueByMonthQuery,
    useGetShopRevenueByYearQuery,
    useInactivateShopMutation
} from '../../service/shopService.js';
import {Line} from "react-chartjs-2";
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
import DatePicker from "react-datepicker";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    useGetTopSellingProductsThisMonthQuery, useGetTopSellingProductsThisYearQuery,
    useGetTopSellingProductsTodayQuery
} from "../../service/productService.js";
import * as PropTypes from "prop-types";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function CTableHeader(props) {
    return null;
}

CTableHeader.propTypes = {children: PropTypes.node};
const ShopActive = () => {
    const [timePeriodRevenue, setTimePeriodRevenue] = useState('day'); // Time period for revenue
    const [timePeriodBestSeller, setTimePeriodBestSeller] = useState('day'); // Time period for best seller
    const [shop, setShop] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();
    // State khởi tạo ngày bắt đầu và ngày kết thúc
    const [startDate, setStartDate] = useState(new Date());  // Ngày bắt đầu
    const [endDate, setEndDate] = useState(new Date());      // Ngày kết thúc

    const {data, error, isLoading} = useGetShopByIdQuery(id);
    const [inactivateShop] = useInactivateShopMutation();

    const [bestSellerData, setBestSellerData] = useState([]);
    const { data: topSellingToday } = useGetTopSellingProductsTodayQuery(id);
    const { data: topSellingMonth } = useGetTopSellingProductsThisMonthQuery(id);
    const { data: topSellingYear } = useGetTopSellingProductsThisYearQuery(id);

    const [revenueData, setRevenueData] = useState([]);
    const formatDate = (date) => {
        return date.toISOString().split('T')[0]; // Chuyển đổi sang định dạng "YYYY-MM-DD"
    };

    const { data: revenueByDay } = useGetShopRevenueByDayQuery({
        shopId: id,
        startDate: formatDate(startDate),  // Định dạng lại startDate
        endDate: formatDate(endDate)       // Định dạng lại endDate
    });
    const { data: revenueByMonth } = useGetShopRevenueByMonthQuery({
        shopId: id,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
    });
    const { data: revenueByYear } = useGetShopRevenueByYearQuery({
        shopId: id,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
    });

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

    const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date for hourly chart


    useEffect(() => {
        if (data) {
            setShop(data);
        }
    }, [data]);

    useEffect(() => {
        if (timePeriodBestSeller === 'day' && topSellingToday) {
            setBestSellerData(topSellingToday);
        } else if (timePeriodBestSeller === 'month' && topSellingMonth) {
            setBestSellerData(topSellingMonth);
        } else if (timePeriodBestSeller === 'year' && topSellingYear) {
            setBestSellerData(topSellingYear);
        }
    }, [timePeriodBestSeller, topSellingToday, topSellingMonth, topSellingYear]);

    useEffect(() => {
        if (timePeriodRevenue === 'day' && revenueByDay) {
            setRevenueData(revenueByDay);
        } else if (timePeriodRevenue === 'month' && revenueByMonth) {
            setRevenueData(revenueByMonth);
        } else if (timePeriodRevenue === 'year' && revenueByYear) {
            setRevenueData(revenueByYear);
        }
    }, [timePeriodRevenue, revenueByDay, revenueByMonth, revenueByYear]);

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
            await inactivateShop({shopId: id, reason: blockReason}).unwrap();
            setShop({...shop, isActive: 'INACTIVE'});

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
            labels: revenueData?.labels || [],
            datasets: [{
                label: 'Doanh thu',
                data: revenueData?.data || [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
        month: {
            labels: revenueData?.labels || [],
            datasets: [{
                label: 'Doanh thu',
                data: revenueData?.data || [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        },
        year: {
            labels: revenueData?.labels || [],
            datasets: [{
                label: 'Doanh thu',
                data: revenueData?.data || [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true
            }]
        }
    };

    const handleTimePeriodRevenueChange = (period) => {
        setTimePeriodRevenue(period); // Update revenue time period
    };

    const handleTimePeriodBestSellerChange = (period) => {
        setTimePeriodBestSeller(period); // Update best seller time period
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
                        <CFormInput disabled value={shop.name}/>
                    </CCol>
                    <CCol>
                        <label>Chủ cửa hàng</label>
                        <CFormInput disabled value={shop.owner.username}/>
                    </CCol>
                    <CCol>
                        <label>Số điện thoại</label>
                        <CFormInput disabled value={shop.phone}/>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={8}>
                        <label>Địa chỉ</label>
                        <CFormInput disabled value={shop.address}/>
                    </CCol>
                    <CCol md={4}>
                        <label>Đánh giá</label>
                        <CFormInput disabled value={shop.rate}/>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={4}>
                        <label>Loại cửa hàng</label>
                        <CFormInput disabled value={shop.sellType}/>
                    </CCol>
                    <CCol md={4}>
                        <label>Giờ hoạt động</label>
                        <CFormInput disabled value={shop.openTime}/>
                    </CCol>
                    <CCol md={4}>
                        <label>Giờ đóng cửa</label>
                        <CFormInput disabled value={shop.closeTime}/>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Mã số thuế</label>
                        <CFormInput disabled value={shop.owner.profile.taxCode}/>
                    </CCol>
                    <CCol md={6}>
                        <label>Trạng thái</label>
                        <CFormInput disabled value={shop.isActive}/>
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{cursor: 'pointer', color: 'blue'}}
                            onClick={() => setShowImageBackground(true)}
                        >
                            Ảnh cửa hàng
                        </label>
                    </CCol>
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{cursor: 'pointer', color: 'blue'}}
                            onClick={() => setShowImageRegistrationCertificate(true)}
                        >
                            Giấy phép kinh doanh
                        </label>
                    </CCol>
                </CRow>
                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{cursor: 'pointer', color: 'blue'}}
                            onClick={() => setShowFoodSafetyCertificate(true)}
                        >
                            Giấy phép vệ sinh an toàn thực phẩm
                        </label>
                    </CCol>
                    <CCol md={6} className="d-flex align-items-center">
                        <label
                            style={{cursor: 'pointer', color: 'blue'}}
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
                                    <CNav variant="pills" className="mb-0">
                                        {['day', 'month', 'year'].map((period) => (
                                            <CNavItem key={period}>
                                                <CNavLink
                                                    active={timePeriodRevenue === period}
                                                    onClick={() => handleTimePeriodRevenueChange(period)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        fontSize: '0.875rem',
                                                        fontWeight: timePeriodRevenue === period ? '600' : '400',
                                                        backgroundColor: timePeriodRevenue === period ? '#6c757d' : '#f8f9fa',
                                                        color: timePeriodRevenue === period ? '#fff' : '#495057',
                                                    }}
                                                >
                                                    {period === 'day' ? 'Ngày' : period === 'month' ? 'Tháng' : 'Năm'}
                                                </CNavLink>
                                            </CNavItem>
                                        ))}
                                    </CNav>

                                </div>

                                <div style={{ height: '250px' }}>
                                    <Line
                                        data={chartData[timePeriodRevenue]}   // Dữ liệu biểu đồ theo thời gian
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: true },
                                                tooltip: { enabled: true, mode: 'index', intersect: false }
                                            },
                                            scales: {
                                                y: { beginAtZero: true, ticks: { font: { size: 10 } } },
                                                x: { ticks: { font: { size: 10 } } }
                                            }
                                        }}
                                    />
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol md={6}>
                        <CCard>
                            <CCardHeader>
                                <strong>Best
                                    Seller</strong> ({timePeriodBestSeller === 'day' ? 'Ngày' : timePeriodBestSeller === 'month' ? 'Tháng' : 'Năm'})

                                {/* Thêm phần chọn ngày, tháng, năm bên trong bảng */}
                                <div className="float-end">
                                <CNav variant="pills" className="mb-0">
                                    {['day', 'month', 'year'].map((period) => (
                                        <CNavItem key={period}>
                                            <CNavLink
                                                active={timePeriodBestSeller === period}
                                                onClick={() => handleTimePeriodBestSellerChange(period)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: timePeriodBestSeller === period ? '600' : '400',
                                                    backgroundColor: timePeriodBestSeller === period ? '#6c757d' : '#f8f9fa',
                                                    color: timePeriodBestSeller === period ? '#fff' : '#495057',
                                                }}
                                            >
                                                {period === 'day' ? 'Ngày' : period === 'month' ? 'Tháng' : 'Năm'}
                                            </CNavLink>
                                        </CNavItem>
                                    ))}
                                </CNav>
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                {bestSellerData[timePeriodBestSeller]?.length > 0 ? (
                                    <CTable hover>
                                        <CTableHeader>
                                            <CTableRow>
                                                <CTableDataCell><strong>Sản phẩm</strong></CTableDataCell>
                                                <CTableDataCell><strong>Số lượng bán</strong></CTableDataCell>
                                            </CTableRow>
                                        </CTableHeader>
                                        <CTableBody>
                                            {bestSellerData.map((product) => (
                                                <CTableRow key={product.id}>
                                                    <CTableDataCell>{product.name}</CTableDataCell>
                                                    <CTableDataCell>{product.sales}</CTableDataCell>
                                                </CTableRow>
                                            ))}
                                        </CTableBody>
                                    </CTable>
                                ) : (
                                    <p>Đang tải dữ liệu...</p>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>

                {/*Button*/}
                <CRow className="text-center mt-4">
                    <CCol md={4}>
                        <CButton color="danger" className="w-100" onClick={() => setShowBlockModal(true)}>
                            Chặn cửa hàng
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="secondary" className="w-100" onClick={() => navigate('/shop-list')}>
                            Quay lại
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="primary" className="w-100" onClick={() => navigate(`/products-list/${id}`)}>
                            Xem danh sách sản phẩm
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
                        style={{cursor: 'pointer'}}
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
                        style={{cursor: 'pointer'}}
                        onClick={handleNextImage}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowImageBackground(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>
            {/* Modal for registration certificate */}
            <CModal visible={showImageRegistrationCertificate}
                    onClose={() => setShowImageRegistrationCertificate(false)} size="lg" centered>
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
                        style={{cursor: 'pointer'}}
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
                        style={{cursor: 'pointer'}}
                        onClick={handleNextImage}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowImageRegistrationCertificate(false)}>Đóng</CButton>
                </CModalFooter>
            </CModal>
            {/* Modal for food safety certificate */}
            <CModal visible={showFoodSafetyCertificate} onClose={() => setShowFoodSafetyCertificate(false)} size="lg"
                    centered>
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
                        style={{cursor: 'pointer'}}
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
                        style={{cursor: 'pointer'}}
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
                        style={{cursor: 'pointer'}}
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
                        style={{cursor: 'pointer'}}
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

            <ToastContainer/>
        </CCard>
    );
};

export default ShopActive;
