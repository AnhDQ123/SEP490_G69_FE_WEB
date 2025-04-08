import React from 'react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import { CNavItem, CNavGroup } from '@coreui/react'

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={freeSet.cilSpeedometer} customClassName="nav-icon" />,
        badge: {
            color: 'info',
        },
    },
    {
        component: CNavGroup,
        name: 'Quản lý người dùng',
        icon: <CIcon icon={freeSet.cilUser} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Cửa hàng',
                to: '/shop-list',
            },
            {
                component: CNavItem,
                name: 'Shipper',
                to: '/shipper-list',
            },
            {
                component: CNavItem,
                name: 'Tài khoản',
                to: '/user-list',
            },
        ],
    },
    {
        component: CNavGroup,
        name: 'App FastF&B',
        icon: <CIcon icon={freeSet.cilApps} customClassName="nav-icon" />, // Bạn có thể thay đổi icon cho phù hợp
        items: [
            {
                component: CNavItem,
                name: 'Banner',
                to: '/banners-list',
            },
            {
                component: CNavItem,
                name: 'Danh mục',
                to: '/categories-list',
            },
            {
                component: CNavItem,
                name: 'Blog',
                to: '/blog-list',
            },
            {
                component: CNavItem,
                name: 'Đơn hàng',
                to: '/order-management',
            },
            {
                component: CNavItem,
                name: 'Quản lý trả hàng',
                to: '/returned-order-list',
            },
            {
                component: CNavItem,
                name: 'Thông báo',
                to: '/notifications-list',
            },
        ],
    },

    {
        component: CNavGroup,
        name: 'Hệ thống',
        icon: <CIcon icon={freeSet.cilSettings} customClassName="nav-icon" />,
        items: [
            {
                component: CNavItem,
                name: 'Đơn hàng',
                to: '/reason-config',
            },
            {
                component: CNavItem,
                name: 'Khiếu nại',
                to: '/report-config',
            },
            {
                component: CNavItem,
                name: 'Phương thức giao hàng',
                to: '/delivery-config',
            },
            {
                component: CNavItem,
                name: 'Phương thức thanh toán',
                to: '/payment-config',
            },
        ],
    },
]

export default _nav
