import { motion } from 'framer-motion';
const FooterPopup = ({ isOpen }) => {
  return (
    <motion.div
      className="fixed bottom-0 b bg-gradient-to-t from-[#E64D20] to-[#F67B39] border-1 left-0 w-full h-[45vh]  shadow-xl p-6 rounded-t-2xl transition-all z-0"
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
    >
      {/* Centered Content */}
      <div className="max-w-md mx-auto mt-2 w-full h-full flex flex-col space-y-4">
        {/* Top Row (Two Buttons) */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center bg-white  p-6 rounded-lg flex-grow">
            <span>Logg mat</span>
          </button>
          <button className="flex flex-col items-center justify-center bg-white p-6 rounded-lg flex-grow">
            <span>Strekkodeskanning</span>
          </button>
        </div>

        {/* Bottom List */}
        <div className=" p-3 flex flex-col gap-y-2 rounded-lg  ">
          <div className="flex items-center bg-[#FAFAFA] gap-3 p-4">
            <span className="">Vann</span>
          </div>
          <div className="flex items-center gap-3 p-4">
            <span className="text-white">Vekt</span>
          </div>
          <div className="flex items-center gap-3 p-4">
            <span className="text-white">...</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FooterPopup;
