import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useNavigate } from 'react-router-dom';
import { RiCameraSwitchLine } from 'react-icons/ri';

const BarcodeScanner = ({ onClose, onScanSuccess }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const hasScannedRef = useRef(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [cameraFacingMode, setCameraFacingMode] = useState('user'); // Default to front camera
  const [instructionText, setInstructionText] = useState(
    'Hold strekkoden innenfor rammen'
  );

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    setLoading(true);

    let timeout;

    timeout = setTimeout(() => {
      if (!hasScannedRef.current) {
        setInstructionText('Prøv bakkamera hvis koden ikke går på frontkamera');
      }
    }, 5000);

    const startScanner = async () => {
      try {
        await stopCamera(); // ensure previous stream is cleaned up

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: cameraFacingMode } },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.onloadedmetadata = () => {
            videoRef.current
              .play()
              .catch((err) => console.warn('Video play failed:', err));
          };
        }

        await codeReader.decodeFromVideoElement(
          videoRef.current,
          (result, err) => {
            if (result && !hasScannedRef.current) {
              hasScannedRef.current = true;
              stopCamera();
              fetchProduct(result.getText());
            }
          }
        );

        setLoading(false);
      } catch (err) {
        console.error('Camera error:', err);
        alert('Du må gi tilgang til kameraet: ' + err.message);
      }
    };

    startScanner();

    return () => {
      clearTimeout(timeout);
      stopCamera();
    };
  }, [cameraFacingMode, navigate, onClose, onScanSuccess]);

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
        await stopCamera();
        onClose();
        onScanSuccess();
        navigate(`/product/${product.id}`, { state: { product } });
      } else {
        alert('Fant ingen produktdata');
        await stopCamera();
        onClose();
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Kunne ikke hente produktdata');
      await stopCamera();
      onClose();
    }
  };

  const toggleCamera = () => {
    setCameraFacingMode((prev) =>
      prev === 'environment' ? 'user' : 'environment'
    );
    setInstructionText('Hold strekkoden innenfor rammen');
    hasScannedRef.current = false;
  };

  const stopCamera = async () => {
    try {
      if (
        codeReaderRef.current &&
        typeof codeReaderRef.current.reset === 'function'
      ) {
        await codeReaderRef.current.reset();
        codeReaderRef.current = null;
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    } catch (err) {
      console.warn('stopCamera error:', err);
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
        />

        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-white" />
          </div>
        )}

        <div className="absolute top-2 text-white font-medium text-sm z-30 pointer-events-none text-center px-2">
          {instructionText}
        </div>

        <div className="absolute w-[250px] h-[250px] border-4 border-white rounded-md pointer-events-none z-20">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E64D20] to-[#F67B39] animate-scan-line" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-4 z-40">
        {/* Toggle Camera Button (only on mobile) */}
        <button
          onClick={toggleCamera}
          className="px-4 py-2 border border-white text-white rounded-lg font-medium bg-black/60 hover:bg-black/80 flex items-center justify-center gap-2 block sm:hidden"
        >
          <RiCameraSwitchLine />
          {cameraFacingMode === 'user' ? 'Frontkamera' : 'Bakkamera'}
        </button>

        {/* Close Button */}
        <button
          onClick={async () => {
            await stopCamera();
            onClose();
          }}
          className="px-4 py-2 bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white rounded-lg font-medium hover:from-[#d13f18] hover:to-[#e56425] transition-colors"
        >
          Lukk
        </button>
      </div>

      {/* Animation */}
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
