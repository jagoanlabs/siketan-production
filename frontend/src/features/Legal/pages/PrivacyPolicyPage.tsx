// @ts-ignore
import privacyPolicyContent from "@/assets/privacy-policy.md?raw";
import { MarkdownViewer } from "../components/MarkdownViewer";
import HomeLayout from "@/layouts/HomeLayout";
import { Navbar } from "@/components/NavBar";
import { Footer } from "@/features/Home/components/Footer";
import PageMeta from "@/layouts/PageMeta";

export const PrivacyPolicyPage = () => {
  return (
    <>
      <PageMeta
        title="Privacy Policy | SiKetan"
        description="Kebijakan Privasi Aplikasi SiKetan Kabupaten Ngawi"
      />
      <HomeLayout>
        <Navbar index={-1} />
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16 mt-20">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10 lg:p-12 border border-gray-100">
            <div className="text-center mb-10">
              <h1 className="text-2xl sm:text-3xl  font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
                Kebijakan Privasi
              </h1>
            </div>

            <MarkdownViewer content={privacyPolicyContent} />

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </HomeLayout>
    </>
  );
};
