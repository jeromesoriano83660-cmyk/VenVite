import Head from "next/head";
import PhotoEditor from "@/components/PhotoEditor";
import ListingAssistant from "@/components/ListingAssistant";

export default function Home(){
  return (
    <div className="min-h-screen bg-neutral-50">
      <Head>
        <title>VenVite – Studio Photo + Texte</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold">VenVite – Studio Photo + Texte</h1>
          <div className="text-xs opacity-70">local • gratuit • sans watermark</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 grid xl:grid-cols-2 gap-6">
        <PhotoEditor />
        <ListingAssistant />
      </main>
      <footer className="max-w-6xl mx-auto px-4 py-6 text-xs text-neutral-500">
        Conseil: lumière naturelle diffuse, cadrage centré, 2–3 angles. Export Vinted 1:1 directement.
      </footer>
    </div>
  );
}