import React, {useState, useEffect} from 'react'
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
import {
    useGetAllUserCountQuery, useGetPendingShipperQuery,
    useGetUserAreShipperCountQuery, useGetUserCountByDayQuery, useGetUserCountByMonthQuery, useGetUserCountByYearQuery,
    useGetUserHaveShopCountQuery
} from "../../service/userService.js";
import {
    useCountAllOrdersQuery,
    useGetOrderCountByStatusAndDayQuery,
    useGetOrderCountByStatusAndMonthQuery,
    useGetOrderCountByStatusAndYearQuery,
    useGetTopSellingProductsThisMonthQuery, useGetTopSellingProductsThisYearQuery,
    useGetTopSellingProductsTodayQuery
} from "../../service/orderService.js";
import {useGetReportPendingCountQuery} from "../../service/reportService.js";
import {useGetShopPendingCountQuery} from "../../service/shopService.js";
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();
    const [chartTabs, setChartTabs] = useState({ bestseller: 'day' });
    const [userTypeTime, setUserTypeTime] = useState('day');
    const [shopStatusTime, setShopStatusTime] = useState('day');
    const [reportedProductsTime, setReportedProductsTime] = useState('day'); // Tab cho sản phẩm bị báo cáo
    const [reportedBlogsTime, setReportedBlogsTime] = useState('day'); // Tab cho blog bị báo cáo

    const [orderStatusTime, setOrderStatusTime] = useState('day');
    const [bestSeller, setbestSeller] = useState('day');// Default to 'day'
    const [chartTabsOrder, setChartTabsOrder] = useState({ order_status: 'CANCELLED' });

    const [topSellingTodayData, setTopSellingTodayData] = useState([]);
    const [topSellingMonthData, setTopSellingMonthData] = useState([]);
    const [topSellingYearData, setTopSellingYearData] = useState([]);

    // Call Api
    const { data: totalShops, isLoading: isCountAllShop } = useGetUserHaveShopCountQuery();
    const { data: totalShippers, isLoading: isShipperLoading } = useGetUserAreShipperCountQuery();
    const { data: totalOrders, isLoading: isOrderLoading } = useCountAllOrdersQuery();
    const { data: totalPendingReports, isLoading: isPendingReportsLoading } = useGetReportPendingCountQuery();
    const { data: totalUsers, isLoading: isCountAllUser } = useGetAllUserCountQuery();
    const { data: pendingShipperCount, isLoading: isShipperPending } = useGetPendingShipperQuery();
    const { data: pendingShopCount, isLoading: isShopPending } = useGetShopPendingCountQuery();

    const { data: dayOrderData, isLoading: isOrderDayLoading } = useGetOrderCountByStatusAndDayQuery({ status: chartTabsOrder['order_status'] });
    const { data: monthOrderData, isLoading: isOrderMonthLoading } = useGetOrderCountByStatusAndMonthQuery({ status: chartTabsOrder['order_status'] });
    const { data: yearOrderData, isLoading: isOrderYearLoading } = useGetOrderCountByStatusAndYearQuery({ status: chartTabsOrder['order_status'] });

    const { data: dayUserData, isLoading: isUserDayLoading } = useGetUserCountByDayQuery({ status: chartTabsOrder['user_status'] });
    const { data: monthUserData, isLoading: isUserMonthLoading } = useGetUserCountByMonthQuery({ status: chartTabsOrder['user_status'] });
    const { data: yearUserData, isLoading: isUserYearLoading } = useGetUserCountByYearQuery({ status: chartTabsOrder['user_status'] });


    const { data: topSellingToday, isLoading: isLoadingToday } = useGetTopSellingProductsTodayQuery();
    const { data: topSellingMonth, isLoading: isLoadingMonth } = useGetTopSellingProductsThisMonthQuery();
    const { data: topSellingYear, isLoading: isLoadingYear } = useGetTopSellingProductsThisYearQuery();

    useEffect(() => {
        if (bestSeller === 'day' && !isLoadingToday) {
            setTopSellingTodayData(topSellingToday);
        }
        if (bestSeller === 'month' && !isLoadingMonth) {
            setTopSellingMonthData(topSellingMonth);
        }
        if (bestSeller === 'year' && !isLoadingYear) {
            setTopSellingYearData(topSellingYear);
        }
    }, [bestSeller, topSellingToday, topSellingMonth, topSellingYear, isLoadingToday, isLoadingMonth, isLoadingYear]);

    const totalPending = (pendingShipperCount || 0) + (pendingShopCount || 0);

    const handleNavigation = (route) => {
        navigate(route);  // Navigate to the given route
    };

    const chartSections = [
        {key: 'reported_products', title: 'Sản phẩm bị báo cáo'},
        {key: 'reported_blogs', title: 'Blog bị báo cáo'},
    ]

    const groupedSections = []
    for (let i = 0; i < chartSections.length; i += 2) {
        groupedSections.push(chartSections.slice(i, i + 2))
    }

    const handleUserStatusChange = (status) => {
        setChartTabs(prev => ({ ...prev, user_status: status }));
    };

    const handleOrderTabChange = (value) => {
        setOrderStatusTime(value);  // Cập nhật tab cho biểu đồ đơn hàng
    };
    const handleBestSellerTabChange = (value) => {
        setbestSeller(value);  // Cập nhật tab cho biểu đồ đơn hàng
    };
    const handleOrderStatusChange = (status) => {
        setChartTabsOrder({ order_status: status });
    };

    const getRealTimeOrderChartData = (mode) => {
        const now = new Date();
        let labels = [];
        let dataPoints = [];

        // Lấy dữ liệu từ API (dạng array)
        const apiArray = mode === 'day' ? dayOrderData
            : mode === 'month' ? monthOrderData
                : yearOrderData;
        console.log(apiArray)
        // Tạo object map từ array để dễ truy cập
        const apiDataMap = {};
        if (apiArray && apiArray.length > 0) {
            apiArray.forEach(item => {
                // Giả sử item có dạng { date: "2023-03-26", count: 5 } hoặc tương tự
                const key = mode === 'day' ? item.date
                    : mode === 'month' ? item.month
                        : item.year;
                apiDataMap[key] = item.count;
            });
        }
        const normalizedDayMap = {};
        for (const [timestamp, value] of Object.entries(apiDataMap)) {
            const dateOnly = (timestamp && !isNaN(new Date(timestamp)))
                ? new Date(timestamp).toISOString().split('T')[0] // Lấy phần ngày
                : null; // Hoặc một giá trị mặc định khác nếu timestamp không hợp lệ
            if (!normalizedDayMap[dateOnly]) {
                normalizedDayMap[dateOnly] = value;
            }
        }
        const normalizedMonthMap = {};

        for (const [timestamp, value] of Object.entries(apiDataMap)) {
            const date = new Date(timestamp);

            // Tạo key theo định dạng MM-YYYY
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const monthKey = `${year}-${month}`;

            // Cộng dồn dữ liệu
            if (!normalizedMonthMap[monthKey]) {
                normalizedMonthMap[monthKey] = value;
            }
        }
        const normalizedYearMap = {};

        for (const [timestamp, value] of Object.entries(apiDataMap)) {
            const date = new Date(timestamp);
            const yearKey = date.getFullYear().toString(); // YYYY

            if (!normalizedYearMap[yearKey]) {
                normalizedYearMap[yearKey] = value;
            }
        }
        console.log(apiDataMap)
        // Tạo dữ liệu theo thời gian thực
        if (mode === 'day') {
            // 7 ngày gần nhất tính từ hôm nay
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(now.getDate() - i);

                // Định dạng label: dd-MM (ví dụ: 26-03)
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                labels.push(`${day}-${month}`);

                // Tìm dữ liệu tương ứng
                const dateKey = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                dataPoints.push(normalizedDayMap[dateKey] || 0); // Nếu không có thì mặc định 0
            }
        }
        else if (mode === 'month') {
            dataPoints = []
            // 6 tháng gần nhất tính từ tháng hiện tại
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

                // Định dạng label: MM-yyyy (ví dụ: 03-2023)
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                labels.push(`${month}-${year}`);

                // Tìm dữ liệu tương ứng
                const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`; // Format: YYYY-MM
                dataPoints.push(normalizedMonthMap[monthKey] || 0);
            }
        }
        else {
            // 5 năm gần nhất tính từ năm hiện tại
            for (let i = 4; i >= 0; i--) {
                const year = now.getFullYear() - i;
                labels.push(year.toString());

                // Tìm dữ liệu tương ứng
                dataPoints.push(normalizedYearMap[year] || 0);
            }
        }

        return {
            labels,
            datasets: [{
                label: 'Số lượng đơn hàng',
                data: dataPoints,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                fill: true
            }]
        };
    };

    const getRealTimeUserChartData = (mode) => {
        const now = new Date();
        let labels = [];
        let counts = [];

        // Lấy dữ liệu từ API
        const apiArray = mode === 'day' ? [...(dayUserData || [])]
            : mode === 'month' ? [...(monthUserData || [])]
                : [...(yearUserData || [])];

        // Kiểm tra dữ liệu
        if (!apiArray || apiArray.length === 0) {
            // Tạo dữ liệu mẫu nếu không có dữ liệu
            if (mode === 'day') {
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(now.getDate() - i);
                    labels.push(`${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}`);
                    counts.push(0);
                }
            } else if (mode === 'month') {
                for (let i = 5; i >= 0; i--) {
                    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    labels.push(`${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`);
                    counts.push(0);
                }
            } else {
                for (let i = 4; i >= 0; i--) {
                    labels.push(`${now.getFullYear() - i}`);
                    counts.push(0);
                }
            }

            return {
                labels,
                datasets: [{
                    label: 'Số lượng người dùng',
                    data: counts,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            };
        }

        // Xử lý dữ liệu thực từ API
        if (mode === 'day') {
            const sortedArray = [...apiArray].sort((a, b) => new Date(a.date) - new Date(b.date));
            sortedArray.forEach(item => {
                const date = new Date(item.date);
                labels.push(`${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}`);
                counts.push(item.count || 0);
            });
        } else if (mode === 'month') {
            const sortedArray = [...apiArray].sort((a, b) => {
                const [aYear, aMonth] = a.month.split('-');
                const [bYear, bMonth] = b.month.split('-');
                return new Date(aYear, aMonth) - new Date(bYear, bMonth);
            });
            sortedArray.forEach(item => {
                const [year, month] = item.month.split('-');
                labels.push(`${month}-${year}`);
                counts.push(item.count || 0);
            });
        } else {
            const sortedArray = [...apiArray].sort((a, b) => a.year - b.year);
            sortedArray.forEach(item => {
                labels.push(item.year.toString());
                counts.push(item.count || 0);
            });
        }

        return {
            labels,
            datasets: [{
                label: 'Số lượng người dùng',
                data: counts,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                fill: true
            }]
        };
    };

    const handleProductTabChange = (value) => {
        setReportedProductsTime(value);
    };

    const handleBlogTabChange = (value) => {
        setReportedBlogsTime(value);
    };


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
                                count: isCountAllUser ? 'Loading...' : totalUsers || 0,
                                color: 'primary',
                                icon: 'cilUser',
                                route: '/user-list', // Add route for navigation
                            },
                            {
                                label: 'Quán',
                                count: isCountAllShop ? 'Loading...' : totalShops || 0,
                                color: 'info',
                                icon: 'cilHome',
                                route: '/shop-list', // Add route for navigation
                            },
                            {
                                label: 'Người giao hàng',
                                count: isShipperLoading ? 'Loading...' : totalShippers || 0,
                                color: 'success',
                                icon: 'cilTruck',
                                route: '/shipper-list', // Add route for navigation
                            },
                            {
                                label: 'Đơn hàng',
                                count: isOrderLoading ? 'Loading...' : totalOrders || 0,
                                color: 'warning',
                                icon: 'cilCart',
                                route: '/order-management', // Add route for navigation
                            },
                            {
                                label: 'Khiếu nại chưa xử lý',
                                count: isPendingReportsLoading ? 'Loading...' : totalPendingReports || 0,  // Sử dụng API gọi tổng số khiếu nại chưa xử lý
                                color: 'danger',
                                icon: 'cilWarning',
                                route: '/reports-list'
                            },
                            {
                                label: 'Danh sách đăng ký đang chờ',
                                count: isShipperPending || isShopPending ? 'Loading...' : totalPending, // Cộng tổng từ cả 2 API
                                color: 'secondary',
                                icon: 'cilClock',
                                route: '/pending-registration-list', // Add route for navigation
                            },
                        ].map((item, idx) => (
                            <CCol key={idx} md={4} className="mb-4">
                                <CCard className={`text-white bg-${item.color}`} onClick={() => handleNavigation(item.route)}>
                                    <CCardBody className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h3>{item.count}</h3>
                                            <p>{item.label}</p>
                                        </div>
                                        <CIcon icon={item.icon} size="xxl" />
                                    </CCardBody>
                                    <div className={`bg-${item.color} p-2 text-center`}>
                                        <CButton color="link" className="text-white p-0">Xem thêm <CIcon icon="cilArrowRight" /></CButton>
                                    </div>
                                </CCard>
                            </CCol>
                        ))}
                    </CRow>
                </CCardBody>
            </CCard>

            {/* User + order by status */}
            <CRow className="mb-4">
                {/* User */}
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            <strong>Thống kê người dùng</strong>
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['day', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={userTypeTime === tab}
                                                onClick={() => handleUserTabChange(tab)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: userTypeTime === tab ? '600' : '400'
                                                }}
                                            >
                                                {tab === 'day' ? 'Ngày' : tab === 'month' ? 'Tháng' : 'Năm'}
                                            </CNavLink>
                                        </CNavItem>
                                    ))}
                                </CNav>
                            </div>
                        </CCardHeader>

                        <CCardBody>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <CDropdown>
                                    <CDropdownToggle color="primary" style={{ borderRadius: '4px' }}>
                                        {chartTabs['user_status'] === 'ACTIVE' && 'Người dùng đang hoạt động ▼'}
                                        {chartTabs['user_status'] === 'INACTIVE' && 'Người dùng bị khóa ▼'}
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        {['ACTIVE', 'INACTIVE'].map((status) => (
                                            <CDropdownItem
                                                key={status}
                                                active={chartTabs['user_status'] === status}
                                                onClick={() => handleUserStatusChange(status)}
                                            >
                                                {status === 'ACTIVE' && 'Người dùng đang hoạt động'}
                                                {status === 'INACTIVE' && 'Người dùng bị khóa'}
                                            </CDropdownItem>
                                        ))}
                                    </CDropdownMenu>
                                </CDropdown>

                                <div className="text-muted small">Số lượng người dùng</div>
                            </div>

                            <div style={{ height: '250px' }}>
                                <Line
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                enabled: true,
                                                mode: 'index',
                                                intersect: false
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    stepSize: 20,
                                                    font: {
                                                        size: 10
                                                    }
                                                },
                                                grid: {
                                                    color: 'rgba(0, 0, 0, 0.05)'
                                                }
                                            },
                                            x: {
                                                ticks: {
                                                    font: {
                                                        size: 10
                                                    }
                                                },
                                                grid: {
                                                    display: false
                                                }
                                            }
                                        },
                                        interaction: {
                                            intersect: false,
                                            mode: 'nearest'
                                        }
                                    }}
                                    data={getRealTimeUserChartData(userTypeTime)}
                                />
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
                {/* Order */}
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            <strong>Thống kê đơn hàng theo trạng thái</strong>
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['day', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={orderStatusTime === tab}
                                                onClick={() => handleOrderTabChange(tab)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: orderStatusTime === tab ? '600' : '400'
                                                }}
                                            >
                                                {tab === 'day' ? 'Ngày' : tab === 'month' ? 'Tháng' : 'Năm'}
                                            </CNavLink>
                                        </CNavItem>
                                    ))}
                                </CNav>
                            </div>
                        </CCardHeader>

                        <CCardBody>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <CDropdown>
                                    <CDropdownToggle color="primary" style={{ borderRadius: '4px' }}>
                                        {chartTabsOrder['order_status'] === 'CANCELLED' && 'Đơn bị huỷ ▼'}
                                        {chartTabsOrder['order_status'] === 'RETURNED' && 'Đơn trả hàng ▼'}
                                        {chartTabsOrder['order_status'] === 'DELIVERED' && 'Đơn thành công ▼'}
                                        {chartTabsOrder['order_status'] === 'RETURN_PENDING' && 'Đơn đang tranh chấp ▼'}
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        {['CANCELLED', 'RETURNED', 'DELIVERED', 'RETURN_PENDING'].map((status) => (
                                            <CDropdownItem
                                                key={status}
                                                active={chartTabsOrder['order_status'] === status}
                                                onClick={() => handleOrderStatusChange(status)}
                                            >
                                                {status === 'CANCELLED' && 'Đơn bị huỷ'}
                                                {status === 'RETURNED' && 'Đơn trả hàng'}
                                                {status === 'DELIVERED' && 'Đơn thành công'}
                                                {status === 'RETURN_PENDING' && 'Đơn đang tranh chấp'}
                                            </CDropdownItem>
                                        ))}
                                    </CDropdownMenu>
                                </CDropdown>

                                <div className="text-muted small">Số lượng đơn hàng</div>
                            </div>

                            <div style={{ height: '250px' }}>
                                <Line
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                enabled: true,
                                                mode: 'index',
                                                intersect: false
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    stepSize: 1,
                                                    font: {
                                                        size: 10
                                                    }
                                                },
                                                grid: {
                                                    color: 'rgba(0, 0, 0, 0.05)'
                                                }
                                            },
                                            x: {
                                                ticks: {
                                                    font: {
                                                        size: 10
                                                    }
                                                },
                                                grid: {
                                                    display: false
                                                }
                                            }
                                        },
                                        interaction: {
                                            intersect: false,
                                            mode: 'nearest'
                                        }
                                    }}
                                    data={getRealTimeOrderChartData(orderStatusTime)}
                                />
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Shop by status + best seller */}
            <CRow className="mb-4">
                {/* Order detail by status*/}
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            Thống kê Shop theo trạng thái
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['day', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={shopStatusTime === tab}
                                                onClick={() => handleShopStatusTabChange(tab)} // Khi click, chỉ thay đổi tab của shop status
                                            >
                                                {tab === 'day' ? 'Ngày' : tab === 'month' ? 'Tháng' : 'Năm'}
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
                                    {chartTabs['shop_status'] || 'registered'}
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {['registered', 'pending', 'deactivated', 'reported'].map((status) => (
                                        <CDropdownItem
                                            key={status}
                                            active={chartTabs['shop_status'] === status}
                                            onClick={() => handleTabChange('shop_status', status)}
                                        >
                                            {status}
                                        </CDropdownItem>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>

                            {/* Biểu đồ Shop Status */}
                            <Line
                                options={userChartOptions(`Shop ${{
                                    registered: 'đã đăng ký',
                                    pending: 'đang đăng ký',
                                    deactivated: 'bị khoá',
                                    reported: 'bị báo cáo'
                                }[chartTabs['shop_status'] || 'registered']}`)}
                                data={getUserChartData(shopStatusTime)} // Sử dụng shopStatusTime cho tab Shop Status
                            />
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Best seller */}
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>Sản phẩm bán chạy</CCardHeader>
                        <CCardBody>
                            <CNav variant="tabs">
                                {['day', 'month', 'year'].map((range) => (
                                    <CNavItem key={range}>
                                        <CNavLink
                                            active={bestSeller === range}
                                            onClick={() => handleBestSellerTabChange(range)} // Khi click, gọi API tương ứng
                                        >
                                            {range === 'day' ? 'Ngày' : range === 'month' ? 'Tháng' : 'Năm'}
                                        </CNavLink>
                                    </CNavItem>
                                ))}
                            </CNav>
                            <CTabContent className="mt-3">
                                <CTabPane visible={bestSeller === 'day'}>
                                    {/* Hiển thị sản phẩm bán chạy theo ngày */}
                                    <BestSellerTable
                                        time="day"
                                        data={isLoadingToday ? [] : topSellingTodayData} // Kiểm tra nếu đang tải thì hiển thị mảng rỗng
                                    />
                                </CTabPane>
                                <CTabPane visible={bestSeller === 'month'}>
                                    {/* Hiển thị sản phẩm bán chạy theo tháng */}
                                    <BestSellerTable
                                        time="month"
                                        data={isLoadingMonth ? [] : topSellingMonthData} // Kiểm tra nếu đang tải thì hiển thị mảng rỗng
                                    />
                                </CTabPane>
                                <CTabPane visible={bestSeller === 'year'}>
                                    {/* Hiển thị sản phẩm bán chạy theo năm */}
                                    <BestSellerTable
                                        time="year"
                                        data={isLoadingYear ? [] : topSellingYearData} // Kiểm tra nếu đang tải thì hiển thị mảng rỗng
                                    />
                                </CTabPane>
                            </CTabContent>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Product report + blog report */}
            <CRow className="mb-4">
                {/* Biểu đồ sản phẩm bị báo cáo */}
                <CCol md={6} key="reported_products">
                    <CCard>
                        <CCardHeader>
                            Sản phẩm bị báo cáo
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['day', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={reportedProductsTime === tab || (!reportedProductsTime && tab === 'day')}
                                                onClick={() => handleProductTabChange(tab)}  // Chỉ cập nhật cho biểu đồ sản phẩm bị báo cáo
                                            >
                                                {tab === 'day' ? 'Ngày' : tab === 'month' ? 'Tháng' : 'Năm'}
                                            </CNavLink>
                                        </CNavItem>
                                    ))}
                                </CNav>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <Line
                                options={userChartOptions("Sản phẩm bị báo cáo")}
                                data={getUserChartData(reportedProductsTime || 'day')} // Dùng reportedProductsTime cho biểu đồ sản phẩm bị báo cáo
                            />
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Biểu đồ blog bị báo cáo */}
                <CCol md={6} key="reported_blogs">
                    <CCard>
                        <CCardHeader>
                            Blog bị báo cáo
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['day', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={reportedBlogsTime === tab || (!reportedBlogsTime && tab === 'day')}
                                                onClick={() => handleBlogTabChange(tab)}  // Chỉ cập nhật cho biểu đồ blog bị báo cáo
                                            >
                                                {tab === 'day' ? 'Ngày' : tab === 'month' ? 'Tháng' : 'Năm'}
                                            </CNavLink>
                                        </CNavItem>
                                    ))}
                                </CNav>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <Line
                                options={userChartOptions("Blog bị báo cáo")}
                                data={getUserChartData(reportedBlogsTime || 'day')} // Dùng reportedBlogsTime cho biểu đồ blog bị báo cáo
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

        </div>
    )
}

const BestSellerTable = ({ time, data }) => {
    // Nếu không có dữ liệu, trả về thông báo
    if (!Array.isArray(data) || data.length === 0) {
        return <div>Không có sản phẩm bán chạy {time} này.</div>;
    }

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
                {data.map((item, index) => (
                    <CTableRow key={index}>
                        <CTableDataCell>{item.name}</CTableDataCell> {/* Thay thế `productName` theo dữ liệu thực */}
                        <CTableDataCell>{item.totalQuantity}</CTableDataCell> {/* Thay thế `quantity` theo dữ liệu thực */}
                        <CTableDataCell>{item.totalValue}</CTableDataCell> {/* Thay thế `revenue` theo dữ liệu thực */}
                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
    );
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

    if (mode === 'day') {
        // 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now); // Tạo ngày mới từ ngày hiện tại
            date.setDate(now.getDate() - i); // Trừ i ngày từ hôm nay
            labels.push(date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })); // Định dạng theo dd/MM
        }
    } else if (mode === 'month') {
        // 7 months
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1); // Tạo ngày đầu tháng, tính từ tháng này và đi ngược lại
            labels.push(date.toLocaleDateString('vi-VN', { month: 'numeric', year: 'numeric' })); // Định dạng theo M-yyyy (1-2025)
        }
    } else {
        // 5 years
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