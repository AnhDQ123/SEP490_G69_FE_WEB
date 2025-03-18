import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CFormInput,
    CFormSelect,
    CButton,
    CImage,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle
} from '@coreui/react';
import { useGetShopByIdQuery, useUpdateShopStatusMutation } from '../../service/shopService.js';

const ShopReject = () => {
    const [shop, setShop] = useState(null);
    const { id } = useParams(); // Lấy shop_id từ URL
    const navigate = useNavigate();

    // Call API
    const { data, error, isLoading } = useGetShopByIdQuery(id);
    const [updateShopStatus] = useUpdateShopStatusMutation();

    const [showModal, setShowModal] = useState(false); // State cho Modal Popup

    useEffect(() => {
        if (data) {
            setShop(data);
        }
    }, [data]);

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu cửa hàng</p>;
    if (!shop) return <p>Không tìm thấy thông tin cửa hàng</p>;

    // Update status
    const handleApproveShop = async () => {
        try {
            await updateShopStatus({ shopId: id, status: "PENDING" }).unwrap();
            setShop({ ...shop, isActive: "PENDING" }); // Cập nhật UI
            setShowModal(true); // Hiển thị modal sau khi cập nhật thành công
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Cập nhật thất bại!");
        }
    };

    // Hàm xử lý khi bấm nút "OK" trong modal
    const handleModalClose = () => {
        setShowModal(false);
        navigate('/shop-list'); // Điều hướng về màn ShopList
    };

    return (
        <CCard className="p-4">
            <CCardBody>
                <h4 className="mb-3">Danh sách cửa hàng {'>'} Cửa hàng bị từ chối</h4>

                {/* Hàng đầu tiên */}
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Tên cửa hàng</label>
                        <CFormInput disabled value={shop.name} />
                    </CCol>
                </CRow>

                {/* Hàng thứ hai */}
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Chủ cửa hàng</label>
                        <CFormInput disabled value={shop.owner.username} />
                    </CCol>
                    <CCol md={6}>
                        <label>Số điện thoại</label>
                        <CFormInput disabled value={shop.phone} />
                    </CCol>
                </CRow>

                {/* Hàng thứ ba */}
                <CRow className="mb-3">
                    <CCol md={12}>
                        <label>Địa chỉ</label>
                        <CFormInput disabled value={shop.address} />
                    </CCol>
                </CRow>

                {/* Hàng thứ tư */}
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Loại cửa hàng</label>
                        <CFormInput disabled value={shop.sellType}/>
                    </CCol>
                    <CCol md={6}>
                        <label>Giờ hoạt động</label>
                        <CFormInput disabled value={shop.open_time} />
                    </CCol>
                </CRow>

                {/* Hàng thứ năm */}
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Mã số thuế</label>
                        <CFormInput disabled value={shop.tax_code} />
                    </CCol>
                    <CCol md={6}>
                        <label>Trạng thái</label>
                        <CFormSelect disabled value={shop.isActive}>
                            <option value="REJECTED">Bị từ chối</option>
                            <option value="PENDING">Chờ duyệt</option>
                        </CFormSelect>
                    </CCol>
                </CRow>

                {/* Hàng thứ sáu */}
                <CRow className="mb-3">
                    <CCol md={6}>
                        <label>Ảnh cửa hàng</label>
                        <CImage
                            src={shop.backgroundImage}
                            className="border rounded mt-2"
                            width={200}
                            height={150}
                            alt="Ảnh cửa hàng"
                        />
                    </CCol>
                    <CCol md={6}>
                        <label>Giấy phép kinh doanh</label>
                        <CImage
                            src={shop.registration_certificate}
                            className="border rounded mt-2"
                            width={200}
                            height={150}
                            alt="Giấy phép kinh doanh"
                        />
                    </CCol>
                </CRow>

                {/* Nút chức năng */}
                <CRow className="text-center mt-4">
                    <CCol md={4}>
                        <CButton color="warning" className="w-100" onClick={handleApproveShop}>
                            Duyệt lại cửa hàng
                        </CButton>
                    </CCol>
                    <CCol md={4}>
                        <CButton color="secondary" className="w-100" onClick={() => navigate('/shop-list')}>
                            Quay lại
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>

            {/* Modal Popup xác nhận */}
            <CModal visible={showModal} onClose={handleModalClose}>
                <CModalHeader>
                    <CModalTitle>Xác nhận</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    Cửa hàng đã được duyệt lại và đang trong trạng thái chờ duyệt!
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={handleModalClose}>
                        OK
                    </CButton>
                </CModalFooter>
            </CModal>
        </CCard>
    );
};

export default ShopReject;
