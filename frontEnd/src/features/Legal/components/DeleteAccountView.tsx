// @ts-ignore
import deleteAccountContent from "@/assets/delete-account-data.md?raw";
import { MarkdownViewer } from "./MarkdownViewer";

interface DeleteAccountViewProps {
  isDashboard?: boolean;
}

export const DeleteAccountView = ({ isDashboard = false }: DeleteAccountViewProps) => {
  return (
    <div className={`container mx-auto px-4 py-8 sm:py-12 lg:py-16 ${isDashboard ? "" : "mt-20"}`}>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-10 lg:p-12 border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl  font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600 mb-4">
            Hapus Akun & Data
          </h1>
        </div>

        <MarkdownViewer content={deleteAccountContent} />

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};
