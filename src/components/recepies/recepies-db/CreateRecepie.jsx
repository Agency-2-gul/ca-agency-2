import { useState } from 'react';
import { FaPlus, FaMinus, FaCheckCircle } from 'react-icons/fa';
import useLogNewRecepie from '../../../hooks/useLogRecepies';
import UploadMealImg from './UploadMealImg';

export default function CreateRecipe() {
  const { logRecepie } = useLogNewRecepie();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [mealImageUrl, setMealImageUrl] = useState(''); // New state for meal image
  const [error, setError] = useState('');

  // Adding and removing ingredients and steps...
  const addIngredient = () => setIngredients([...ingredients, '']);
  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index) => {
    if (index > 0) {
      const newSteps = [...steps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
    }
  };
  const removeIngredient = (index) => {
    if (index > 0) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };
  // Handling changes in the input fields...
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Oppgi en tittel for oppskriften!');
      return;
    }
    await logRecepie(title, ingredients, steps, mealImageUrl);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="rTitle">
            Hva kaller du din Oppskrift?
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            name="rTitle"
            className="p-2 border rounded-md"
          />
        </div>

        {/* Meal Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Last opp et bilde av retten:</label>
          <UploadMealImg
            setMealImageUrl={setMealImageUrl}
            setError={setError}
          />
          {mealImageUrl && (
            <img
              src={mealImageUrl}
              alt="Meal"
              className="w-32 h-32 object-cover rounded-md mx-auto"
            />
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Ingredients Section */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Hva trenger du?</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="p-2 border rounded-md flex-grow"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaMinus />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            onClick={addIngredient}
          >
            <FaPlus /> Legg til Ingrediens
          </button>
        </div>

        {/* Process Section */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Forklar Prosessen:</label>
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                className="p-2 border rounded-md flex-grow"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaMinus />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800"
            onClick={addStep}
          >
            <FaPlus /> Legg til Trinn
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center">
          <button type="submit" className=" text-green-400 px-4 p-2">
            <FaCheckCircle className="w-8 h-auto" />
          </button>
          <span>Regitsrer Oppskrift</span>
        </div>
      </form>
    </div>
  );
}
