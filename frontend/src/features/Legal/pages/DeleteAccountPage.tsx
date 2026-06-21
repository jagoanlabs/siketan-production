// @ts-ignore
import { DeleteAccountView } from "../components/DeleteAccountView";

import HomeLayout from "@/layouts/HomeLayout";
import { Navbar } from "@/components/NavBar";
import { Footer } from "@/features/Home/components/Footer";
import PageMeta from "@/layouts/PageMeta";

export const DeleteAccountPage = () => {
  return (
    <>
      <PageMeta
        description="Kebijakan Penghapusan Akun dan Data Aplikasi SiKetan"
        title="Hapus Akun & Data | SiKetan"
      />
      <HomeLayout>
        <Navbar index={-1} />
        <DeleteAccountView />
        <Footer />
      </HomeLayout>
    </>
  );
};
