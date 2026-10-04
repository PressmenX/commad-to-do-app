import React, { useState } from "react";
import { Wrench } from "lucide-react";
import { ConsoleDisplay } from "./ConsoleDisplay";

export default function TestTools({ children }: React.PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConsoleOpen, setConsoleIsOpen] = useState(true);


  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-2 py-2 text-white font-semibold transition-all duration-500 ${isOpen ? "border border-white bg-surface rounded-xl" : "btn-glass"}`}
        >
          <Wrench
            className={`w-5 h-5 ${isOpen ? "text-blue-500" : ""}`}
            strokeWidth={1.5}
            fill="currentColor"
          />
        </button>

        {isOpen && (
          <div className="w-56 min-h-64 p-4 bg-glass">
            <h3 className="font-bold text-sm mb-2 text-center text-surface">
              Testing Tools
            </h3>
            <div className="form-control ">
              <label className="label cursor-pointer w-full flex  justify-around">
                <span className="label-text text-surface">Console output</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm"
                  checked={isConsoleOpen}
                  onChange={()=>setConsoleIsOpen(!isConsoleOpen)}
                />
              </label>
            </div>
            <div className="*:btn *:text-primary *:btn-block *:btn-sm py-2 flex flex-col gap-2">
              {children}
            </div>
          </div>
        )}
      </div>

      {isConsoleOpen && <ConsoleDisplay />}
    </>
  );
}
