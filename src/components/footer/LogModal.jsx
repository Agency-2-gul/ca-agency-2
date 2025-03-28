import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import useProductSearch from '../../hooks/useProductSearch';
import useLogProducts from '../../hooks/useLogProducts';

const LogModal = ({ setIsModalOpen }) => {
  const onClose = () => setIsModalOpen(false);

  return (
    <div className="absolute bg-white w-[400px] max-h-[400px] overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg p-6 z-1000"></div>
  );
};

export default LogModal;
