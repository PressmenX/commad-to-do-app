import { Wrench } from "lucide-react";

export default function TestTools() {
  return (
    <>
      <button className="fixed top-4 right-4 z-50 btn btn-primary shadow-lg hover:shadow-primary/40 active:scale-95 transition-all gap-2">
        <Wrench className="w-5 h-5" />
        <span>Test Tools</span>
      </button>
    </>
  );
}
