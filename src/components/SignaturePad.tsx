"use client";
import { useEffect, useRef, useState } from "react";

type SignaturePadProps = {
  className?: string;
  onChange?: (dataUrl: string) => void;
};

export const SignaturePad = ({ className, onChange }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setup = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = "#111827"; // gray-900
    };

    setup();
    window.addEventListener("resize", setup);
    return () => window.removeEventListener("resize", setup);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;
    if ("touches" in e) {
      const t = e.touches[0] || (e as React.TouchEvent).changedTouches[0];
      x = t.clientX - rect.left;
      y = t.clientY - rect.top;
    } else {
      const me = e as React.MouseEvent;
      x = me.clientX - rect.left;
      y = me.clientY - rect.top;
    }
    return { x, y };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    onChange?.(canvasRef.current!.toDataURL("image/png"));
  };

  const end = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange?.("");
  };

  const download = () => {
    const dataUrl = canvasRef.current!.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "assinatura.png";
    a.click();
  };

  return (
    <div className={className ?? ""}>
      <div className="border rounded bg-white">
        <div className="flex items-center justify-between px-2 py-1 border-b">
          <span className="text-sm text-gray-600">Assine no quadro abaixo</span>
          <div className="flex gap-2">
            <button type="button" onClick={clear} className="px-2 py-1 text-sm bg-gray-200 rounded">
              Limpar
            </button>
            <button type="button" onClick={download} className="px-2 py-1 text-sm bg-gray-800 text-white rounded">
              Baixar
            </button>
          </div>
        </div>
        <div className="p-2">
          <div className="relative w-full h-48">
            <canvas
              ref={canvasRef}
              className="w-full h-full touch-manipulation"
              onMouseDown={start}
              onMouseMove={move}
              onMouseUp={end}
              onMouseLeave={end}
              onTouchStart={start}
              onTouchMove={move}
              onTouchEnd={end}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;