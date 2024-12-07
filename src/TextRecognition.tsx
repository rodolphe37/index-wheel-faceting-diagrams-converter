import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";

const useTextRecognition = ({ selectedImage }: { selectedImage: string }) => {
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [isLoading, setIsloading] = useState(false)

  // Function to perform OCR on an image
async function performOCR(imagePath: string): Promise<string> {
    try {
      const { data: { text } } = await Tesseract.recognize(
        imagePath,
        'eng', // Specify the language
        {
          logger: (m) => console.log(m), // Optional: Log OCR progress
        }
      );
      return text;
    } catch (error) {
      console.error('Error performing OCR:', error);
      throw error;
    }
  }
  
  // Example usage
  const imagePath = selectedImage; // Replace with your image path
  
  performOCR(imagePath)
    .then((text) => {
      console.log('Recognized text:', text);
    })
    .catch((error) => {
      console.error('OCR failed:', error);
    });

  useEffect(() => {
    const recognizeText = async () => {
        setIsloading(true)
      if (selectedImage) {
        const result = await Tesseract.recognize(selectedImage);

        console.log("result.data.text", result.data.text);
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
    isLoading
  };
};
export default useTextRecognition;
