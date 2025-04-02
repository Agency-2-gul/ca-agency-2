import { useState } from 'react';
import { FaPlus, FaMinus, FaCheckCircle } from 'react-icons/fa';

export default function CreateRecipe() {
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);

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

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="rTitle">
            Hva kaller du din Oppskrift?
          </label>
          <input type="text" name="rTitle" className="p-2 border rounded-md" />
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
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            onClick={addStep}
          >
            <FaPlus /> Legg til Trinn
          </button>
        </div>
        <button type="submit">
          <FaCheckCircle />
        </button>
        <span>Registrer Oppskrift</span>
      </form>
    </div>
  );
}
