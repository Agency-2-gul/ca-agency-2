export default function CreateRecepie() {
  return (
    <div>
      <form action="">
        <label htmlFor=""></label>
        <input
          type="text"
          placeholder="Navn på oppskrift"
          className="border-2 border-gray-300 p-2 rounded-md w-full mb-4"
        />
        <input
          type="text"
          placeholder="Beskrivelse"
          className="border-2 border-gray-300 p-2 rounded-md w-full mb-4"
        />
        <input
          type="text"
          placeholder="Ingredienser"
          className="border-2 border-gray-300 p-2 rounded-md w-full mb-4"
        />
        <input
          type="text"
          placeholder="Fremgangsmåte"
          className="border-2 border-gray-300 p-2 rounded-md w-full mb-4"
        />
        <input
          type="text"
          placeholder="Bilde URL"
          className="border-2 border-gray-300 p-2 rounded-md w-full mb-4"
        />
      </form>
    </div>
  );
}
