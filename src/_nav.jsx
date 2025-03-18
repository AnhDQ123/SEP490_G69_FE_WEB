import React from 'react'
import CIcon from '@coreui/icons-react'
import {
    freeSet,
} from '@coreui/icons'
import {CNavItem} from '@coreui/react'

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={freeSet.cilSpeedometer} customClassName="nav-icon"/>,
        badge: {
            color: 'info',
            text: 'NEW',
        },
    },
    {
        component: CNavItem,
        name: 'Cửa hàng',
        to: '/shop-list',
        icon: <CIcon icon={freeSet.cilImageBroken} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Tài khoản',
        to: '/user-list',
        icon: <CIcon icon={freeSet.cilUser} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Blog',
        to: '/nav4',
        icon: <CIcon icon={freeSet.cilBook} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Shipper',
        to: '/nav5',
        icon: <CIcon icon={freeSet.cilBike} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Sản phẩm',
        to: '/products-list',
        icon: <CIcon icon={freeSet.cilBurger} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Category',
        to: '/categories-list',
        icon: <CIcon icon={freeSet.cilApple} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Banner',
        to: '/banners-list',
        icon: <CIcon icon={freeSet.cilPaint} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Order',
        to: '/order-management',
        icon: <CIcon icon={freeSet.cilMoney} customClassName="nav-icon"/>,
    },
    {
        component: CNavItem,
        name: 'Thông báo',
        to: '/nav7',
        icon: <CIcon icon={freeSet.cilBell} customClassName="nav-icon"/>,
    },
]

export default _nav
