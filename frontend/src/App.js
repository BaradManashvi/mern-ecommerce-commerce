// src/App.jsx
import { useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { selectIsAuthChecked, selectLoggedInUser } from './features/auth/AuthSlice';
import { Logout } from './features/auth/components/Logout';
import { Protected } from './features/auth/components/Protected';
import { useAuthCheck } from "./hooks/useAuth/useAuthCheck";
import { useFetchLoggedInUserDetails } from "./hooks/useAuth/useFetchLoggedInUserDetails";
import {
  AddProductPage,
  AdminOrdersPage,
  CartPage,
  CheckoutPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  OrderSuccessPage,
  OtpVerificationPage,
  ProductDetailsPage,
  ProductUpdatePage,
  ResetPasswordPage,
  SignupPage,
  UserOrdersPage,
  UserProfilePage,
  WishlistPage
} from './pages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import ProductData from './pages/ProductData';
import { RootLayout } from './layout/RootLayout';
import ContactPage from './pages/Contact';
import './index.css';

function App() {
  const isAuthChecked = useSelector(selectIsAuthChecked)
  const loggedInUser = useSelector(selectLoggedInUser)

  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:userId/:passwordResetToken" element={<ResetPasswordPage />} />

        {/* Authenticated routes */}
        <Route element={<Protected><RootLayout /></Protected>}>
          {
            loggedInUser?.isAdmin ? (
              // Admin routes
              <>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/product-update/:id" element={<ProductUpdatePage />} />
                <Route path="/admin/add-product" element={<AddProductPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" />} />
              </>
            ) : (
              // User routes
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/ProductList" element={<ProductData />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                <Route path="/orders" element={<UserOrdersPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/contact" element={<ContactPage/>} />
              </>
            )
          }

          {/* Common protected routes */}
          <Route path="/product-details/:id" element={<ProductDetailsPage />} />
          <Route path="/logout" element={<Logout />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  );

  return isAuthChecked ? <RouterProvider router={routes} /> : "";
}

export default App;
