import { Wrench } from "lucide-react";

export default function TestTools() {
  return (
    <>
      <div
        className="fixed top-4 right-4 z-50 w-fit "
      >
        <button className="btn btn-neutral btn-outline btn-circle active:scale-95 transition-all gap-2">
          <Wrench className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
