import { useState, useEffect } from "react";
import { Console, Hook, Unhook } from "console-feed";
import type { Message } from "console-feed/lib/definitions/Component";

export const ConsoleDisplay = () => {
  const [logs, setLogs] = useState<Message[]>([]);

  useEffect(() => {
    const hookedConsole = Hook(window.console, (_, message) => {
      setLogs((prevLogs) => [...prevLogs, message as Message]);
    }, false);

    return () => {
      Unhook(hookedConsole);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-52 bg-[#242424] overflow-y-auto border-t-2 border-zinc-700 z-9999">
      <div className="px-3 py-1 bg-zinc-800 text-white text-xs flex justify-between items-center border-b border-zinc-700">
        <span className="font-mono">Console Output ({logs.length})</span>
        <button
          onClick={() => setLogs([])}
          className="px-2 py-0.5 text-xs bg-zinc-700 hover:bg-zinc-600 active:bg-zinc-500 text-zinc-200 rounded transition-colors"
        >
          Clear
        </button>
      </div>

      <Console logs={logs} variant="dark" styles={{BASE_FONT_SIZE: '8px'}} />
    </div>
  );
};
