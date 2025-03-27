import { useAuth } from '../../context/authContext';
import { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileImage from './ProfileImage';
import SecuritySettings from './SecuritySettings';
import AccountManagement from './AccountManagement';

const ProfileContainer = () => {
  const { user } = useAuth();
  const [error, setError] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-4 mt-10">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Profile Image and Header */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <ProfileImage user={user} setError={setError} />
            <ProfileHeader user={user} />
          </div>
        </div>

        {/* Right column - Settings/Management */}
        <div className="md:col-span-2 space-y-6">
          <SecuritySettings user={user} setError={setError} />
          <AccountManagement user={user} setError={setError} />
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;
