import { AlertCircle, Settings2 } from "lucide-react";
import { useState } from "react";

type ButtonWithIdProps = {
  label: string;
  onAction: (id: string) => Promise<void>;
};

export default function ButtonWithId({ label, onAction }: ButtonWithIdProps) {
  const [id, setId] = useState("");
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [error, setError] = useState("");

  const handleAction = async () => {
    const taskId = id.trim();
    if (!taskId) {
      setIsInputOpen(true);
      setError("ID must be entered");
      return;
    }

    setError("");
    await onAction(taskId);
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        <button
          type="button"
          onClick={handleAction}
          className="btn btn-sm flex-1 text-primary rounded-r-none"
        >
          {label}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsInputOpen((open) => !open);
            setError("");
          }}
          aria-label={`Atur ID untuk ${label}`}
          aria-expanded={isInputOpen}
          className="btn btn-square btn-sm text-primary rounded-l-none"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </div>
      {isInputOpen && (
        <div className="flex flex-col gap-1 p-2 rounded-b bg-surface/70">
          <label className="text-xs text-primary" htmlFor={`${label}-id`}>
            ID task
          </label>
          <input
            id={`${label}-id`}
            type="text"
            value={id}
            onChange={(event) => {
              setId(event.target.value);
              setError("");
            }}
            placeholder="Enter ID task"
            className="input  input-xs w-full"
          />
          {error && (
            <div className="text-white text-xs flex items-center gap-2 bg-error rounded p-1">
              <AlertCircle size={15} />
              <p role="alert" className="">
                {error}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
