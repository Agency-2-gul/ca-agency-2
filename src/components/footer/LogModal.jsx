import useFetch from '../../hooks/useFetch';
import { useState, useEffect } from 'react';

const LogModal = ({ setIsModalOpen }) => {
  return (
    <div className="absolute bg-white w-[400px] h-[400px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg p-6 z-1000">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Logg Vare</h1>

      <div className="space-y-4">
        {/* Søkefelt */}
        <div>
          <label
            htmlFor="søk"
            className="block text-sm font-medium text-gray-700"
          >
            Søk vare
          </label>
          <input
            type="text"
            id="søk"
            //value={query}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            placeholder="Skriv inn varenavn..."
          />
        </div>

        {/* Resultater */}

        {/* Knapper */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            onClick={() => setIsModalOpen(false)}
          >
            Avbryt
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            Logg
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogModal;
