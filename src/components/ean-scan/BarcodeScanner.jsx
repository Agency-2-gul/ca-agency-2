import { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const BarcodeScanner = ({ onClose, onScanSuccess }) => {
  const html5QrCodeRef = useRef(null);
  const hasScannedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    let scanner;

    const startScanner = async () => {
      const scannerElement = document.getElementById('scanner');

      if (!scannerElement) {
        console.warn('Scanner container not found');
        return;
      }

      scannerElement.innerHTML = '';
      scannerElement.style.background = 'black';
      scannerElement.style.minHeight = '256px';

      try {
        const permissionStatus = await navigator.permissions.query({
          name: 'camera',
        });
        if (permissionStatus.state === 'denied') {
          alert('Du har blokkert kameraet.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (stream) stream.getTracks().forEach((track) => track.stop());

        scanner = new Html5Qrcode('scanner');
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
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
                onClose(); // ✅ Close modal
                onScanSuccess(); // ✅ Close footer via prop
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
      } catch (err) {
        console.error('Camera access error:', err);
        alert('Du må gi tilgang til kameraet.');
      }
    };

    const timeout = setTimeout(() => {
      startScanner();
    }, 200);

    return () => {
      clearTimeout(timeout);
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
    <div className="p-4">
      <div
        id="scanner"
        className="w-full h-auto rounded"
        style={{ position: 'relative', zIndex: 20 }}
      />
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-gray-200 rounded-lg w-full cursor-pointer"
      >
        Lukk
      </button>
    </div>
  );
};

export default BarcodeScanner;
