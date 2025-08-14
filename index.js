import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>VenVite - Optimisation Photo & Texte</h1>
      <UploadForm />
    </div>
  );
}