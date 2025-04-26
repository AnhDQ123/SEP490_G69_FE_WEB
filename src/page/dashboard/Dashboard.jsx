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
    useGetAllUserCountQuery, useGetPendingShipperQuery, useGetShipperRateQuery,
    useGetUserAreShipperCountQuery, useGetUserCountByDayQuery, useGetUserCountByMonthQuery, useGetUserCountByYearQuery,
    useGetUserHaveShopCountQuery, useGetUserRateQuery, useGetUserRegisterPendingQuery
} from "../../service/userService.js";
import {
    useCountAllOrdersQuery,
    useGetOrderCountByStatusAndDayQuery,
    useGetOrderCountByStatusAndMonthQuery,
    useGetOrderCountByStatusAndYearQuery,
    useGetTopSellingProductsThisMonthQuery, useGetTopSellingProductsThisYearQuery,
    useGetTopSellingProductsTodayQuery, useOrderChangeRateQuery
} from "../../service/orderService.js";
import {
    useGetReportCountByDayQuery,
    useGetReportCountByMonthQuery, useGetReportCountByYearQuery,
    useGetReportPendingCountQuery, useReportChangeRateQuery
} from "../../service/reportService.js";
import {
    useGetShopChangeRateQuery,
    useGetShopCountByDayQuery,
    useGetShopCountByMonthQuery, useGetShopCountByYearQuery,
    useGetShopPendingCountQuery
} from "../../service/shopService.js";
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
    const [chartTabs] = useState({bestseller: 'day'});
    const [userTypeTime, setUserTypeTime] = useState('day');
    const [percentageChange, setPercentageChange] = useState(0);
    const [orderPercentageChange, setOrderPercentageChange] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [shopStatusTime, setShopStatusTime] = useState('day');
    const [reportedProductsTime, setReportedProductsTime] = useState('day');
    const [reportedBlogsTime, setReportedBlogsTime] = useState('day');
    const [reportPercentageChange, setReportPercentageChange] = useState(0);

    const [orderStatusTime, setOrderStatusTime] = useState('day');
    const [bestSeller, setbestSeller] = useState('day');
    const [chartTabsOrder, setChartTabsOrder] = useState({order_status: 'CANCELLED'});
    const [chartTabsUser, setChartTabsUser] = useState({user_status: 'ACTIVE'});
    const [chartTabsShop, setChartTabsShop] = useState({shop_status: 'ACTIVE'});
    const [chartTabsProductReport, setChartTabsProductReport] = useState({product_report_status: 'PENDING'});
    const [chartTabsBlogReport, setChartTabsBlogReport] = useState({blog_report_status: 'PENDING'});


    const [topSellingTodayData, setTopSellingTodayData] = useState([]);
    const [topSellingMonthData, setTopSellingMonthData] = useState([]);
    const [topSellingYearData, setTopSellingYearData] = useState([]);

    // Call Api
    const {data: totalShops, isLoading: isCountAllShop} = useGetUserHaveShopCountQuery();
    const {data: totalShippers, isLoading: isShipperLoading} = useGetUserAreShipperCountQuery();
    const {data: totalOrders, isLoading: isOrderLoading} = useCountAllOrdersQuery();
    const {data: totalPendingReports, isLoading: isPendingReportsLoading} = useGetReportPendingCountQuery();
    const {data: totalUsers, isLoading: isCountAllUser} = useGetAllUserCountQuery();
    const {data: pendingShipperCount, isLoading: isShipperPending} = useGetPendingShipperQuery();
    const {data: pendingShopCount, isLoading: isShopPending} = useGetShopPendingCountQuery();


    const {data: dayOrderData} = useGetOrderCountByStatusAndDayQuery({status: chartTabsOrder['order_status']});
    const {data: monthOrderData} = useGetOrderCountByStatusAndMonthQuery({status: chartTabsOrder['order_status']});
    const {data: yearOrderData} = useGetOrderCountByStatusAndYearQuery({status: chartTabsOrder['order_status']});

    const {data: dayUserData} = useGetUserCountByDayQuery({status: chartTabsUser['user_status']});
    const {data: monthUserData} = useGetUserCountByMonthQuery({status: chartTabsUser['user_status']});
    const {data: yearUserData} = useGetUserCountByYearQuery({status: chartTabsUser['user_status']});
    const { data: userRate, isLoading: rateLoading, error } = useGetUserRateQuery();
    const {data: shipperRate } = useGetShipperRateQuery();
    const {data: pendingRegistrations } = useGetUserRegisterPendingQuery();
    const {data: shopRate } = useGetShopChangeRateQuery();
    const {data: orderRate, isLoading: isOrderRateLoading } = useOrderChangeRateQuery();
    const { data: reportRate, isLoading: isReportRateLoading, error: reportRateError } = useReportChangeRateQuery();


    const {data: dayShopData} = useGetShopCountByDayQuery({status: chartTabsShop['shop_status']});
    const {data: monthShopData} = useGetShopCountByMonthQuery({status: chartTabsShop['shop_status']});
    const {data: yearShopData} = useGetShopCountByYearQuery({status: chartTabsShop['shop_status']});


    const {data: dayReportData} = useGetReportCountByDayQuery({
        status: chartTabsProductReport['product_report_status'],
        type: 6
    });
    const {data: monthReportData} = useGetReportCountByMonthQuery({
        status: chartTabsProductReport['product_report_status'],
        type: 6
    });
    const {data: yearReportData} = useGetReportCountByYearQuery({
        status: chartTabsProductReport['product_report_status'],
        type: 6
    });

    const {data: dayBlogReportData} = useGetReportCountByDayQuery({
        status: chartTabsBlogReport['blog_report_status'],
        type: 3
    });
    const {data: monthBlogReportData} = useGetReportCountByMonthQuery({
        status: chartTabsBlogReport['blog_report_status'],
        type: 3
    });
    const {data: yearBlogReportData} = useGetReportCountByYearQuery({
        status: chartTabsBlogReport['blog_report_status'],
        type: 3
    });


    const {data: topSellingToday, isLoading: isLoadingToday} = useGetTopSellingProductsTodayQuery();
    const {data: topSellingMonth, isLoading: isLoadingMonth} = useGetTopSellingProductsThisMonthQuery();
    const {data: topSellingYear, isLoading: isLoadingYear} = useGetTopSellingProductsThisYearQuery();

    useEffect(() => {
        if (!isReportRateLoading && reportRate !== undefined) {
            setReportPercentageChange(reportRate);  // Set percentage change based on API data
        }
    }, [reportRate, isReportRateLoading]);

    useEffect(() => {
        if (!isOrderRateLoading && orderRate !== undefined) {
            setOrderPercentageChange(orderRate);  // Set percentage change based on API data
        }
    }, [orderRate, isOrderRateLoading]);

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
    const shopPercentageChange = shopRate || 0;

    useEffect(() => {
        if (!rateLoading && userRate !== undefined) {
            setPercentageChange(userRate);  // Set percentage change based on API data
            setIsLoading(false);
        }
    }, [userRate, rateLoading]);

    // Handle errors or loading states
    if (rateLoading || isCountAllUser) {
        return <div>Loading data...</div>;
    }

    if (error) {
        return <div>Error fetching user rate: {error.message}</div>;
    }

    // Determine the direction (up/down) and color (green/red) of the arrow based on percentage change
    const handleNavigation = (route) => {
        navigate(route);  // Navigate to the given route
    };

    const handleUserStatusChange = (status) => {
        setChartTabsUser({user_status: status});
    };
    const handleUserTabChange = (value) => {
        setUserTypeTime(value);
    };

    const handleOrderTabChange = (value) => {
        setOrderStatusTime(value);
    };
    const handleOrderStatusChange = (status) => {
        setChartTabsOrder({order_status: status});
    };

    const handleShopTabChange = (value) => {
        setShopStatusTime(value);
    };
    const handleShopStatusChange = (status) => {
        setChartTabsShop({shop_status: status});
    };

    const handleProductReportTabChange = (value) => {
        setReportedProductsTime(value);
    };
    const handleProductReportStatusChange = (status) => {
        setChartTabsProductReport({product_report_status: status});
    };

    const handleBlogReportTabChange = (value) => {
        setReportedBlogsTime(value);
    };
    const handleBlogReportStatusChange = (status) => {
        setChartTabsBlogReport({blog_report_status: status});
    };

    const handleBestSellerTabChange = (value) => {
        setbestSeller(value);
    };


    const normalizedDayMap = (apiDataMap) => {
        const normalizedDayMap = {};
        for (const [timestamp, value] of Object.entries(apiDataMap)) {
            const dateOnly = (timestamp && !isNaN(new Date(timestamp)))
                ? new Date(timestamp).toISOString().split('T')[0] // Lấy phần ngày
                : null; // Hoặc một giá trị mặc định khác nếu timestamp không hợp lệ
            if (!normalizedDayMap[dateOnly]) {
                normalizedDayMap[dateOnly] = value;
            }
        }
        return normalizedDayMap;
    }
    const normalizedMonthMap = (apiDataMap) => {
        const normalizedMonthMap = {};

        for (const [timestamp, value] of Object.entries(apiDataMap)) {
            // Tạo key theo định dạng MM-YYYY
            const listTimeStamp = String(timestamp).split('/')
            const month = listTimeStamp[0];
            const year = listTimeStamp[1];

            const monthKey = `${month}/${year}`;

            // Cộng dồn dữ liệu
            if (!normalizedMonthMap[monthKey]) {
                normalizedMonthMap[monthKey] = value;
            }
        }
        return normalizedMonthMap;
    }
    const normalizedYearMap = (apiDataMap) => {
        const normalizedYearMap = {};

        for (const [timestamp, value] of Object.entries(apiDataMap)) {
            const date = new Date(timestamp);
            const yearKey = date.getFullYear().toString(); // YYYY

            if (!normalizedYearMap[yearKey]) {
                normalizedYearMap[yearKey] = value;
            }
        }
        return normalizedYearMap;
    }
    const getRealTimeChartData = (mode, labelFunction, dayData, monthData, yearData) => {
        const now = new Date();
        let labels = [];
        let dataPoints = [];

        // Lấy dữ liệu từ API (dạng array)
        const apiArray = mode === 'day' ? dayData
            : mode === 'month' ? monthData
                : yearData;
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
        const normalizedDayData = normalizedDayMap(apiDataMap)
        const normalizedMonthData = normalizedMonthMap(apiDataMap)
        const normalizedYearData = normalizedYearMap(apiDataMap)
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
                dataPoints.push(normalizedDayData[dateKey] || 0); // Nếu không có thì mặc định 0
            }
        } else if (mode === 'month') {
            dataPoints = []
            // 6 tháng gần nhất tính từ tháng hiện tại
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

                // Định dạng label: MM-yyyy (ví dụ: 03-2023)
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                labels.push(`${month}-${year}`);

                // Tìm dữ liệu tương ứng
                const monthKey = `${String(date.getMonth() + 1)}/${year}`; // Format: YYYY-MM
                dataPoints.push(normalizedMonthData[monthKey] || 0);
            }
        } else {
            // 5 năm gần nhất tính từ năm hiện tại
            for (let i = 4; i >= 0; i--) {
                const year = now.getFullYear() - i;
                labels.push(year.toString());

                // Tìm dữ liệu tương ứng
                dataPoints.push(normalizedYearData[year] || 0);
            }
        }

        return {
            labels,
            datasets: [{
                label: `${labelFunction}`,
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
                                route: '/user-list',
                                percentage: (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: percentageChange >= 0 ? 'white' : 'white',
                                        fontSize: '20px',
                                        padding: '5px 0',
                                        fontWeight: 'bold',
                                    }}>
                                        {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(2)}%
                                    </div>
                                ),
                            },
                            {
                                label: 'Cửa hàng',
                                count: isCountAllShop ? 'Loading...' : totalShops || 0,
                                color: 'info',
                                icon: 'cilHome',
                                route: '/shop-list',
                                percentage: (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: shopPercentageChange >= 0 ? 'white' : 'white',
                                        fontSize: '20px',
                                        padding: '5px 0',
                                        fontWeight: 'bold',
                                    }}>
                                        {shopPercentageChange >= 0 ? '↑' : '↓'} {Math.abs(shopPercentageChange).toFixed(2)}%
                                    </div>
                                ),
                            },
                            {
                                label: 'Người giao hàng',
                                count: isShipperLoading ? 'Loading...' : totalShippers || 0,
                                color: 'success',
                                icon: 'cilTruck',
                                route: '/shipper-list',
                                percentage: (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: shipperRate >= 0 ? 'white' : 'white',
                                        fontSize: '20px',
                                        padding: '5px 0',
                                        fontWeight: 'bold',
                                    }}>
                                        {shipperRate >= 0 ? '↑' : '↓'} {Math.abs(shipperRate).toFixed(2)}%
                                    </div>
                                ),
                            },
                            {
                                label: 'Đơn hàng',
                                count: isOrderLoading ? 'Loading...' : totalOrders || 0,
                                color: 'warning',
                                icon: 'cilCart',
                                route: '/order-management',
                                percentage: (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: orderPercentageChange >= 0 ? 'white' : 'white',
                                        fontSize: '20px',
                                        padding: '5px 0',
                                        fontWeight: 'bold',
                                    }}>
                                        {orderPercentageChange >= 0 ? '↑' : '↓'} {Math.abs(orderPercentageChange).toFixed(2)}%
                                    </div>
                                ),
                            },
                            {
                                label: 'Đơn tranh chấp',
                                count: isPendingReportsLoading ? 'Loading...' : totalPendingReports || 0,
                                color: 'danger',
                                icon: 'cilWarning',
                                route: '/returned-order-list',
                                percentage: (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: reportPercentageChange >= 0 ? 'white' : 'white',
                                        fontSize: '20px',
                                        padding: '5px 0',
                                        fontWeight: 'bold',
                                    }}>
                                        {reportPercentageChange >= 0 ? '↑' : '↓'} {Math.abs(reportPercentageChange).toFixed(2)}%
                                    </div>
                                ),
                            },
                            {
                                label: 'Danh sách đăng ký đang chờ',
                                count: isShipperPending || isShopPending ? 'Loading...' : totalPending,
                                color: 'secondary',
                                icon: 'cilClock',
                                route: '/pending-registration-list',
                                percentage: (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        color: pendingRegistrations >= 0 ? 'white' : 'white',
                                        fontSize: '20px',
                                        padding: '5px 0',
                                        fontWeight: 'bold',
                                    }}>
                                        {pendingRegistrations >= 0 ? '↑' : '↓'} {Math.abs(pendingRegistrations).toFixed(2)}%
                                    </div>
                                ),
                            },
                        ].map((item, idx) => (
                            <CCol key={idx} md={4} className="mb-4">
                                <CCard className={`text-white bg-${item.color}`} onClick={() => handleNavigation(item.route)} style={{ position: 'relative' }}>
                                    <CCardBody className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h3>{item.count}</h3>
                                            <p>{item.label}</p>
                                        </div>
                                        <CIcon icon={item.icon} size="xxl" />
                                    </CCardBody>

                                    {/* Render the percentage in the top-right corner */}
                                    {item.percentage}

                                    <div className={`bg-${item.color} p-2 text-center`}>
                                        <CButton color="link" className="text-white p-0">
                                            Xem thêm <CIcon icon="cilArrowRight" />
                                        </CButton>
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
                                    <CDropdownToggle color="primary" style={{borderRadius: '4px'}}>
                                        {chartTabsUser['user_status'] === 'ACTIVE' && 'Người dùng đang hoạt động'}
                                        {chartTabsUser['user_status'] === 'INACTIVE' && 'Người dùng bị khóa'}
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
                            </div>

                            <div style={{height: '250px'}}>
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
                                    data={getRealTimeChartData(userTypeTime, "Số lượng người dùng", dayUserData, monthUserData, yearUserData)}
                                />
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Order */}
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            <strong>Thống kê đơn hàng</strong>
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
                                    <CDropdownToggle color="primary" style={{borderRadius: '4px'}}>
                                        {chartTabsOrder['order_status'] === 'CANCELLED' && 'Đơn bị huỷ'}
                                        {chartTabsOrder['order_status'] === 'RETURNED' && 'Đơn trả hàng'}
                                        {chartTabsOrder['order_status'] === 'DELIVERED' && 'Đơn thành công'}
                                        {chartTabsOrder['order_status'] === 'RETURN_PENDING' && 'Đơn đang tranh chấp'}
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
                            </div>

                            <div style={{height: '250px'}}>
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
                                    data={getRealTimeChartData(orderStatusTime, "Số lượng đơn hàng", dayOrderData, monthOrderData, yearOrderData)}
                                />
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

            {/* Shop by status + best seller */}
            <CRow className="mb-4">
                {/*Shop by status*/}
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            <strong>Thống kê cửa hàng</strong>
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['day', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={shopStatusTime === tab}
                                                onClick={() => handleShopTabChange(tab)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: shopStatusTime === tab ? '600' : '400'
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
                                    <CDropdownToggle color="primary" style={{borderRadius: '4px'}}>
                                        {chartTabsShop['shop_status'] === 'ACTIVE' && 'Đang hoạt động'}
                                        {chartTabsShop['shop_status'] === 'INACTIVE' && 'Dừng hoạt động'}
                                        {chartTabsShop['shop_status'] === 'PENDING' && 'Đang đăng ký'}
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        {['ACTIVE', 'INACTIVE', 'PENDING'].map((status) => (
                                            <CDropdownItem
                                                key={status}
                                                active={chartTabsShop['shop_status'] === status}
                                                onClick={() => handleShopStatusChange(status)}
                                            >
                                                {status === 'ACTIVE' && 'Đang hoạt động'}
                                                {status === 'INACTIVE' && 'Dừng hoạt động'}
                                                {status === 'PENDING' && 'Đang đăng ký'}
                                            </CDropdownItem>
                                        ))}
                                    </CDropdownMenu>
                                </CDropdown>
                            </div>

                            <div style={{height: '250px'}}>
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
                                    data={getRealTimeChartData(shopStatusTime, "Số lượng cửa hàng", dayShopData, monthShopData, yearShopData)}
                                />
                            </div>
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
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            <strong>Sản phẩm bị báo cáo</strong>
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['day', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={reportedProductsTime === tab}
                                                onClick={() => handleProductReportTabChange(tab)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: reportedProductsTime === tab ? '600' : '400'
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
                                    <CDropdownToggle color="primary" style={{borderRadius: '4px'}}>
                                        {chartTabsProductReport['product_report_status'] === 'PENDING' && 'Chờ xét duyệt'}
                                        {chartTabsProductReport['product_report_status'] === 'IN_PROGRESS' && 'Đang xét duyệt '}
                                        {chartTabsProductReport['product_report_status'] === 'COMPLETED' && 'Thành công'}
                                        {chartTabsProductReport['product_report_status'] === 'CANCELLED' && 'Hủy bỏ'}
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
                                            <CDropdownItem
                                                key={status}
                                                active={chartTabsProductReport['product_report_status'] === status}
                                                onClick={() => handleProductReportStatusChange(status)}
                                            >
                                                {status === 'PENDING' && 'Chờ xét duyệt'}
                                                {status === 'IN_PROGRESS' && 'Đang xét duyệt'}
                                                {status === 'COMPLETED' && 'Thành công'}
                                                {status === 'CANCELLED' && 'Hủy bỏ'}
                                            </CDropdownItem>
                                        ))}
                                    </CDropdownMenu>
                                </CDropdown>
                            </div>
                            <div style={{height: '250px'}}>
                                <Line
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {display: false},
                                            tooltip: {enabled: true, mode: 'index', intersect: false}
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {stepSize: 1, font: {size: 10}},
                                                grid: {color: 'rgba(0, 0, 0, 0.05)'}
                                            },
                                            x: {ticks: {font: {size: 10}}, grid: {display: false}}
                                        },
                                        interaction: {intersect: false, mode: 'nearest'}
                                    }}
                                    data={getRealTimeChartData(reportedProductsTime, "Sản phẩm bị báo cáo", dayReportData, monthReportData, yearReportData)}
                                />
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Biểu đồ blog bị báo cáo */}
                <CCol md={6}>
                    <CCard>
                        <CCardHeader>
                            <strong>Blog bị báo cáo</strong>
                            <div className="float-end">
                                <CNav variant="pills">
                                    {['day', 'month', 'year'].map((tab) => (
                                        <CNavItem key={tab}>
                                            <CNavLink
                                                active={reportedBlogsTime === tab}
                                                onClick={() => handleBlogReportTabChange(tab)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: reportedBlogsTime === tab ? '600' : '400'
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
                                    <CDropdownToggle color="primary" style={{borderRadius: '4px'}}>
                                        {chartTabsBlogReport['blog_report_status'] === 'PENDING' && 'Chờ xét duyệt'}
                                        {chartTabsBlogReport['blog_report_status'] === 'IN_PROGRESS' && 'Đang xét duyệt'}
                                        {chartTabsBlogReport['blog_report_status'] === 'COMPLETED' && 'Thành công'}
                                        {chartTabsBlogReport['blog_report_status'] === 'CANCELLED' && 'Hủy bỏ'}
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
                                            <CDropdownItem
                                                key={status}
                                                active={chartTabsBlogReport['blog_report_status'] === status}
                                                onClick={() => handleBlogReportStatusChange(status)}
                                            >
                                                {status === 'PENDING' && 'Chờ xét duyệt'}
                                                {status === 'IN_PROGRESS' && 'Đang xét duyệt'}
                                                {status === 'COMPLETED' && 'Thành công'}
                                                {status === 'CANCELLED' && 'Hủy bỏ'}
                                            </CDropdownItem>
                                        ))}
                                    </CDropdownMenu>
                                </CDropdown>
                            </div>
                            <div style={{height: '250px'}}>
                                <Line
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {display: false},
                                            tooltip: {enabled: true, mode: 'index', intersect: false}
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {stepSize: 1, font: {size: 10}},
                                                grid: {color: 'rgba(0, 0, 0, 0.05)'}
                                            },
                                            x: {ticks: {font: {size: 10}}, grid: {display: false}}
                                        },
                                        interaction: {intersect: false, mode: 'nearest'}
                                    }}
                                    data={getRealTimeChartData(reportedBlogsTime, "Blog bị báo cáo", dayBlogReportData, monthBlogReportData, yearBlogReportData)}
                                />
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

        </div>
    )
}

const BestSellerTable = ({time, data}) => {
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

export default Dashboard