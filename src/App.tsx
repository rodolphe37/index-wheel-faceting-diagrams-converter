import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import useTextRecognition from "./TextRecognition";

const App: React.FC = () => {
  const [pavillonInputs, setPavillonInputs] = useState<
    Array<{ facet: string; angle: string; sequence: string }>
  >([]);
  const [crownInputs, setCrownInputs] = useState<
    Array<{ facet: string; angle: string; sequence: string }>
  >([]);
  const [image, setImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<string | "">(""); // Index de la roue actuelle
  const [desiredIndex, setDesiredIndex] = useState<string | "">(""); // Index de la roue souhaitée
  const { recognizedText, isLoading } = useTextRecognition({
    selectedImage: image!,
  });

  // Fonction pour gérer l'importation d'image
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour supprimer l'image et réinitialiser le formulaire
  const removeImage = () => {
    setImage(null);
    setPavillonInputs([]);
    setCrownInputs([]);
    setCurrentIndex("");
    setDesiredIndex("");
  };

  // Fonction pour ajouter une ligne d'input à la colonne Pavillon
  const addPavillonInputRow = useCallback(() => {
    setPavillonInputs([
      ...pavillonInputs,
      { facet: "", angle: "", sequence: "" },
    ]);
  }, [pavillonInputs]);
  // Fonction pour ajouter une ligne d'input à la colonne Crown
  const addCrownInputRow = useCallback(() => {
    setCrownInputs([...crownInputs, { facet: "", angle: "", sequence: "" }]);
  }, [crownInputs]);
  const formatAngle = (value: string) => {
    // Supprimer tous les caractères non numériques et garder seulement les chiffres
    let formattedValue = value.replace(/[^\d]/g, "");

    // Ajouter un point décimal après les 2 premiers chiffres si nécessaire
    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "." + formattedValue.slice(2, 4);
    }

    // Limiter à 2 décimales
    if (formattedValue.length > 5) {
      formattedValue = formattedValue.slice(0, 5);
    }

    // Ajouter le symbole de degré à la fin
    if (formattedValue.length === 5) {
      formattedValue += "°";
    }

    return formattedValue;
  };

  // Fonction pour gérer les changements dans les inputs
  // Définir le type de `field` comme étant une union des clés possibles
  const handleInputChange = (
    index: number,
    field: "facet" | "angle" | "sequence",
    value: string,
    column: "pavillon" | "crown"
  ) => {
    if (column === "pavillon") {
      const updatedInputs = [...pavillonInputs];
      if (field === "angle") {
        // Appliquer le formatage pour "angle" de la colonne pavillon
        value = formatAngle(value);
      }
      updatedInputs[index][field] = value;
      setPavillonInputs(updatedInputs);
    } else if (column === "crown") {
      const updatedInputs = [...crownInputs];
      if (field === "angle") {
        // Appliquer le formatage pour "angle" de la colonne crown
        value = formatAngle(value);
      }
      updatedInputs[index][field] = value;
      setCrownInputs(updatedInputs);
    }
  };

  // Fonction pour supprimer une ligne d'input dans Pavillon
  const removePavillonInputRow = (index: number) => {
    const updatedPavillonInputs = pavillonInputs.filter((_, i) => i !== index);
    setPavillonInputs(updatedPavillonInputs);
  };

  // Fonction pour supprimer une ligne d'input dans Crown
  const removeCrownInputRow = (index: number) => {
    const updatedCrownInputs = crownInputs.filter((_, i) => i !== index);
    setCrownInputs(updatedCrownInputs);
  };

  // Vérifie si la dernière ligne est remplie
  const isLastRowFilled = (
    inputs: Array<{ facet: string; angle: string; sequence: string }>
  ) => {
    const lastInput = inputs[inputs.length - 1];
    if (!lastInput) return false; // Si la dernière ligne est undefined, retourner false

    return (
      lastInput.facet !== "" &&
      lastInput.angle !== "" &&
      lastInput.sequence !== ""
    );
  };

  useEffect(() => {
    // Si la dernière ligne de Pavillon est remplie, ajouter une nouvelle ligne
    if (isLastRowFilled(pavillonInputs)) {
      addPavillonInputRow();
    }
    // Si la dernière ligne de Crown est remplie, ajouter une nouvelle ligne
    if (isLastRowFilled(crownInputs)) {
      addCrownInputRow();
    }
  }, [pavillonInputs, crownInputs, addCrownInputRow, addPavillonInputRow]);

  const extractNumbersBeforeAfterIndex = (text: string): string[] => {
    // Expression régulière pour capturer les nombres de 2 ou 3 chiffres avant ou après "index"
    const regex = /(?:\d{2,3})(?=\s*index)|(?<=index\s*)\d{2,3}/g;

    // Appliquer l'expression régulière sur le texte
    const matches = text.match(regex);

    // Retourner les valeurs trouvées ou un tableau vide si aucune correspondance
    return matches ? matches : [];
  };

  const containsNumbers = (text: string): boolean => {
    // Expression régulière pour détecter la présence de chiffres
    const regex = /\d/;

    // Teste si la chaîne contient un ou plusieurs chiffres
    return regex.test(text);
  };

  const indexWheelFromPicture =
    extractNumbersBeforeAfterIndex(recognizedText).toString();


    

  return (
    <div className="App">
      <h1>Index Wheel Faceting Diagrams Converter</h1>
      {image && (
        <div>
          {isLoading ? (
            <p>Loading, the app is trying to find the index wheel from the picture...</p>
          ) : (
            <p>
              {containsNumbers(indexWheelFromPicture)
                ? ""
                : "The index Wheel is not readable in this picture, sorry."}
            </p>
          )}
        </div>
      )}

      {/* Affichage des inputs pour l'index actuel et souhaité si une image est chargée */}
      {image ? (
        <div className="index-inputs-wrapper">
          <div className="index-input">
            <label className="index-indicator">
              Index de la roue actuelle:
            </label>
            <input
              type="text"
              value={
                indexWheelFromPicture ? indexWheelFromPicture : currentIndex
              }
              onChange={(e) => setCurrentIndex(e.target.value)}
            />
          </div>
          <div className="index-input">
            <label className="index-indicator">
              Index de la roue souhaitée:
            </label>
            <input
              type="text"
              value={desiredIndex}
              onChange={(e) => setDesiredIndex(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="file-input-wrapper">
          <input type="file" onChange={handleImageChange} />
        </div>
      )}

      {/* Affichage de l'image si elle est présente */}
      {image && (
        <div className="content-wrapper">
          <div style={{ position: "relative" }}>
            <img
              src={image}
              alt="uploaded"
              style={{ maxWidth: "500px", marginTop: "20px" }}
            />
            <button
              className="remove-image-button"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
              onClick={removeImage}
            >
              Supprimer l'image
            </button>
          </div>

          <div className="add-buttons-wrapper">
            {/* Boutons pour ajouter des lignes */}
            <button onClick={addPavillonInputRow}>
              Ajouter un paramètre Pavillon
            </button>
            <button onClick={addCrownInputRow}>
              Ajouter un paramètre Crown
            </button>
          </div>

          <div className="form-wrapper">
            {/* Formulaire avec les deux colonnes */}
            <form className="form-container">
              <div className="columns-container">
                {/* Colonne Pavillon */}
                <div className="column">
                  <h2>Pavillon</h2>
                  {pavillonInputs.map((input, index) => (
                    <div key={index} className="input-row">
                      <div className="column">
                        <span className="input-content">
                          <label>Facet Number:</label>
                          <input
                            className="facet-number"
                            type="text"
                            value={input.facet}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "facet",
                                e.target.value,
                                "pavillon"
                              )
                            }
                          />
                        </span>
                        <span className="input-content">
                          <label>Degré d'inclinaison:</label>
                          <input
                            className="degree-number"
                            type="text"
                            value={input.angle}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "angle",
                                e.target.value,
                                "pavillon"
                              )
                            }
                          />
                        </span>
                        <span className="input-content">
                          <label>Suite de chiffres:</label>
                          <input
                            className="angle-numbers"
                            type="text"
                            value={input.sequence}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "sequence",
                                e.target.value,
                                "pavillon"
                              )
                            }
                          />
                        </span>
                        {/* Bouton de suppression à droite */}
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => removePavillonInputRow(index)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Colonne Crown */}
                <div className="column">
                  <h2>Crown</h2>
                  {crownInputs.map((input, index) => (
                    <div key={index} className="input-row">
                      <div className="column">
                        {/* Bouton de suppression à gauche */}
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => removeCrownInputRow(index)}
                        >
                          Supprimer
                        </button>
                        <span className="input-content">
                          <label>Facet Number:</label>
                          <input
                            className="facet-number"
                            type="text"
                            value={input.facet}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "facet",
                                e.target.value,
                                "crown"
                              )
                            }
                          />
                        </span>
                        <span className="input-content">
                          <label>Degré d'inclinaison:</label>
                          <input
                            className="degree-number"
                            type="text"
                            value={input.angle}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "angle",
                                e.target.value,
                                "crown"
                              )
                            }
                          />
                        </span>
                        <span className="input-content">
                          <label>Suite de chiffres:</label>
                          <input
                            className="angle-numbers"
                            type="text"
                            value={input.sequence}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "sequence",
                                e.target.value,
                                "crown"
                              )
                            }
                          />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
