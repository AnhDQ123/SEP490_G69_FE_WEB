import UserList from '../page/user/UserList'
import UserDetail from "../page/user/UserDetail.jsx";
import ShopList from "../page/shop/ShopList.jsx";
import ProductList from "../page/product/ProductList.jsx";
import ShopPending from "../page/shop/ShopPending.jsx";
import ShopActive from "../page/shop/ShopActive.jsx";
import ProductDetail from "../page/product/ProductDetail.jsx";
import ShopInactive from "../page/shop/ShopInactive.jsx";
import ShopReject from "../page/shop/ShopReject.jsx";
import BannerList from "../page/banner/BannerList.jsx";
import OrderManagement from "../page/order/OrderManagement.jsx";
import ShipperList from "../page/shipper/ShipperList.jsx";
import ShipperPending from "../page/shipper/ShipperPending.jsx";
import Login from "../page/login/Login.jsx";
import ShipperActive from "../page/shipper/ShipperActive.jsx";
import ShipperInactive from "../page/shipper/ShipperInactive.jsx";
import NotificationsList from "../page/notification/NotificationsList.jsx";
import CategoriesList from "../page/category/CategoriesList.jsx";

// const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/user-list', name: 'UserList', element: UserList },
  { path: '/user/:id', name: 'UserDetail', element: UserDetail },
  { path: '/shop-list', name: 'ShopList', element: ShopList },
  { path: '/products-list', name: 'ProductList', element: ProductList },
  { path: '/product/:id', name: 'ProductDetail', element: ProductDetail },
  { path: '/shop-pending/:id', name: 'ShopPending', element: ShopPending },
  { path: '/shop-active/:id', name: 'ShopActive', element: ShopActive },
  { path: '/shop-inactive/:id', name: 'ShopInactive', element: ShopInactive },
  { path: '/shop-reject/:id', name: 'ShopReject', element: ShopReject },
  { path: '/banners-list', name: 'BannerList', element: BannerList },
  { path: '/order-management', name: 'OrderManagement', element: OrderManagement },
  { path: '/shipper-list', name: 'ShipperList', element: ShipperList },
  { path: '/shipper-pending/:id', name: 'ShipperPending', element: ShipperPending },
  { path: '/shipper-active/:id', name: 'ShipperActive', element: ShipperActive },
  { path: '/shipper-inactive/:id', name: 'ShipperInactive', element: ShipperInactive },
  { path: '/notifications-list', name: 'NotificationsList', element: NotificationsList },
  { path: '/categories-list', name: 'CategoriesList', element: CategoriesList },


  { path: '/login', name: 'Login', element: Login },




]

export default routes
