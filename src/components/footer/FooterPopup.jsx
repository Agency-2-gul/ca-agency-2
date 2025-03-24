import { motion } from 'framer-motion';
const FooterPopup = ({ isOpen, setIsOpen }) => {
  return (
    <motion.div
      className="fixed bottom-0 left-0 w-full h-[60vh] bg-white shadow-xl p-6 rounded-t-2xl transition-all z-0"
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', visualDuration: 0.1, bounce: 0 }}
    >
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-2 right-4 text-xl"
      >
        ❌
      </button>
      <h2 className="text-lg font-bold">Legg til din oppskrift:</h2>
      <form action="submit">
        <div>
          <label htmlFor="title">Navn på din oppskrift</label>
          <input id="title" type="text" />
        </div>
      </form>
    </motion.div>
  );
};

export default FooterPopup;
