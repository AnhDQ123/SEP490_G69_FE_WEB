import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useGetShopQuery } from '../../service/shopService.js';
import { CSpinner, CFormInput, CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react';

// import icon hình marker
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xPng from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Sửa icon leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2xPng,
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
});

const ShopMap = () => {
    const { data, isLoading } = useGetShopQuery();
    // const shops = data?.content || [];
    // Lọc các cửa hàng có trạng thái "ACTIVE" và có latitude, longitude hợp lệ
    // const activeShops = shops.filter(shop => shop.isActive === "ACTIVE");
    const [activeShops, setActiveShops] = useState([]);
    useEffect(() => {
        if (data?.content) {
            const newActiveShops = data.content.filter(shop => shop.isActive === "ACTIVE");
            if (JSON.stringify(newActiveShops) !== JSON.stringify(activeShops)) {
                setActiveShops(newActiveShops); // Chỉ cập nhật khi nội dung thực sự thay đổi
            }
        }
    }, [data]);
    // console.log(`Số lượng cửa hàng ACTIVE với tọa độ hợp lệ: ${activeShops.length}`); // Kiểm tra số lượng cửa hàng đã lọc

    const [searchQuery, setSearchQuery] = useState(''); // state cho tìm kiếm
    const [filteredShops, setFilteredShops] = useState(activeShops); // state cho các cửa hàng đã lọc
    const [selectedShop, setSelectedShop] = useState(null); // state để lưu cửa hàng đã chọn
    const [modalVisible, setModalVisible] = useState(false); // state để điều khiển modal

    // Hàm lọc cửa hàng theo tên
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query); // Cập nhật searchQuery
    };

    // Cập nhật filteredShops khi searchQuery thay đổi
    useEffect(() => {
        // Lọc cửa hàng khi searchQuery thay đổi
        const filtered = activeShops.filter(shop =>
            shop.name.toLowerCase().includes(searchQuery) // So sánh tên cửa hàng với query
        );
        setFilteredShops(filtered); // Cập nhật filteredShops
    }, [searchQuery, activeShops]); // Chỉ gọi khi searchQuery hoặc activeShops thay đổi

    // Hàm khi click vào Marker, mở Modal và hiển thị thông tin cửa hàng
    const handleMarkerClick = (shop) => {
        setSelectedShop(shop); // Lưu cửa hàng đã chọn
        setModalVisible(true); // Hiển thị modal
    };

    // Đóng modal
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedShop(null); // Reset cửa hàng đã chọn
    };

    useEffect(() => {
        setFilteredShops(activeShops);
    }, [activeShops]);

    if (isLoading) return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <CSpinner color="primary" />
        </div>
    );

    return (
        <div>
            {/* Thanh tìm kiếm */}
            <div style={{ marginBottom: '20px' }}>
                <CFormInput
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Tìm cửa hàng..."
                    style={{ width: '300px', margin: '0 auto' }}
                />
            </div>

            {/* Bản đồ */}
            <MapContainer center={[10.762622, 106.660172]} zoom={12} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredShops.map((shop, idx) => {
                    // console.log(`Latitude: ${shop.latitude}, Longitude: ${shop.longitude}`); // Log tọa độ
                    return (
                        <Marker
                            key={idx}
                            position={[
                                shop.latitude, // Dùng latitude thực từ API
                                shop.longitude // Dùng longitude thực từ API
                            ]}
                            eventHandlers={{
                                click: () => handleMarkerClick(shop), // Mở modal khi click vào Marker
                            }}
                        >
                            <Popup>
                                <b>{shop.name}</b><br />
                                {shop.address}
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Modal hiển thị chi tiết cửa hàng */}
            <CModal
                show={modalVisible}
                onClose={handleCloseModal}
                size="lg"
            >
                <CModalHeader closeButton>
                    <h5>{selectedShop?.name}</h5>
                </CModalHeader>
                <CModalBody>
                    <div>
                        <b>Địa chỉ:</b> {selectedShop?.address}<br />
                        <b>Số điện thoại:</b> {selectedShop?.phone}<br />
                        <b>Mô tả:</b> {selectedShop?.description || "Không có mô tả"}<br />
                        <b>Giờ mở cửa:</b> {selectedShop?.openTime} - {selectedShop?.closeTime}<br />
                        <b>Đánh giá:</b> {selectedShop?.rate} / 5 <br />
                        <b>Chứng nhận an toàn thực phẩm:</b> <a href={selectedShop?.foodSafetyCertificate} target="_blank" rel="noopener noreferrer">Xem</a><br />
                        <b>Giấy chứng nhận đăng ký kinh doanh:</b> <a href={selectedShop?.registrationCertificate} target="_blank" rel="noopener noreferrer">Xem</a><br />
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseModal}>Đóng</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default ShopMap;
