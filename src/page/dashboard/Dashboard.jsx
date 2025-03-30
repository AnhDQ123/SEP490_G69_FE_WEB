import React, {useState} from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CNav,
    CNavItem,
    CNavLink,
    CTabContent,
    CTabPane,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilCart,
    cilReload
} from '@coreui/icons'
import {Line} from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const Dashboard = () => {
    const [chartTabs, setChartTabs] = useState({})
    const handleTabChange = (key, value) => {
        setChartTabs((prev) => ({...prev, [key]: value}))
    }

    const chartSections = [
        {key: 'reported_products', title: 'Sản phẩm bị báo cáo'},
        {key: 'reported_blogs', title: 'Blog bị báo cáo'},
    ]

    const groupedSections = []
    for (let i = 0; i < chartSections.length; i += 2) {
        groupedSections.push(chartSections.slice(i, i + 2))
    }

    return (
        <div>
            {/* Overview */}
            <CCard className="mb-4">
                <CCardHeader>
                    <strong>Thống kê chung</strong>
                </CCardHeader>
                <CCardBody>
                    <CRow>
                        {[
                            {
                                label: 'Người dùng',
                                count: 1200,
                                color: 'primary',
                                icon: 'cilUser',
                            },
                            {
                                label: 'Quán',
                                count: 340,
                                color: 'info',
                                icon: 'cilHome',
                            },
                            {
                                label: 'Shipper',
                                count: 85,
                                color: 'success',
                                icon: 'cilTruck',
                            },
                            {
                                label: 'Đơn hàng',
                                count: 540,
                                color: 'warning',
                                icon: 'cilCart',
                            },
                            {
                                label: 'Report pending',
                                count: 12,
                                color: 'danger',
                                icon: 'cilWarning',
                            },
                            {
                                label: 'Register pending',
                                count: 23,
                                color: 'secondary',
                                icon: 'cilClock',
                            },
                        ].map((item, idx) => (
                            <CCol key={idx} md={4} className="mb-4">
                                <CCard className={`text-white bg-${item.color}`}>
                                    <CCardBody className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h3>{item.count}</h3>
                                            <p>{item.label}</p>
                                        </div>
                                        <CIcon icon={item.icon} size="xxl" />
                                    </CCardBody>
                                    <div className={`bg-${item.color} p-2 text-center`}>
                                        <CButton color="link" className="text-white p-0">More info <CIcon icon="cilArrowRight" /></CButton>
                                    </div>
                                </CCard>
                            </CCol>
                        ))}
                    </CRow>
                </CCardBody>
            </CCard>

            {/* User + order by status */}
            <CRow className="mb-4">
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            Thống kê người dùng
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['week', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={chartTabs['user_type_time'] === tab || (!chartTabs['user_type_time'] && tab === 'week')}
                                                onClick={() => handleTabChange('user_type_time', tab)}
                                            >
                                                {tab === 'week' ? 'Tuần' : tab === 'month' ? 'Tháng' : 'Năm'}
                                            </CNavLink>
                                        </CNavItem>
                                    ))}
                                </CNav>
                            </div>


                        </CCardHeader>

                        <CCardBody>
                            {/* Dropdown chọn loại người dùng */}
                            <CDropdown className="mb-3">
                                <CDropdownToggle color="primary">
                                    {{
                                        active_users: 'Người dùng đang hoạt động',
                                        deactivated_users: 'Người dùng bị khóa',
                                    }[chartTabs['user_type'] || 'registered_users']}
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {['active_users', 'deactivated_users'].map((type) => (
                                        <CDropdownItem
                                            key={type}
                                            active={chartTabs['user_type'] === type}
                                            onClick={() => handleTabChange('user_type', type)}
                                        >
                                            {{
                                                active_users: 'Người dùng đang hoạt động',
                                                deactivated_users: 'Người dùng bị khóa',
                                            }[type]}
                                        </CDropdownItem>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>

                            {/* Biểu đồ */}
                            <Line
                                options={userChartOptions({
                                    active_users: 'Người dùng đang hoạt động',
                                    deactivated_users: 'Người dùng bị khóa',
                                }[chartTabs['user_type'] || 'active_users'])}
                                data={getUserChartData(chartTabs['user_type_time'] || 'week')}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            Thống kê đơn hàng theo trạng thái
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['week', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={chartTabs['order_status_time'] === tab || (!chartTabs['order_status_time'] && tab === 'week')}
                                                onClick={() => handleTabChange('order_status_time', tab)}
                                            >
                                                {tab === 'week' ? 'Tuần' : tab === 'month' ? 'Tháng' : 'Năm'}
                                            </CNavLink>
                                        </CNavItem>
                                    ))}
                                </CNav>
                            </div>
                        </CCardHeader>

                        <CCardBody>
                            {/* Dropdown chọn loại đơn */}
                            <CDropdown className="mb-3">
                                <CDropdownToggle color="primary">
                                    {{
                                        cancelled_orders: 'Đơn bị huỷ',
                                        returned_orders: 'Đơn trả hàng',
                                        successful_orders: 'Đơn thành công',
                                        disputed_orders: 'Đơn đang tranh chấp',
                                    }[chartTabs['order_status'] || 'cancelled_orders']}
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {['cancelled_orders', 'returned_orders', 'successful_orders', 'disputed_orders'].map((status) => (
                                        <CDropdownItem
                                            key={status}
                                            active={chartTabs['order_status'] === status}
                                            onClick={() => handleTabChange('order_status', status)}
                                        >
                                            {{
                                                cancelled_orders: 'Đơn bị huỷ',
                                                returned_orders: 'Đơn trả hàng',
                                                successful_orders: 'Đơn thành công',
                                                disputed_orders: 'Đơn đang tranh chấp',
                                            }[status]}
                                        </CDropdownItem>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>

                            {/* Biểu đồ */}
                            <Line
                                options={userChartOptions({
                                    cancelled_orders: 'Đơn bị huỷ',
                                    returned_orders: 'Đơn trả hàng',
                                    successful_orders: 'Đơn thành công',
                                    disputed_orders: 'Đơn đang tranh chấp',
                                }[chartTabs['order_status'] || 'cancelled_orders'])}
                                data={getUserChartData(chartTabs['order_status_time'] || 'week')}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>

            </CRow>

            {/* Order detail by status + best seller */}
            <CRow className="mb-4">
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            <CIcon icon={cilCart} className="me-2"/>
                            Chi tiết trạng thái đơn hàng
                        </CCardHeader>
                        <CCardBody>
                            <CTable striped responsive>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Trạng thái</CTableHeaderCell>
                                        <CTableHeaderCell>Hôm nay</CTableHeaderCell>
                                        <CTableHeaderCell>Tuần</CTableHeaderCell>
                                        <CTableHeaderCell>Tháng</CTableHeaderCell>
                                        <CTableHeaderCell>Năm</CTableHeaderCell>
                                        <CTableHeaderCell>Tổng</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {[
                                        'Chờ xác nhận',
                                        'Đang chuẩn bị',
                                        'Đang giao',
                                        'Đã giao',
                                        'Đã huỷ',
                                        'Chờ xử lý trả hàng',
                                        'Đã trả',
                                        'Đã từ chối',
                                        'Từ chối trả hàng',
                                    ].map((status, i) => (
                                        <CTableRow key={i}>
                                            <CTableDataCell>{status}</CTableDataCell>
                                            {[...Array(5)].map((_, j) => (
                                                <CTableDataCell key={j}>$0.00</CTableDataCell>
                                            ))}
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol md={6}>
                    <CCard>
                        <CCardHeader>Sản phẩm bán chạy</CCardHeader>
                        <CCardBody>
                            <CNav variant="tabs">
                                {['day', 'week', 'month'].map((range) => (
                                    <CNavItem key={range}>
                                        <CNavLink
                                            active={chartTabs['bestseller'] === range || (!chartTabs['bestseller'] && range === 'week')}
                                            onClick={() => handleTabChange('bestseller', range)}
                                        >
                                            {range === 'day' ? 'Ngày' : range === 'week' ? 'Tuần' : 'Tháng'}
                                        </CNavLink>
                                    </CNavItem>
                                ))}
                            </CNav>
                            <CTabContent className="mt-3">
                                <CTabPane visible={chartTabs['bestseller'] === 'week' || !chartTabs['bestseller']}>
                                    <BestSellerTable time="day"/>
                                </CTabPane>
                                <CTabPane visible={chartTabs['bestseller'] === 'week'}>
                                    <BestSellerTable time="week"/>
                                </CTabPane>
                                <CTabPane visible={chartTabs['bestseller'] === 'month'}>
                                    <BestSellerTable time="month"/>
                                </CTabPane>
                            </CTabContent>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Product report + blog report */}
            <CRow className="mb-4">
                {chartSections.map(({key, title}) => (
                    <CCol md={6} key={key}>
                        <CCard>
                            <CCardHeader>
                                {title}
                                <div className="float-end">
                                    <CNav variant="pills">
                                        {['week', 'month', 'year'].map((tab) => (
                                            <CNavItem key={tab}>
                                                <CNavLink
                                                    active={chartTabs[key] === tab || (!chartTabs[key] && tab === 'week')}
                                                    onClick={() => handleTabChange(key, tab)}
                                                >
                                                    {tab === 'week' ? 'Tuần' : tab === 'month' ? 'Tháng' : 'Năm'}
                                                </CNavLink>
                                            </CNavItem>
                                        ))}
                                    </CNav>
                                </div>
                            </CCardHeader>
                            <CCardBody>
                                <Line
                                    options={userChartOptions(title)}
                                    data={getUserChartData(chartTabs[key] || 'week')}
                                />
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>

            {/* Shop */}
            <CRow className="mb-4">
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            Thống kê Shop theo trạng thái
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['week', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={chartTabs['shop_status_time'] === tab || (!chartTabs['shop_status_time'] && tab === 'week')}
                                                onClick={() => handleTabChange('shop_status_time', tab)}
                                            >
                                                {tab === 'week' ? 'Tuần' : tab === 'month' ? 'Tháng' : 'Năm'}
                                            </CNavLink>
                                        </CNavItem>
                                    ))}
                                </CNav>
                            </div>
                        </CCardHeader>

                        <CCardBody>
                            {/* Dropdown chọn trạng thái */}
                            <CDropdown className="mb-3">
                                <CDropdownToggle color="primary">
                                    {{
                                        registered: 'Đã đăng ký',
                                        pending: 'Đang đăng ký',
                                        deactivated: 'Bị khoá',
                                        reported: 'Bị báo cáo'
                                    }[chartTabs['shop_status'] || 'registered']}
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {['registered', 'pending', 'deactivated', 'reported'].map((status) => (
                                        <CDropdownItem
                                            key={status}
                                            active={chartTabs['shop_status'] === status}
                                            onClick={() => handleTabChange('shop_status', status)}
                                        >
                                            {{
                                                registered: 'Đã đăng ký',
                                                pending: 'Đang đăng ký',
                                                deactivated: 'Bị khoá',
                                                reported: 'Bị báo cáo'
                                            }[status]}
                                        </CDropdownItem>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>

                            {/* Biểu đồ */}
                            <Line
                                options={userChartOptions(`Shop ${{
                                    registered: 'đã đăng ký',
                                    pending: 'đang đăng ký',
                                    deactivated: 'bị khoá',
                                    reported: 'bị báo cáo'
                                }[chartTabs['shop_status'] || 'registered']}`)}
                                data={getUserChartData(chartTabs['shop_status_time'] || 'week')}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    )
}

const BestSellerTable = ({time}) => {
    const mockData = [
        {name: 'Sản phẩm A', quantity: 10, revenue: '$1,000'},
        {name: 'Sản phẩm B', quantity: 7, revenue: '$700'},
        {name: 'Sản phẩm C', quantity: 5, revenue: '$500'},
    ]
    return (
        <CTable striped responsive>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>Tên sản phẩm</CTableHeaderCell>
                    <CTableHeaderCell>Số lượng</CTableHeaderCell>
                    <CTableHeaderCell>Doanh thu</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {mockData.map((item, index) => (
                    <CTableRow key={index}>
                        <CTableDataCell>{item.name}</CTableDataCell>
                        <CTableDataCell>{item.quantity}</CTableDataCell>
                        <CTableDataCell>{item.revenue}</CTableDataCell>
                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
    )
}

const userChartOptions = (title) => ({
    responsive: true,
    plugins: {
        legend: {position: 'top'},
        title: {display: true, text: title},
    },
})

const getUserChartData = (mode) => {
    const now = new Date();
    let labels = [];

    if (mode === 'week') {
        // 7 ngày gần nhất, định dạng dd/MM
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            labels.push(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
        }
    } else if (mode === 'month') {
        // 6 tháng gần nhất, định dạng MM/yyyy
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            labels.push(date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }));
        }
    } else {
        // 5 năm gần nhất
        const year = now.getFullYear();
        labels = Array.from({ length: 5 }, (_, i) => `${year - 4 + i}`);
    }

    return {
        labels,
        datasets: [
            {
                label: 'Số lượng',
                data: labels.map(() => Math.floor(Math.random() * 200)),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
            },
        ],
    };
};


export default Dashboard