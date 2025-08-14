import { useEffect, useRef, useState } from "react";
export default function PhotoEditor(){
  const [image, setImage] = useState(null);
  const [brightness, setBrightness] = useState(6);
  const [contrast, setContrast] = useState(8);
  const [scene, setScene] = useState("white");
  const canvasRef = useRef(null);
  const imgElRef = useRef(null);
  const onFile = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => { imgElRef.current = img; draw(); };
    img.src = url;
    setImage(url);
  };
  useEffect(()=>{ draw(); }, [brightness, contrast, scene]);
  const fitContain = (sw,sh,dw,dh) => {
    const sr = sw/sh, dr = dw/dh; let w=dw, h=dh, x=0, y=0;
    if (sr > dr) { h = Math.round(dw/sr); y = Math.round((dh-h)/2); }
    else { w = Math.round(dh*sr); x = Math.round((dw-w)/2); }
    return { w, h, x, y };
  };
  const drawScene = (ctx, w, h) => {
    if (scene === "white"){ ctx.fillStyle="#fff"; ctx.fillRect(0,0,w,h); return; }
    if (scene === "gradient"){
      const g = ctx.createLinearGradient(0,0,0,h); g.addColorStop(0,"#ffffff"); g.addColorStop(1,"#f0f2f5"); ctx.fillStyle=g; ctx.fillRect(0,0,w,h); return;
    }
    const g = ctx.createLinearGradient(0,0,0,h*0.7); g.addColorStop(0,"#ffffff"); g.addColorStop(1,"#eef1f4"); ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = "#e6e2dc"; const tableY = Math.round(h*0.7); ctx.fillRect(0, tableY, w, h-tableY);
    ctx.fillStyle = "rgba(0,0,0,0.06)"; ctx.fillRect(0, tableY-4, w, 4);
  };
  const applyAdjust = (ctx, w, h) => {
    const img = ctx.getImageData(0,0,w,h); const d = img.data;
    const b = brightness; const c = (contrast/100)+1; const k = 128*(1-c);
    for (let i=0;i<d.length;i+=4){ d[i]=clamp(c*(d[i]+b)+k); d[i+1]=clamp(c*(d[i+1]+b)+k); d[i+2]=clamp(c*(d[i+2]+b)+k); }
    ctx.putImageData(img,0,0);
  };
  const clamp = v => v<0?0:v>255?255:v;
  const draw = () => {
    const cvs = canvasRef.current; if (!cvs) return;
    const ctx = cvs.getContext("2d");
    const W = 900, H = 900; cvs.width = W; cvs.height = H;
    drawScene(ctx, W, H);
    const img = imgElRef.current; if (!img) return;
    const { w,h,x,y } = fitContain(img.width, img.height, W, H);
    const tmp = document.createElement("canvas"); tmp.width = w; tmp.height = h;
    const tctx = tmp.getContext("2d");
    tctx.drawImage(img,0,0,w,h);
    applyAdjust(tctx, w, h);
    ctx.drawImage(tmp, x, y);
  };
  const exportImage = (fmt) => {
    const src = canvasRef.current; if (!src) return;
    const out = document.createElement("canvas");
    let W = 2000, H = 2000; // Vinted 1:1
    out.width = W; out.height = H;
    const octx = out.getContext("2d");
    drawScene(octx, W, H);
    octx.drawImage(src, 0, 0, W, H);
    const data = fmt==="png"? out.toDataURL("image/png") : out.toDataURL("image/jpeg", 0.92);
    const a = document.createElement("a"); a.href=data; a.download = fmt==="png" ? "vinted_2000.png" : "vinted_2000.jpg"; a.click();
  };
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-semibold mb-3">Éditeur Photo</h2>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="px-3 py-2 bg-neutral-100 rounded cursor-pointer hover:bg-neutral-200">
          Importer
          <input type="file" accept="image/*" className="hidden" onChange={onFile} />
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm">Scène</span>
          <select className="px-2 py-2 border rounded" value={scene} onChange={e=>setScene(e.target.value)}>
            <option value="white">Fond blanc</option>
            <option value="gradient">Dégradé doux</option>
            <option value="table">Table stylisée</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Lum.</span>
          <input type="range" min={-80} max={80} value={brightness} onChange={e=>setBrightness(parseInt(e.target.value))} />
          <span className="text-sm">Contraste</span>
          <input type="range" min={-80} max={80} value={contrast} onChange={e=>setContrast(parseInt(e.target.value))} />
        </div>
      </div>
      <div className="border rounded-xl overflow-hidden bg-neutral-100">
        <div className="p-3">
          <canvas ref={canvasRef} className="block w-full h-auto" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button onClick={()=>exportImage("png")} className="px-3 py-2 bg-black text-white rounded-lg">Exporter PNG (1:1)</button>
        <button onClick={()=>exportImage("jpg")} className="px-3 py-2 bg-neutral-900 text-white rounded-lg">Exporter JPG (1:1)</button>
      </div>
    </div>
  );
}