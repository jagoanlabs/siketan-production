// components/TawkToWrapper.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

export default function TawkToWrapper() {
  const location = useLocation();
  const allowedPaths = ["/", "/dashboard"];
  const [tawkReady, setTawkReady] = useState(false);

  useEffect(() => {
    if (!tawkReady) return;

    const Tawk_API = (window as any).Tawk_API;

    if (!Tawk_API) return;

    const isAllowed = allowedPaths.includes(location.pathname);

    // Gunakan optional chaining dan cek fungsi tersedia
    if (isAllowed) {
      Tawk_API.showWidget?.();
    } else {
      Tawk_API.hideWidget?.();
    }

    // Hapus iframe yang tidak diinginkan
    const removeUnwantedIframe = () => {
      try {
        // Hapus iframe berdasarkan ID spesifik
        const unwantedIframe = document.getElementById(
          "jjvc12sfnou41755664284120",
        );

        if (unwantedIframe) {
          unwantedIframe.remove();
          console.log("Unwanted iframe removed");

          return true;
        }

        // Alternatif: Hapus iframe berdasarkan atribut src
        const iframes = document.querySelectorAll('iframe[src="about:blank"]');

        iframes.forEach((iframe) => {
          const style = iframe.getAttribute("style");

          if (
            style &&
            style.includes("bottom:30px") &&
            style.includes("right:20px")
          ) {
            iframe.remove();
            console.log("Unwanted iframe removed by attributes");

            return true;
          }
        });

        return false;
      } catch (e) {
        console.error("Error removing iframe:", e);

        return false;
      }
    };

    // Hapus branding dari widget chat
    const removeBranding = () => {
      try {
        // Cari semua iframe Tawk.to
        const tawkIframes = document.querySelectorAll(
          'iframe[src*="tawk.to"]',
        ) as NodeListOf<HTMLIFrameElement>;

        tawkIframes.forEach((iframe) => {
          // Akses document dari iframe
          const iframeDoc =
            iframe.ownerDocument || iframe.contentWindow?.document;

          if (!iframeDoc) return;

          // Hapus elemen branding
          const brandingElements = iframeDoc.querySelectorAll(
            'a[href*="tawk.to"], .tawk-branding',
          );

          brandingElements.forEach((el: any) => el.remove());

          // Hapus link referal spesifik
          const referralLink = iframeDoc.querySelector(
            'a[href*="utm_source=tawk-messenger"]',
          );

          if (referralLink) referralLink.remove();
        });
      } catch (e) {
        // Error kemungkinan karena kebijakan CORS, kita perlu pendekatan lain
        console.log("Cannot access iframe content directly due to CORS");
      }
    };

    // Jalankan fungsi pembersihan secara periodic
    const cleanupInterval = setInterval(() => {
      const iframeRemoved = removeUnwantedIframe();

      if (iframeRemoved) {
        clearInterval(cleanupInterval);
      }
      removeBranding();
    }, 100);

    // Bersihkan interval ketika komponen unmount
    return () => clearInterval(cleanupInterval);
  }, [location.pathname, tawkReady]);

  if (!allowedPaths.includes(location.pathname)) {
    return <></>;
  }

  return (
    <TawkMessengerReact
      propertyId={import.meta.env.VITE_TAWK_PROPERTY_ID ?? ""}
      widgetId={import.meta.env.VITE_TAWK_WIDGET_ID ?? ""}
      onLoad={() => setTawkReady(true)}
    />
  );
}
