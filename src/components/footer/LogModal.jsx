import { use } from 'react';
import MealSelectionModal from '../ean-logging/MealSelectionModal';
import { useNavigate } from 'react-router-dom';

const LogModal = ({ setIsModalOpen }) => {
  const navigate = useNavigate();
  const onClose = () => setIsModalOpen(false);
  const MEAL_OPTIONS = ['Frokost', 'Lunsj', 'Middag', 'Snacks', 'Kvelds'];
  const handleConfirm = (meal) => {
    navigate(`/log-products/${encodeURIComponent(meal)}`);
    setIsModalOpen(false);
  };
  return (
    <>
      <MealSelectionModal
        isOpen={true}
        onClose={onClose}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default LogModal;
