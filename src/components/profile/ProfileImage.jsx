import { useState, useRef, useEffect } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
import { FaCamera } from 'react-icons/fa';
import calorieTrackerImg from '../../assets/calorie-tracker.png';

const ProfileImage = ({ user, setError }) => {
  const [profileImageUrl, setProfileImageUrl] = useState(user?.photoURL || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.photoURL) {
      setProfileImageUrl(user.photoURL);
    } else {
      setProfileImageUrl('');
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Kun bildefiler er tillatt.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Maksimal bildestørrelse er 5MB.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const storage = getStorage();
      const auth = getAuth();

      // Delete previous image if exists
      if (profileImageUrl) {
        try {
          const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`;
          const encodedPath = decodeURIComponent(
            profileImageUrl.replace(baseUrl, '').split('?')[0]
          );
          const oldRef = ref(storage, encodedPath);
          await deleteObject(oldRef);
        } catch (err) {
          console.warn('Kunne ikke slette tidligere bilde:', err.message);
        }
      }

      // Upload new image
      const storageRef = ref(storage, `profileImages/${user.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Opplasting mislyktes. Prøv igjen senere.');
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(auth.currentUser, { photoURL: downloadURL });
          setProfileImageUrl(downloadURL);
          setUploading(false);
        }
      );
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Kunne ikke laste opp bildet. Prøv igjen senere.');
      setUploading(false);
    }
  };

  const handleToggleImage = () => {
    if (profileImageUrl) {
      setShowChoiceModal(true);
    } else {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = async () => {
    try {
      const auth = getAuth();
      const storage = getStorage();
      const imageRef = ref(storage, profileImageUrl);
      await deleteObject(imageRef).catch(() => {
        console.warn('Could not delete image from storage.');
      });
      await updateProfile(auth.currentUser, { photoURL: '' });
      setProfileImageUrl('');
      setShowChoiceModal(false);
    } catch (err) {
      console.error('Error removing profile image:', err);
      setError('Kunne ikke fjerne profilbildet.');
    }
  };

  const getInitials = () => {
    if (!user || !user.email) return '?';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div
      className="relative h-[250px] bg-cover bg-center flex flex-col items-center justify-center mb-14"
      style={{ backgroundImage: `url(${calorieTrackerImg})` }}
    >
      <div className="relative">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full shadow-lg object-cover border-2 border-black"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-[#E64D20]">
            <span className="text-4xl font-bold text-gray-500">
              {getInitials()}
            </span>
          </div>
        )}

        <div
          className="absolute bottom-0 right-0 bg-[#E64D20] p-2 rounded-full cursor-pointer hover:bg-[#d13f18] transition shadow-md"
          onClick={handleToggleImage}
          title="Endre profilbilde"
        >
          <FaCamera className="text-white" />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          accept="image/*"
        />
      </div>

      {uploading && (
        <div className="mt-3 w-full">
          <div className="bg-gray-200 rounded-full h-2.5 w-32 mx-auto">
            <div
              className="bg-[#E64D20] h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center mt-1 text-gray-500">
            {uploadProgress}% opplastet
          </p>
        </div>
      )}
      <div className="bg-white/86 p-1 mt-3 rounded-lg">
        <h2 className="text-black font-semibold p-1">
          {user?.displayName || user?.email}
        </h2>
      </div>
      {showChoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h3 className="text-lg font-medium mb-4">
              Hva vil du gjøre med profilbildet?
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRemoveImage}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
              >
                Fjern profilbilde
              </button>
              <button
                onClick={() => {
                  setShowChoiceModal(false);
                  fileInputRef.current.click();
                }}
                className="bg-[#E64D20] text-white px-4 py-2 rounded hover:bg-[#c94a1c] cursor-pointer"
              >
                Erstatt med nytt bilde
              </button>
              <button
                onClick={() => setShowChoiceModal(false)}
                className="text-gray-600 underline mt-2 cursor-pointer"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
