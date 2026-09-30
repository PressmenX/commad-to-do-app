import React, { useState } from "react";
import { Wrench } from "lucide-react";

export default function TestTools({ children }: React.PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-neutral btn-outline btn-circle active:scale-95 transition-all hover:bg-blue-100/20"
      >
        <Wrench className="w-5 h-5 text-cyan-500" strokeWidth={1} />
      </button>

      {isOpen && (
        <div className="bg-base-100 border border-base-content not-first:rounded-xl p-4 shadow-xl w-56 h-64 animate-in fade-in zoom-in-95 duration-150">
          <h3 className="font-semibold text-sm mb-2 text-center">
            Testing Tools
          </h3>
          <div className="*:btn *:btn-outline *:btn-block *:btn-sm py-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
