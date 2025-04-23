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
    CModalTitle,
    CFormTextarea, CFormCheck
} from '@coreui/react';
import { FaArrowRight, FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { useGetShopByIdQuery, useRejectShopMutation, useApproveShopMutation } from '../../service/shopService.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShopPending = () => {
    const [shop, setShop] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, error, isLoading } = useGetShopByIdQuery(id);
    const [rejectShop] = useRejectShopMutation();
    const [approveShop] = useApproveShopMutation();

    const [showImageBackground, setShowImageBackground] = useState(false);
    const [showImageRegistrationCertificate, setShowImageRegistrationCertificate] = useState(false);
    const [showFoodSafetyCertificate, setShowFoodSafetyCertificate] = useState(false);
    const [showCitizenId, setShowCitizenId] = useState(false);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionReasonError, setRejectionReasonError] = useState('');
    const [showRejectionReasonModal, setShowRejectionReasonModal] = useState(false);

    const [currentSide, setCurrentSide] = useState('front');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        if (data) {
            setShop(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu cửa hàng</p>;
    if (!shop) return <p>Không tìm thấy thông tin cửa hàng</p>;

    // Mở modal xác nhận
    const handleOpenConfirmModal = (status) => {
        setConfirmStatus(status);
        if (status === 'REJECTED') {
            setShowRejectionReasonModal(true); // Hiện modal nhập lý do từ chối khi chọn 'REJECTED'
        } else {
            setShowConfirmModal(true); // Mở modal xác nhận nếu không phải từ chối
        }
    };

    const handleRejectShop = async () => {
        if (!rejectionReason.trim()) {
            setRejectionReasonError('Lý do từ chối là bắt buộc!');
            return;
        }
        setRejectionReasonError('');

        try {
            await rejectShop({ shopId: id, reason: rejectionReason }).unwrap();
            toast.success('Cửa hàng đã bị từ chối!', {
                position: "top-center", // Toast position in the center of the screen
                autoClose: 3000, // Duration for the toast to appear
                hideProgressBar: true, // Hide the progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
            });
            navigate('/shop-list');
        } catch (error) {
            toast.error('Không thể từ chối cửa hàng!', {
                position: "top-center", // Toast position in the center of the screen
                autoClose: 3000, // Duration for the toast to appear
                hideProgressBar: true, // Hide the progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
            });
        } finally {
            setShowRejectionReasonModal(false);
        }
    };

    const handleConfirmUpdateStatus = async () => {
        if (confirmStatus === 'REJECTED') {
            await handleRejectShop();
        } else {
            try {
                await approveShop(id).unwrap();
                toast.success('Cửa hàng đã được duyệt và chuyển sang trạng thái hoạt động', {
                    position: "top-center", // Toast position in the center of the screen
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                navigate('/shop-list');
            } catch (error) {
                toast.error('Cập nhật thất bại!', {
                    position: "top-center", // Toast position in the center of the screen
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            } finally {
                setShowConfirmModal(false);
            }
        }
    };

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách cửa hàng {'>'} Cửa hàng chờ duyệt</h4>
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
                    <CCol md={12}>
                        <label>Địa chỉ</label>
                        <CFormInput disabled value={shop.address} />
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
                        <CFormInput disabled value={shop.tax_code} />
                    </CCol>
                    <CCol md={6}>
                        <label>Trạng thái</label>
                        <CFormInput disabled value={shop.isActive ? 'Chờ duyệt' : 'Hoạt động'} />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label>Ảnh cửa hàng</label>
                        <FaArrowRight
                            className="ms-3"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowImageBackground(true)}
                        />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label>Giấy phép kinh doanh</label>
                        <FaArrowRight
                            className="ms-3"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowImageRegistrationCertificate(true)}
                        />
                    </CCol>
                </CRow>

                {/* New section for food safety certificate */}
                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label>Giấy phép vệ sinh an toàn thực phẩm</label>
                        <FaArrowRight
                            className="ms-3"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowFoodSafetyCertificate(true)} // Show food safety certificate modal
                        />
                    </CCol>
                </CRow>

                {/* New section for Citizen ID */}
                <CRow className="mb-3">
                    <CCol md={6} className="d-flex align-items-center">
                        <label>Căn cước công dân</label>
                        <FaArrowRight
                            className="ms-3"
                            size={24}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowCitizenId(true)} // Show Citizen ID modal
                        />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={12}>
                        <CFormCheck
                            type="checkbox"
                            label="Đã xem đủ thông tin cửa hàng"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />
                    </CCol>
                </CRow>

                <CRow className="text-center mt-4">
                    <CCol md={4}>
                        <CButton
                            color="danger"
                            className="w-100"
                            onClick={() => setShowRejectionReasonModal(true)}
                        >
                            Từ chối đăng ký
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="secondary" className="w-100" onClick={() => navigate('/shop-list')}>
                            Quay lại
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton
                            color="success"
                            className="w-100"
                            onClick={() => setShowConfirmModal(true)}
                        >
                            Duyệt cửa hàng
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>

            {/* Modal xác nhận */}
            <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)} centered>
                <CModalHeader>
                    <CModalTitle>Xác nhận</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Bạn có chắc chắn muốn {confirmStatus === 'ACTIVE' ? 'duyệt' : 'từ chối'} cửa hàng này?
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</CButton>
                    <CButton
                        color={confirmStatus === 'ACTIVE' ? 'success' : 'danger'}
                        onClick={handleConfirmUpdateStatus}
                    >
                        {confirmStatus === 'ACTIVE' ? 'Duyệt' : 'Từ chối'}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Modal nhập lý do từ chối */}
            <CModal visible={showRejectionReasonModal} onClose={() => setShowRejectionReasonModal(false)} centered>
                <CModalHeader>
                    <CModalTitle>Nhập lý do từ chối</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormTextarea
                        rows={4}
                        placeholder="Vui lòng nhập lý do từ chối cửa hàng này"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    {rejectionReasonError && <div className="text-danger mb-2">{rejectionReasonError}</div>} {/* Error message */}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowRejectionReasonModal(false)}>Hủy</CButton>
                    <CButton color="danger" onClick={handleRejectShop}>Từ chối</CButton>
                </CModalFooter>
            </CModal>

            {/* ToastContainer for success/error messages */}
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
        </CCard>
    );
};

export default ShopPending;
