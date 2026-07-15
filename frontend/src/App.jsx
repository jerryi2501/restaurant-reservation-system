import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";

// 顧客（Customer）— 予約フロー
const ReservationStartPage    = lazy(() => import("./pages/customer/ReservationStartPage"));    // SC-C01
const CombinationsPage        = lazy(() => import("./pages/customer/CombinationsPage"));        // SC-C02
const ReservationInfoPage     = lazy(() => import("./pages/customer/ReservationInfoPage"));     // SC-C03
const ReservationConfirmPage  = lazy(() => import("./pages/customer/ReservationConfirmPage"));  // SC-C04
const ReservationCompletePage = lazy(() => import("./pages/customer/ReservationCompletePage")); // SC-C05
const ReservationPendingPage  = lazy(() => import("./pages/customer/ReservationPendingPage"));  // SC-C06
const LoginPage               = lazy(() => import("./pages/customer/LoginPage"));               // SC-C07
const RegisterPage            = lazy(() => import("./pages/customer/RegisterPage"));            // SC-C08
const ProfilePage             = lazy(() => import("./pages/customer/ProfilePage"));             // SC-C09
const MyReservationsPage      = lazy(() => import("./pages/customer/MyReservationsPage"));      // SC-C10
const PointHistoryPage        = lazy(() => import("./pages/customer/PointHistoryPage"));        // SC-C11

// スタッフ（Staff）
const StaffLoginPage           = lazy(() => import("./pages/staff/StaffLoginPage"));            // SC-S01
const StaffDashboardPage       = lazy(() => import("./pages/staff/StaffDashboardPage"));        // SC-S02 (+S03 modal)
const ReservationManagementPage = lazy(() => import("./pages/staff/ReservationManagementPage")); // SC-S04
const TableStatusBoardPage     = lazy(() => import("./pages/staff/TableStatusBoardPage"));      // SC-S05

// 管理者（Admin）
const StaffManagementPage    = lazy(() => import("./pages/admin/StaffManagementPage"));    // SC-A01
const TableManagementPage    = lazy(() => import("./pages/admin/TableManagementPage"));    // SC-A02
const TimeSlotManagementPage = lazy(() => import("./pages/admin/TimeSlotManagementPage")); // SC-A03

// 共通
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// アプリ全体の画面遷移（ルーティング）。画面を作るごとに <Route> を追加。
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* 顧客：予約フロー C01 → C06 */}
          <Route path="/"                     element={<ReservationStartPage />} />
          <Route path="/reserve/combinations" element={<CombinationsPage />} />
          <Route path="/reserve/info"         element={<ReservationInfoPage />} />
          <Route path="/reserve/confirm"      element={<ReservationConfirmPage />} />
          <Route path="/reserve/complete"     element={<ReservationCompletePage />} />
          <Route path="/reserve/pending"      element={<ReservationPendingPage />} />

          {/* 顧客：会員系 */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/mypage"              element={<ProfilePage />} />
          <Route path="/mypage/reservations" element={<MyReservationsPage />} />
          <Route path="/mypage/points"       element={<PointHistoryPage />} />

          {/* スタッフ */}
          <Route path="/staff/login"        element={<StaffLoginPage />} />
          <Route path="/staff"              element={<StaffDashboardPage />} />
          <Route path="/staff/reservations" element={<ReservationManagementPage />} />
          <Route path="/staff/tables"       element={<TableStatusBoardPage />} />

          {/* 管理者 */}
          <Route path="/admin/users"      element={<StaffManagementPage />} />
          <Route path="/admin/tables"     element={<TableManagementPage />} />
          <Route path="/admin/time-slots" element={<TimeSlotManagementPage />} />

          {/* 該当なし */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
