import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "../api/authApi";
import { SEO } from "../components/SEO";
import { setCredentials } from "../store/authSlice";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await login({ username, password }).unwrap();

      dispatch(
        setCredentials({
          user: {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            gender: response.gender,
            image: response.image,
          },
          token: response.token,
        }),
      );

      const redirectState = location.state as {
        from?: { pathname?: string; search?: string; hash?: string };
      } | null;
      const from = redirectState?.from ?? { pathname: "/products" };
      const target = `${from.pathname ?? "/products"}${from.search ?? ""}${from.hash ?? ""}`;

      navigate(target, { replace: true });
    } catch (submitError) {
      console.error("Login failed", submitError);
    }
  };

  return (
    <>
      <SEO
        title="Login | MyStore"
        description="Login to your MyStore account."
        robots="noindex,nofollow"
      />

      <div className="mx-auto max-w-md p-4 sm:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Login</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Sign in with your DummyJSON account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-xs sm:text-sm font-medium text-slate-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs sm:text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-xs sm:text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-xs sm:text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-700">
                {(error as { data?: { message?: string } })?.data?.message ??
                  "Login failed."}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
              }}
              className="w-full rounded-lg px-4 py-2.5 sm:py-2 text-xs sm:text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
