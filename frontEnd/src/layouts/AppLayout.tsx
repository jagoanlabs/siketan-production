import TawkToWrapper from "@/components/TwakToWrapper";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TawkToWrapper />
      {children}
    </>
  );
}
