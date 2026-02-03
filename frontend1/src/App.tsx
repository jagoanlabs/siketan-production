import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import LoginPage from "./features/Login/page/LoginPage";
import { HomeInformasiPage } from "./features/HomeInformasi/page/HomeInformasiPage";
import { DetailNews } from "./features/DetailNews/pages/DetailNews";
import { HomeDataPage } from "./features/HomeData/page/HomeDataPage";
import { HomeTokoPage } from "./features/HomeToko/page/HomeTokoPage";
import { DetailProductPage } from "./features/DetailProduct/pages/DetailProductPage";
import { DetailTokoPage } from "./features/DetailToko/pages/DetailTokoPage";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { ResultCekNIK } from "./features/ResultCekNIK/page/ResultCekNIK";
import { DashboardAdminIndex } from "./features/DashboardAdmin/Index/DashboardAdminIndex";
import DashboardAdminLayout from "./layouts/dashboard/AppLayout";
import { DashboardStatistika } from "./features/DashboardAdmin/features/Statistika/Page/DashboardStatistika";
import { ProfileDashboard } from "./features/DashboardAdmin/features/Profile/Page/ProfileDashboard";
import { AktivitasUserPage } from "./features/DashboardAdmin/features/LogAktivitas/Page/AktivitasUserPage";
import { DataSampahPage } from "./features/DashboardAdmin/features/LogAktivitas/Page/DataSampahPage";
import { KelompokTani } from "./features/DashboardAdmin/features/KelompokTani/Page/KelompokTani";
import { EditKelompokTani } from "./features/DashboardAdmin/features/KelompokTani/Page/EditKelompokTani";
import { VerifikasiUserPage } from "./features/DashboardAdmin/features/HakAkses/Page/VerifikasiUserPage";
import { UbahAksesUser } from "./features/DashboardAdmin/features/HakAkses/Page/UbahAksesUser";
import { DataTanamanPage } from "./features/DashboardAdmin/features/DataPertanian/pages/DataTanamanPage";
import { DataPetaniPage } from "./features/DashboardAdmin/features/DataPertanian/pages/DataPetaniPage";
import { CreateDataPetaniPage } from "./features/DashboardAdmin/features/DataPertanian/pages/CreateDataPetaniPage";
import { EditDataPetaniPage } from "./features/DashboardAdmin/features/DataPertanian/pages/EditDataPetaniPage";
import { AcaraPertanian } from "./features/DashboardAdmin/features/InformasiPertanian/Page/Acara/AcaraPertanian";
import { BeritaPertanian } from "./features/DashboardAdmin/features/InformasiPertanian/Page/Berita/BeritaPertanian";
import { EditBeritaPertanian } from "./features/DashboardAdmin/features/InformasiPertanian/Page/Berita/EditBeritaPertanian";
import { CreateAcaraPertanian } from "./features/DashboardAdmin/features/InformasiPertanian/Page/Acara/CreateAcaraPertanian";
import { EditAcaraPertanian } from "./features/DashboardAdmin/features/InformasiPertanian/Page/Acara/EditAcaraPertanian";
import { CreateBeritaPertanian } from "./features/DashboardAdmin/features/InformasiPertanian/Page/Berita/CreateBeritaPertanian";
import { TokoPertanian } from "./features/DashboardAdmin/features/TokoPertanian/Page/TokoPertanian";
import { EditTokoPertanian } from "./features/DashboardAdmin/features/TokoPertanian/Page/EditTokoPertanian";
import { CreateTokoPertanian } from "./features/DashboardAdmin/features/TokoPertanian/Page/CreateTokoPertanian";
import JurnalPenyuluh from "./features/DashboardAdmin/features/InfoPenyuluh/Page/JurnalPenyuluh/JurnalPenyuluh";
import InformasiPenyuluh from "./features/DashboardAdmin/features/InfoPenyuluh/Page/InformasiPenyuluh/InformasiPenyuluh";
import { DetailInformasiPenyuluh } from "./features/DashboardAdmin/features/InfoPenyuluh/Page/InformasiPenyuluh/DetailInformasiPenyuluh";
import { EditInformasiPenyuluh } from "./features/DashboardAdmin/features/InfoPenyuluh/Page/InformasiPenyuluh/EditInformasiPenyuluh";
import CreateInformasiPenyuluh from "./features/DashboardAdmin/features/InfoPenyuluh/Page/InformasiPenyuluh/CreateInformasiPenyuluh";
import { CreateJurnalPenyuluh } from "./features/DashboardAdmin/features/InfoPenyuluh/Page/JurnalPenyuluh/CreateJurnalPenyuluh";
import { EditJurnalPenyuluh } from "./features/DashboardAdmin/features/InfoPenyuluh/Page/JurnalPenyuluh/EditJurnalPenyuluh";
import { DetailStatistika } from "./features/DashboardAdmin/features/Statistika/Page/DetailStatistika";
import { CreateStatistika } from "./features/DashboardAdmin/features/Statistika/Page/CreateStatistika";
import { RealisasiStatistika } from "./features/DashboardAdmin/features/Statistika/Page/RealisasiStatstika";
import { EditTanamanPage } from "./features/DashboardAdmin/features/DataPertanian/pages/EditTanamanPage";
import { CreateTanamanPage } from "./features/DashboardAdmin/features/DataPertanian/pages/CreateTanamanPage";
import { EditStatistika } from "./features/DashboardAdmin/features/Statistika/Page/EditStatistika";
import SetPasswordPage from "./features/SetPassword/page/SetPasswordPage";
import UnauthorizedPage from "./components/UnauthorizedPage";
import { Chatbot } from "./features/DashboardAdmin/features/Chatbot/page/Chatbot";
import { PERMISSIONS, ROLES } from "./helpers/RoleHelper/roleHelpers";
import { InformasiOperator } from "./features/DashboardAdmin/features/Operator/page/InformasiOperator";
import { CreateOperator } from "./features/DashboardAdmin/features/Operator/page/CreateOperator";
import { EditOperator } from "./features/DashboardAdmin/features/Operator/page/EditOperator";

import HomePage from "@/features/Home/page/HomePage";
import SearchPage from "@/features/Search/page/SearchPage";
import RegisterPage from "./features/Register/page/RegisterPage";
import { ProfilePage } from "./features/Profile/page/ProfilePage";
import { PrivacyPolicyPage } from "./features/Legal/pages/PrivacyPolicyPage";
import { DeleteAccountPage } from "./features/Legal/pages/DeleteAccountPage";
import { DeleteAccountView } from "./features/Legal/components/DeleteAccountView";

function App() {
  // const { user } = useAuth();

  return (
    <>
      <Toaster
        closeButton
        richColors
        duration={4000}
        expand={false}
        position="top-right"
      />
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<SearchPage />} path="/search" />
        <Route element={<HomeInformasiPage />} path="/home/information" />
        <Route element={<DetailNews />} path="/home/information/:id" />

        <Route element={<HomeDataPage />} path="/home/data" />

        <Route element={<HomeTokoPage />} path="/home/toko" />
        <Route element={<DetailProductPage />} path="/home/toko/product/:id" />
        <Route element={<DetailTokoPage />} path="/home/toko/toko/:id" />
        {/* dinamic route homeInformasiPage */}
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route element={<SetPasswordPage />} path="/set-password" />
        <Route element={<ProfilePage />} path="/profile" />
        <Route element={<ResultCekNIK />} path="/cek-NIK" />

        <Route element={<PrivacyPolicyPage />} path="/privacy-policy" />
        <Route element={<DeleteAccountPage />} path="/delete-account" />

        <Route element={<UnauthorizedPage />} path="/unauthorized" />

        {/* protected route for auth, or login only */}
        {/* <Route element={<ProtectedRoute />}>
          <Route element={<DashboardPage />} path="/dashboard" />
          
          <Route element={<EditProfile />} path="/profile/edit" /> */}

        {/* petani */}
        {/* <Route element={<ProtectedRoute requiredRoles={[ROLES.PETANI]} />}>
            <Route element={<FormLaporanPetaniPage />} path="/laporan-petani" />
          </Route> */}

        {/* penyuluh */}
        {/* <Route element={<ProtectedRoute requiredRoles={[ROLES.PENYULUH, ROLES.PENYULUH_SWADAYA]} />}>
            <Route element={<FormLaporanPenyuluhPage />} path="/laporan-penyuluh" />
          </Route> */}
        {/* petani dan penyuluh */}
        {/* <Route element={<ProtectedRoute requiredRoles={[ROLES.PETANI, ROLES.PENYULUH, ROLES.PENYULUH_SWADAYA]} />}>
            <Route
              element={<RiwayatLaporanPage />}
              path="/dashboard/riwayat-form"
            />
          </Route> */}

        {/* penyuluh */}
        {/* <Route element={<ProtectedRoute requiredRoles={[ROLES.PENYULUH, ROLES.PENYULUH_SWADAYA]} />}>
            <Route
              element={<FormLaporanPenyuluhPage />}
              path="/laporan-penyuluh"
            />
          </Route> */}

        {/* </Route> */}

        {/* middleware protected route */}
        <Route
          element={
            <ProtectedRoute
              requiredRoles={[
                ROLES.OPERATOR_ADMIN,
                ROLES.OPERATOR_SUPER_ADMIN,
                ROLES.OPERATOR_POKTAN,
                ROLES.PENYULUH,
                ROLES.PENYULUH_SWADAYA,
              ]}
            />
          }
        >
          {/*dashboard admin layout  */}
          <Route element={<DashboardAdminLayout />}>
            {/* index dashboard */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DASHBOARD_INDEX]}
                />
              }
            >
              <Route
                element={<DashboardAdminIndex />}
                path="/dashboard-admin"
              />
            </Route>

            {/* statistik pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.STATISTIC_INDEX]}
                />
              }
            >
              <Route
                element={<DashboardStatistika />}
                path="/dashboard-admin/statistik-pertanian"
              />
            </Route>
            {/* Data Create Statistika Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.STATISTIC_CREATE]}
                />
              }
            >
              <Route
                element={<CreateStatistika />}
                path="/dashboard-admin/statistik-pertanian/create"
              />
            </Route>
            {/* Data Edit Statistika Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.STATISTIC_EDIT]}
                />
              }
            >
              <Route
                element={<EditStatistika />}
                path="/dashboard-admin/statistik-pertanian/:id/edit"
              />
            </Route>
            {/* Data Detail Statistika Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.STATISTIC_DETAIL]}
                />
              }
            >
              <Route
                element={<DetailStatistika />}
                path="/dashboard-admin/statistik-pertanian/:id"
              />
            </Route>
            {/* Data Realisasi Statistika Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.STATISTIC_REALISASI]}
                />
              }
            >
              <Route
                element={<RealisasiStatistika />}
                path="/dashboard-admin/statistik-pertanian/:id/realisasi"
              />
            </Route>
            {/* profile Dashboard */}

            <Route
              element={<ProfileDashboard />}
              path="/dashboard-admin/profile"
            />

            <Route
              element={<DeleteAccountView isDashboard />}
              path="/dashboard-admin/delete-account"
            />

            {/* Hak Akses User */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.VERIFIKASI_USER_INDEX]}
                />
              }
            >
              <Route
                element={<AktivitasUserPage />}
                path="/dashboard-admin/aktivitas-user"
              />
            </Route>
            {/* Data Sampah */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_SAMPAH_INDEX]}
                />
              }
            >
              <Route
                element={<DataSampahPage />}
                path="/dashboard-admin/data-sampah"
              />
            </Route>
            {/* Data Kelompok Tani */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_KELOMPOK_INDEX]}
                />
              }
            >
              <Route
                element={<KelompokTani />}
                path="/dashboard-admin/data-kelompok"
              />
            </Route>
            {/* Edit Data Kelompok Tani */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_KELOMPOK_EDIT]}
                />
              }
            >
              <Route
                element={<EditKelompokTani />}
                path="/dashboard-admin/data-kelompok/edit/:id"
              />
            </Route>
            {/* Verifikasi User */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.VERIFIKASI_USER_INDEX]}
                />
              }
            >
              <Route
                element={<VerifikasiUserPage />}
                path="/dashboard-admin/verifikasi-user"
              />
            </Route>

            {/* Ubah Akses User */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.VERIFIKASI_USER_APPROVE]}
                />
              }
            >
              <Route
                element={<UbahAksesUser />}
                path="/dashboard-admin/ubah-akses-user"
              />
            </Route>
            {/* Data Berita Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.BERITA_PETANI_INDEX]}
                />
              }
            >
              <Route
                element={<BeritaPertanian />}
                path="/dashboard-admin/berita-pertanian"
              />
            </Route>
            {/* Edit Data Berita Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.BERITA_PETANI_EDIT]}
                />
              }
            >
              <Route
                element={<EditBeritaPertanian />}
                path="/dashboard-admin/berita-pertanian/edit/:id"
              />
            </Route>
            {/* Create Data Berita Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.BERITA_PETANI_INDEX]}
                />
              }
            >
              <Route
                element={<CreateBeritaPertanian />}
                path="/dashboard-admin/berita-pertanian/create"
              />
            </Route>
            {/* Data Tanaman */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.TANAMAN_PETANI_INDEX]}
                />
              }
            >
              <Route
                element={<DataTanamanPage />}
                path="/dashboard-admin/data-tanaman"
              />
            </Route>
            {/* Create Data Tanaman */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.TANAMAN_PETANI_CREATE]}
                />
              }
            >
              <Route
                element={<CreateTanamanPage />}
                path="/dashboard-admin/data-tanaman/create"
              />
            </Route>
            {/* Edit Data Tanaman */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.TANAMAN_PETANI_EDIT]}
                />
              }
            >
              <Route
                element={<EditTanamanPage />}
                path="/dashboard-admin/data-tanaman/edit/:id"
              />
            </Route>
            {/* Data Petani */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_PETANI_INDEX]}
                />
              }
            >
              <Route
                element={<DataPetaniPage />}
                path="/dashboard-admin/data-petani"
              />
            </Route>
            {/* Create Data Petani */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_PETANI_CREATE]}
                />
              }
            >
              <Route
                element={<CreateDataPetaniPage />}
                path="/dashboard-admin/data-petani/create"
              />
            </Route>
            {/* Edit Data Petani */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_PETANI_EDIT]}
                />
              }
            >
              <Route
                element={<EditDataPetaniPage />}
                path="/dashboard-admin/data-petani/edit/:id"
              />
            </Route>
            {/* Data Acara Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.ACARA_PETANI_INDEX]}
                />
              }
            >
              <Route
                element={<AcaraPertanian />}
                path="/dashboard-admin/acara-pertanian"
              />
            </Route>
            {/* Edit Data Acara Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.ACARA_PETANI_EDIT]}
                />
              }
            >
              <Route
                element={<EditAcaraPertanian />}
                path="/dashboard-admin/acara-pertanian/edit/:id"
              />
            </Route>
            {/* Create Data Acara Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.ACARA_PETANI_CREATE]}
                />
              }
            >
              <Route
                element={<CreateAcaraPertanian />}
                path="/dashboard-admin/acara-pertanian/create"
              />
            </Route>
            {/* Data Toko Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.TOKO_PETANI_INDEX]}
                />
              }
            >
              <Route
                element={<TokoPertanian />}
                path="/dashboard-admin/daftar-toko"
              />
            </Route>
            {/* Edit Data Toko Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.TOKO_PETANI_EDIT]}
                />
              }
            >
              <Route
                element={<EditTokoPertanian />}
                path="/dashboard-admin/daftar-toko/edit/:id"
              />
            </Route>
            {/* Create Data Toko Pertanian */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.TOKO_PETANI_CREATE]}
                />
              }
            >
              <Route
                element={<CreateTokoPertanian />}
                path="/dashboard-admin/daftar-toko/create"
              />
            </Route>
            {/* Data Informasi Penyuluh */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_PENYULUH_INDEX]}
                />
              }
            >
              <Route
                element={<InformasiPenyuluh />}
                path="/dashboard-admin/data-penyuluh"
              />
            </Route>
            {/* Data Informasi Penyuluh */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_PENYULUH_INDEX]}
                />
              }
            >
              <Route
                element={<InformasiPenyuluh />}
                path="/dashboard-admin/data-penyuluh"
              />
            </Route>
            {/* Data Create Informasi Penyuluh */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_PENYULUH_CREATE]}
                />
              }
            >
              <Route
                element={<CreateInformasiPenyuluh />}
                path="/dashboard-admin/data-penyuluh/create"
              />
            </Route>
            {/* Data Detail Informasi Penyuluh */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_PENYULUH_DETAIL]}
                />
              }
            >
              <Route
                element={<DetailInformasiPenyuluh />}
                path="/dashboard-admin/data-penyuluh/:id"
              />
            </Route>
            {/* Data Edit Informasi Penyuluh */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_PENYULUH_EDIT]}
                />
              }
            >
              <Route
                element={<EditInformasiPenyuluh />}
                path="/dashboard-admin/data-penyuluh/:id/edit"
              />
            </Route>
            {/* Data Jurnal Penyuluh */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.JURNAL_PENYULUH_INDEX]}
                />
              }
            >
              <Route
                element={<JurnalPenyuluh />}
                path="/dashboard-admin/jurnal-penyuluh"
              />
            </Route>

            {/* Create Jurnal Penyuluh */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.JURNAL_PENYULUH_CREATE]}
                />
              }
            >
              <Route
                element={<CreateJurnalPenyuluh />}
                path="/dashboard-admin/jurnal-penyuluh/create"
              />
            </Route>
            {/* EDIT Jurnal Penyuluh */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.JURNAL_PENYULUH_EDIT]}
                />
              }
            >
              <Route
                element={<EditJurnalPenyuluh />}
                path="/dashboard-admin/jurnal-penyuluh/:id/edit"
              />
            </Route>

            {/* chatbot */}
            <Route element={<Chatbot />} path="/dashboard-admin/chat" />

            {/* operator */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_OPERATOR_INDEX]}
                />
              }
            >
              <Route
                element={<InformasiOperator />}
                path="/dashboard-admin/operator"
              />
            </Route>
            {/* Create Operator */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_OPERATOR_CREATE]}
                />
              }
            >
              <Route
                element={<CreateOperator />}
                path="/dashboard-admin/operator/create"
              />
            </Route>
            {/* Edit Operator */}
            <Route
              element={
                <ProtectedRoute
                  requiredPermissions={[PERMISSIONS.DATA_OPERATOR_EDIT]}
                />
              }
            >
              <Route
                element={<EditOperator />}
                path="/dashboard-admin/operator/:id/edit"
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
