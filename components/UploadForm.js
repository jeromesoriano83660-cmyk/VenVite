import { useState } from "react";

export default function UploadForm() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleGenerateText = () => {
    setDescription(
      "Superbe article en parfait état, idéal pour toutes occasions. Livraison rapide, acheteurs sérieux bienvenus !"
    );
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {image && <img src={image} alt="preview" style={{ width: "200px", marginTop: "10px" }} />}
      <div>
        <button style={{ marginTop: 10 }} onClick={handleGenerateText}>
          Générer description
        </button>
      </div>
      {description && (
        <div style={{ marginTop: 10 }}>
          <strong>Description optimisée :</strong>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}