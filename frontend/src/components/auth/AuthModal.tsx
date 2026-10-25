// frontend/src/components/auth/AuthModal.tsx
import { useState } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { X, AlertCircle, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../services/authApi";
import { useNavigate } from "react-router";

export default NiceModal.create(({ initialMode = "login" }: { initialMode?: "login" | "register" }) => {
  const modal = useModal();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (mode === "register" && !name.trim()) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
        modal.hide();
        navigate("/main", { replace: true });
      } else {
        await authApi.register({ name, email, password });
        setSuccessMessage("Registration successful! Please log in.");
        setMode("login");
        setPassword(""); 
      }
    } catch (err: unknown) {
      const responseMessage =
        err && typeof err === "object"
          ? (err as { response?: { data?: { message?: unknown } } }).response?.data?.message
          : undefined;
      setServerError(
        typeof responseMessage === "string"
          ? responseMessage
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrors({});
    setServerError("");
    setSuccessMessage("");
  };

  if (!modal.visible) return null;

  return (
    <dialog className="modal modal-open modal-bottom sm:modal-middle bg-black/50 backdrop-blur-xs z-50">
      <div className="modal-box bg-base-100 p-6 rounded-2xl relative">
        <button
          onClick={() => modal.hide()}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
        >
          <X size={18} />
        </button>

        <h3 className="font-bold text-2xl mb-6 text-center">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h3>

        {successMessage && (
          <div className="alert alert-success bg-success/20 text-success-content text-sm mb-4 rounded-xl border-success/30">
            {successMessage}
          </div>
        )}

        {serverError && (
          <div className="alert alert-error flex gap-2 bg-error/10 text-error p-3 mb-4 rounded-xl text-sm border-error/30">
            <AlertCircle size={18} className="shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-semibold">Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`input input-bordered w-full text-sm ${errors.name ? 'input-error' : 'focus:input-primary'}`}
                placeholder="John Doe"
              />
              {errors.name && <span className="text-error text-xs mt-1">{errors.name}</span>}
            </div>
          )}

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input input-bordered w-full text-sm ${errors.email ? 'input-error' : 'focus:input-primary'}`}
              placeholder="you@example.com"
            />
            {errors.email && <span className="text-error text-xs mt-1">{errors.email}</span>}
          </div>

          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-semibold">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input input-bordered w-full text-sm ${errors.password ? 'input-error' : 'focus:input-primary'}`}
              placeholder="Min. 8 characters"
            />
            {errors.password && <span className="text-error text-xs mt-1">{errors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full text-white mt-2"
          >
            {isSubmitting ? <span className="loading loading-spinner" /> : (
              mode === "login" ? <><LogIn size={18} /> Log In</> : <><UserPlus size={18} /> Register</>
            )}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          {mode === "login" ? (
            <p className="text-base-content/70">
              Don't have an account?{' '}
              <button type="button" onClick={() => switchMode("register")} className="text-primary font-bold hover:underline">
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-base-content/70">
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode("login")} className="text-primary font-bold hover:underline">
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
});