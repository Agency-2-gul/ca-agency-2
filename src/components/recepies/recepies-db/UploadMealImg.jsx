import { useState, useRef } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { FaCamera } from 'react-icons/fa';

const UploadMealImg = ({ setMealImageUrl, setError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      setError('Kun bildefiler er tillatt!');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const storage = getStorage();
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name}`;

      const storageRef = ref(storage, `mealImages/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Upload failed:', error);
          setError('Opplasting mislyktes! Prøv igjen.');
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setMealImageUrl(downloadURL);
          setUploading(false);
        }
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Opplasting mislyktes! Prøv igjen.');
      setUploading(false);
    }
  };
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-32 h-32 bg-gray-200 flex items-center justify-center border-2 border-gray-400 cursor-pointer hover:border-gray-600"
        onClick={() => fileInputRef.current.click()}
      >
        <FaCamera className="text-gray-500 text-2xl" />
      </div>
      {uploading && (
        <div className="w-full">
          <div className="bg-gray-200 rounded-full h-2.5 w-32 mx-auto">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-500">
            {uploadProgress}% opplastet
          </p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default UploadMealImg;
