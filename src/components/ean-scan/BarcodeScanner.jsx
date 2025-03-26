import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const BarcodeScanner = ({ onClose, onScanSuccess }) => {
  const html5QrCodeRef = useRef(null);
  const hasScannedRef = useRef(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let scanner;

    const startScanner = async () => {
      const scannerElement = document.getElementById('scanner');
      if (!scannerElement) return;

      scannerElement.innerHTML = '';
      scannerElement.style.background = 'black';

      try {
        const permissionStatus = await navigator.permissions.query({
          name: 'camera',
        });
        if (permissionStatus.state === 'denied') {
          alert('Du har blokkert kameraet.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        // Stop initial stream – html5-qrcode takes over
        stream.getTracks().forEach((track) => track.stop());

        scanner = new Html5Qrcode('scanner');
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 300, height: 300 },
            disableFlip: true,
            formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
          },
          async (decodedText) => {
            if (hasScannedRef.current) return;
            hasScannedRef.current = true;

            try {
              await scanner.stop();
              await scanner.clear();
              html5QrCodeRef.current = null;

              const res = await fetch(
                `https://kassal.app/api/v1/products/ean/${decodedText}`,
                {
                  headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_KASSALAPP_TOKEN}`,
                  },
                }
              );

              const response = await res.json();
              const product = response.data?.products?.[0];

              if (product?.id) {
                onClose();
                onScanSuccess();
                navigate(`/product/${product.id}`, { state: { product } });
              } else {
                alert('Fant ingen produktdata');
                onClose();
              }
            } catch (err) {
              console.error('Fetch error:', err);
              alert('Kunne ikke hente produktdata');
              onClose();
            }
          },
          (err) => console.warn('Scan error:', err)
        );

        setLoading(false);
      } catch (err) {
        console.error('Camera access error:', err);
        alert('Du må gi tilgang til kameraet.');
      }
    };

    const timeout = setTimeout(() => {
      requestAnimationFrame(startScanner);
    }, 300);

    return () => {
      clearTimeout(timeout);
      setLoading(true);
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => html5QrCodeRef.current.clear())
          .catch((err) => console.warn('Stop scanner error:', err));
      }
      html5QrCodeRef.current = null;
    };
  }, [navigate, onClose, onScanSuccess]);

  return (
    <div className="relative p-4 flex flex-col justify-center items-center w-full">
      {/* Camera Preview Container */}
      <div className="relative w-full max-w-md bg-black rounded overflow-hidden flex flex-col justify-center items-center min-h-[400px]">
        <div
          id="scanner"
          className="w-full h-full"
          style={{ position: 'relative' }}
        />

        {/* ⏳ Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-white" />
          </div>
        )}

        {/* 🧭 Instruction Text */}
        <div className="absolute top-2 text-white font-medium text-sm z-30 pointer-events-none">
          Hold strekkoden innenfor rammen
        </div>

        {/* 🔲 Animated Frame */}
        <div className="absolute w-[300px] h-[300px] border-4 border-white rounded-md pointer-events-none z-20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E64D20] to-[#F67B39] animate-scan-line" />
        </div>
      </div>

      {/* ❌ Close Button */}
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white rounded-lg font-medium hover:from-[#d13f18] hover:to-[#e56425] transition-colors z-30"
      >
        Lukk
      </button>

      {/* 🔁 Animation Style */}
      <style>
        {`
          @keyframes scan-line {
            0% { top: 0; }
            100% { top: 100%; }
          }
          .animate-scan-line {
            animation: scan-line 2s linear infinite alternate;
          }
        `}
      </style>
    </div>
  );
};

export default BarcodeScanner;
