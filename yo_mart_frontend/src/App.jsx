import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import DashbordPage from "./pages/dashbord/DashbordPage";
import EmployeesPage from "./pages/employees/EmployeesPage";
import CustomerPage from "./pages/customer/CustomerPage";
import MainLayoutAuth from "@/layouts/auth/MainLayoutAuth";
import LoginPage from "./pages/auth/LoginPage";
import POSPageSale from "./pages/POS/POSPageSale";
import ProductPage from "./pages/product/ProductPage";
import CategoryPage from "./pages/category/CategoryPage";
import MainLayoutPOS from "@/layouts/POS/MainLayoutPOS";
import OrderPage from "./pages/order/OrderPage";
import CustomerScreen from "./components/POS/CustomerScreen";
import UserPage from "./pages/auth/UserPage";
import AboutSystem from "./pages/about/AboutSystem";
import AboutTeam from "./pages/about/AboutTeam";
import ProfilePage from "./pages/auth/ProfilePage";
import EditProfilePage from "./pages/auth/EditProfilePage";
import FindAccount from "./pages/auth/FindAccount";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashbordPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/sale/order" element={<OrderPage />} />
          <Route path="/account/users" element={<UserPage />} />
          <Route path="/account/profile" element={<ProfilePage />} />
          <Route path="/account/profile/edit" element={<EditProfilePage />} />
          <Route path="/account/roles" element={<UserPage />} />
          <Route path="/about/system" element={<AboutSystem />} />
          <Route path="/about/team" element={<AboutTeam />} />
          <Route path="*" element={<h1>404-Route Not Found!</h1>} />
        </Route>
        <Route element={<MainLayoutPOS />}>
          <Route path="/sale/pos" element={<POSPageSale />} />
          <Route path="/pos/customer_screen" element={<CustomerScreen />} />
        </Route>
        <Route path="/auth/find_account" element={<FindAccount />} />
        <Route element={<MainLayoutAuth />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
