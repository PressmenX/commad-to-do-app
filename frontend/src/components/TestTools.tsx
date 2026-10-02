import React, { useState } from "react";
import { Wrench } from "lucide-react";

export default function TestTools({ children }: React.PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
    <button 
  onClick={() => setIsOpen(!isOpen)} 
  className="px-2 py-2 text-white font-semibold btn-glass"
> 
  <Wrench className="w-5 h-5" strokeWidth={1.5} /> 
</button>

      {isOpen && (
        <div className="w-56 min-h-64 p-4 bg-glass">
          <h3 className="font-bold text-sm mb-2 text-center text-surface">
            Testing Tools
          </h3>
          <div className="*:btn *:text-primary *:btn-block *:btn-sm py-2 flex flex-col gap-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
