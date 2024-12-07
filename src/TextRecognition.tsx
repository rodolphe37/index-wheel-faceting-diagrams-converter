import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";

const useTextRecognition = ({ selectedImage }: { selectedImage: string }) => {
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isLoading, setIsloading] = useState(false)


  
  useEffect(() => {
    const recognizeText = async () => {
        setIsloading(true)
      if (selectedImage) {
        const result = await Tesseract.recognize(selectedImage, 'eng');

        const extractedIndexWheel = result.data.text;

        setRecognizedText(extractedIndexWheel);
        setIsloading(false)
      }
    };
    recognizeText();
  }, [selectedImage]);

  console.log("recognizedText", JSON.stringify(recognizedText));
  return {
    recognizedText,
    isLoading,
    setRecognizedText
  };
};
export default useTextRecognition;
