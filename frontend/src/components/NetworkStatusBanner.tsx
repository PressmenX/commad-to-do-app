import { useEffect, useState } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function NetworkStatusBanner() {
  const isOnline = useOnlineStatus();
  const [actionFeedback, setActionFeedback] = useState(false);

  useEffect(() => {
    const handleOfflineAction = () => setActionFeedback(true);
    const handleOnline = () => setActionFeedback(false);

    window.addEventListener("app:offline-action", handleOfflineAction);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("app:offline-action", handleOfflineAction);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="sticky top-0 z-[100] flex justify-center bg-warning px-4 py-2 text-center text-sm font-semibold text-warning-content shadow"
      role="status"
      aria-live="polite"
    >
      {actionFeedback
        ? "Sedang offline. Aksi tidak dilakukan; koneksi internet diperlukan untuk mengubah task."
        : "Sedang offline. Task tidak dapat diubah dan akan dimuat ulang saat koneksi kembali."}
    </div>
  );
}
