import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useNavigate } from 'react-router-dom';

const BarcodeScanner = ({ onClose, onScanSuccess }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const hasScannedRef = useRef(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoInputDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        );
        const selectedDeviceId = videoInputDevices[0]?.deviceId;

        if (!selectedDeviceId) {
          alert('No video input devices found');
          return;
        }

        codeReader
          .decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, err) => {
              if (result && !hasScannedRef.current) {
                hasScannedRef.current = true;

                // ✅ Safely stop scanning
                if (
                  codeReaderRef.current &&
                  typeof codeReaderRef.current.reset === 'function'
                ) {
                  codeReaderRef.current.reset();
                }

                fetchProduct(result.getText());
              }
            }
          )
          .then(() => {
            setLoading(false);
          })
          .catch((err) => {
            console.error('Error starting the video stream:', err);
            alert('Kameraen kunne ikke startes: ' + err);
          });
      })
      .catch((err) => {
        console.error('Error listing video devices:', err);
        alert('Klarte ikke å finne kameraer');
      });

    return () => {
      if (
        codeReaderRef.current &&
        typeof codeReaderRef.current.reset === 'function'
      ) {
        codeReaderRef.current.reset();
      }
    };
  }, [navigate, onClose, onScanSuccess]);

  const fetchProduct = async (decodedText) => {
    try {
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
  };

  return (
    <div className="relative p-4 flex flex-col justify-center items-center w-full">
      <div className="relative w-full max-w-md bg-black rounded overflow-hidden flex justify-center items-center min-h-[400px]">
        <video
          ref={videoRef}
          className="w-full h-full"
          style={{ objectFit: 'cover' }}
          playsInline
          muted
          autoPlay
        />

        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-white" />
          </div>
        )}

        <div className="absolute top-2 text-white font-medium text-sm z-30 pointer-events-none">
          Hold strekkoden innenfor rammen
        </div>

        <div className="absolute w-[250px] h-[250px] border-4 border-white rounded-md pointer-events-none z-20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E64D20] to-[#F67B39] animate-scan-line" />
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white rounded-lg font-medium hover:from-[#d13f18] hover:to-[#e56425] transition-colors z-30"
      >
        Lukk
      </button>

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
