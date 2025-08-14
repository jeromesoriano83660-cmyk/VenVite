import { useMemo, useState } from "react";
export default function ListingAssistant(){
  const [platform, setPlatform] = useState("Vinted");
  const [category, setCategory] = useState("Robe");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("beige rosé");
  const [size, setSize] = useState("M");
  const [condition, setCondition] = useState("Très bon état");
  const [material, setMaterial] = useState("tissu fluide");
  const [features, setFeatures] = useState("coupe empire; dos perlé; tombé flatteur; doux au toucher");
  const [defects, setDefects] = useState("");
  const [origPrice, setOrigPrice] = useState(69);
  const [urgency, setUrgency] = useState(false);
  const title = useMemo(()=> [brand, category, color, size].filter(Boolean).join(" ").slice(0,50), [brand, category, color, size]);
  const desc = useMemo(()=> {
    const fs = features.split(/;|,|\n/).map(s=>s.trim()).filter(Boolean);
    const bullets = fs.map(f=>`- ${f}`).join("\n");
    const hasDef = defects.trim().length>0;
    return `${category}${brand?` ${brand}`:""}${size?` ${size}`:""}${color?` (${color})`:""}
• Atouts :
${bullets}
• Matière : ${material}
• État : ${condition}${hasDef?`\n• Petits défauts : ${defects}`:""}
Envoi soigné, maison non fumeur. Photos supplémentaires sur demande.`;
  }, [category, brand, size, color, features, material, condition, defects]);
  const price = useMemo(()=>{
    const base = origPrice || 50;
    const map = { "Neuf":0.65, "Comme neuf":0.6, "Très bon état":0.5, "Bon état":0.4, "Satisfaisant":0.3 };
    const coef = map[condition] ?? 0.5;
    const classic = Math.max(1, Math.round(base*coef));
    const quick = Math.max(3, Math.round(classic*0.85));
    return { classic, quick: urgency ? Math.max(3, Math.round(quick*0.9)) : quick };
  }, [origPrice, condition, urgency]);
  const hashtags = useMemo(()=>{
    const base = ["secondeMain","bonPlan","look","tendance","vente","vinted","leb","occasion","shop"];
    const dyn = [category, brand, color.split(" ")[0]].filter(Boolean).map(s=>s.toLowerCase());
    const uniq = Array.from(new Set([...dyn, ...base])).slice(0, 12);
    return uniq.map(h=>`#${h}`).join(" ");
  }, [category, brand, color]);
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-semibold mb-3">Assistant Annonce</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <Field label="Plateforme">
          <select className="border rounded px-2 py-2" value={platform} onChange={e=>setPlatform(e.target.value)}>
            <option>Vinted</option><option>Leboncoin</option><option>Etsy</option><option>eBay</option>
          </select>
        </Field>
        <Field label="Catégorie"><input className="border rounded px-2 py-2" value={category} onChange={e=>setCategory(e.target.value)} /></Field>
        <Field label="Marque"><input className="border rounded px-2 py-2" value={brand} onChange={e=>setBrand(e.target.value)} /></Field>
        <Field label="Couleur"><input className="border rounded px-2 py-2" value={color} onChange={e=>setColor(e.target.value)} /></Field>
        <Field label="Taille / Dimensions"><input className="border rounded px-2 py-2" value={size} onChange={e=>setSize(e.target.value)} /></Field>
        <Field label="État">
          <select className="border rounded px-2 py-2" value={condition} onChange={e=>setCondition(e.target.value)}>
            <option>Neuf</option><option>Comme neuf</option><option>Très bon état</option><option>Bon état</option><option>Satisfaisant</option>
          </select>
        </Field>
        <Field label="Matière" wide><input className="border rounded px-2 py-2 w-full" value={material} onChange={e=>setMaterial(e.target.value)} /></Field>
        <Field label="Points forts (séparés par ;)" wide><input className="border rounded px-2 py-2 w-full" value={features} onChange={e=>setFeatures(e.target.value)} /></Field>
        <Field label="Petits défauts (optionnel)" wide><input className="border rounded px-2 py-2 w-full" value={defects} onChange={e=>setDefects(e.target.value)} /></Field>
        <Field label="Prix neuf estimé (€)"><input type="number" className="border rounded px-2 py-2" value={origPrice} onChange={e=>setOrigPrice(parseFloat(e.target.value||"0"))} /></Field>
        <div className="flex items-center gap-2 mt-6">
          <input id="urg" type="checkbox" checked={urgency} onChange={e=>setUrgency(e.target.checked)} />
          <label htmlFor="urg" className="text-sm">Vente rapide prioritaire</label>
        </div>
      </div>
      <Block title="Titre (≤ 50 caractères, sans symboles)"><div className="mt-1 p-2 bg-white rounded border font-medium">{title}</div></Block>
      <Block title="Description"><textarea className="mt-1 w-full h-40 p-2 bg-white rounded border whitespace-pre-wrap" value={desc} readOnly /></Block>
      <Block title="Hashtags"><div className="mt-1 p-2 bg-white rounded border text-sm">{hashtags}</div></Block>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-neutral-50 rounded-lg border p-3 text-sm"><div className="font-medium mb-1">Prix conseillé</div><div className="text-2xl font-bold">{price.classic} €</div><div className="opacity-70 mt-1">Basé sur {Math.round(origPrice||0)}€ – {condition}</div></div>
        <div className="bg-neutral-50 rounded-lg border p-3 text-sm"><div className="font-medium mb-1">Vente rapide</div><div className="text-2xl font-bold">{price.quick} €</div><div className="opacity-70 mt-1">≈ -15%</div></div>
      </div>
    </div>
  );
}
function Field({label,children,wide}){ return <div className={wide?'sm:col-span-2 flex flex-col gap-1':'flex flex-col gap-1'}><label className='text-sm'>{label}</label>{children}</div>; }
function Block({title,children}){ return <div className='bg-neutral-50 rounded-lg border p-3 mb-3'><div className='text-sm font-medium'>{title}</div>{children}</div>; }
