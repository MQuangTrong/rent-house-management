import { Routes, Route } from 'react-router-dom'
import { Home, Login, Register, Room, HomePage, Blog, BookingList, VerifyEmail, Profile, ChangePassword, ResetPassword, RoomDetail, RegisterHost, BlogDetail, PaymentResult, History, HistoryDetail } from './containers/user'
import { HomeSystem, ApproveHost, HomeAdmin, ApproveHostDetail, UserManager, UserLockedManager, UserManagerDetail, AdminProfile, ApprovePost, PostAll, PostDetail, BlogManager, BlogDeletedManager, BlogManagerDetail, AddBlog, EditBlog, GeneralStatistics } from './containers/admin'
import { HomeHost, HomePageHost, RoomList, AddRoom, RoomListDetail, RoomListDelete, EditRoom, AllBooking, AllBookedRoom, AllBookingDetail, BookedUser, BookedUserDetail, HostProfile, ChangePasswordHost, RevenueStatistics } from './containers/host'
import { path } from './ultils/constant'
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho Toast

function App() {
  return (
    <div className="w-screen bg-primary">
      <ScrollToTop />
      <Routes>
        <Route path={path.HOME} element={<Home />} >
          <Route path='*' element={<HomePage />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.REGISTER} element={<Register />} />
          <Route path={path.ROOM} element={<Room />} />
          <Route path={path.BLOG} element={<Blog />} />
          <Route path={path.BOOKING_LIST} element={<BookingList />} />
          <Route path={path.VERIFY_EMAIL} element={<VerifyEmail />} />
          <Route path={path.PROFILE} element={<Profile />} />
          <Route path={path.CHANGE_PASSWORD} element={<ChangePassword />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.ROOM_DETAIL} element={<RoomDetail />} />
          <Route path={path.REGISTER_HOST} element={<RegisterHost />} />
          <Route path={path.BLOG_DETAIL} element={<BlogDetail/>} />
          <Route path={path.PAYMENT_RESULT} element={<PaymentResult/>} />
          <Route path={path.HISTORY} element={<History/>} />
          <Route path={path.HISTORY_DETAIL} element={<HistoryDetail/>} />
        </Route>

        <Route path={path.ADMIN} element={<HomeSystem />} >
          <Route index element={<HomeAdmin />} />
          <Route path={path.APPROVE_HOST} element={<ApproveHost />} />
          <Route path={path.APPROVE_HOST_DETAIL} element={<ApproveHostDetail />} />
          <Route path={path.USER_MANAGER} element={<UserManager />} />
          <Route path={path.USER_LOCKED_MANAGER} element={<UserLockedManager />} />
          <Route path={path.USER_DETAIL} element={<UserManagerDetail />} />
          <Route path={path.ADMIN_PROFILE} element={<AdminProfile />} />
          <Route path={path.APPROVE_POST} element={<ApprovePost />} />
          <Route path={path.POST_ALL} element={<PostAll />} />
          <Route path={path.POST_DETAIL} element={<PostDetail />} />
          <Route path={path.BLOG_ALL} element={<BlogManager />} />
          <Route path={path.BLOG_ALL_DELETED} element={<BlogDeletedManager />} />
          <Route path={path.BLOG_MANAGER_DETAIL} element={<BlogManagerDetail />} />
          <Route path={path.ADD_BLOG} element={<AddBlog />} />
          <Route path={path.EDIT_BLOG} element={<EditBlog />} />
          <Route path={path.GENERAL_STATISTICS} element={<GeneralStatistics />} />
        </Route>

        <Route path={path.HOST} element={<HomeHost />} >
          <Route index element={<HomePageHost />} />
          <Route path={path.ROOM_LIST} element={<RoomList />} />
          <Route path={path.ADD_ROOM} element={<AddRoom />} />
          <Route path={path.EDIT_ROOM} element={<EditRoom />} />
          <Route path={path.ROOM_LIST_DETAIL} element={<RoomListDetail />} />
          <Route path={path.ROOM_LIST_DELETE} element={<RoomListDelete />} />
          <Route path={path.ALL_BOOKING} element={<AllBooking />} />
          <Route path={path.ALL_BOOKED_ROOM} element={<AllBookedRoom />} />
          <Route path={path.ALL_BOOKING_DETAIL} element={<AllBookingDetail />} />
          <Route path={path.BOOKED_USER} element={<BookedUser />} />
          <Route path={path.BOOKED_USER_DETAIL} element={<BookedUserDetail />} />
          <Route path={path.HOST_PROFILE} element={<HostProfile />} />
          <Route path={path.CHANGE_PASSWORD_HOST} element={<ChangePasswordHost />} />
          <Route path={path.REVENUE_STATISTIC} element={<RevenueStatistics />} />
        </Route>
      </Routes>

      {/* Thêm ToastContainer vào đây */}
      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  );
}

export default App;
