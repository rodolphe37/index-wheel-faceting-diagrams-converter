import { useState } from 'react';
const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    setSelectedImage(URL.createObjectURL(image));
  };
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && <img src={selectedImage} alt="Selected" />}
    </div>
  );
};
export default ImageUploader;