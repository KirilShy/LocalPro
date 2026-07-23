import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "provider">("client");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ username, email, password, role });
      await login(username, password);
      navigate("/");
    } catch {
      setError("Could not create that account. Try a different username.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card auth-form" onSubmit={handleSubmit}>
      <h1>Create an account</h1>

      <div className="field">
        <label htmlFor="username">Username</label>
        <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="role">I am a…</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value as "client" | "provider")}>
          <option value="client">Client — booking services</option>
          <option value="provider">Provider — offering services</option>
        </select>
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? "Creating account…" : "Sign up"}
      </button>

      <p className="form-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}
