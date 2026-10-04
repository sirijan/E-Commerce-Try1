import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  User,
  Store,
} from "lucide-react";

import { apiRequest } from "../api";

const Auth = () => {
  const navigate = useNavigate();

  const [mode, setMode] =
    useState("login");

  const [role, setRole] =
    useState("user");

  const [form, setForm] =
    useState({
      name: "",
      shopName: "",
      ownerName: "",
      email: "",
      password: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      latitude: "",
      longitude: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const updateField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let data;

      if (mode === "register") {
        const endpoint =
          role === "shop"
            ? "/auth/register/shop"
            : "/auth/register/user";

        data = await apiRequest(
          endpoint,
          {
            method: "POST",
            body: JSON.stringify(
              role === "shop"
                ? form
                : {
                    name: form.name,
                    email: form.email,
                    password:
                      form.password,
                  }
            ),
          }
        );

        setMode("login");

        setError(
          "Registration successful. Please login."
        );
      } else {
        data = await apiRequest(
          "/auth/login",
          {
            method: "POST",
            body: JSON.stringify({
              email: form.email,
              password: form.password,
              role,
            }),
          }
        );

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        if (role === "shop") {
          navigate(
            "/shop-dashboard"
          );
        } else {
          navigate("/");
        }

        window.location.reload();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 px-4 py-12">

      <div className="mx-auto max-w-lg">

        <div className="mb-8 text-center text-white">
          <p className="font-semibold text-indigo-400">
            WELCOME
          </p>

          <h1 className="mt-2 text-4xl font-black">
            {mode === "login"
              ? "Welcome back"
              : "Create an account"}
          </h1>
        </div>

        {/* ROLE SELECTOR */}

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-white/10 p-2">

          <button
            type="button"
            onClick={() =>
              setRole("user")
            }
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition ${
              role === "user"
                ? "bg-white text-slate-900"
                : "text-white"
            }`}
          >
            <User size={18} />
            Buyer
          </button>

          <button
            type="button"
            onClick={() =>
              setRole("shop")
            }
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition ${
              role === "shop"
                ? "bg-white text-slate-900"
                : "text-white"
            }`}
          >
            <Store size={18} />
            Shop Owner
          </button>

        </div>

        <div className="rounded-3xl bg-white p-7 shadow-2xl">

          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">

            <button
              type="button"
              onClick={() =>
                setMode("login")
              }
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${
                mode === "login"
                  ? "bg-white shadow"
                  : "text-slate-500"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() =>
                setMode("register")
              }
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${
                mode === "register"
                  ? "bg-white shadow"
                  : "text-slate-500"
              }`}
            >
              Register
            </button>

          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
              {error}
            </div>
          )}

          <form
            onSubmit={submit}
            className="space-y-4"
          >

            {mode === "register" &&
              role === "user" && (
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Your name"
                  required
                  className="input"
                />
              )}

            {mode === "register" &&
              role === "shop" && (
                <>
                  <input
                    name="shopName"
                    value={form.shopName}
                    onChange={updateField}
                    placeholder="Shop name"
                    required
                    className="input"
                  />

                  <input
                    name="ownerName"
                    value={form.ownerName}
                    onChange={updateField}
                    placeholder="Owner name"
                    required
                    className="input"
                  />

                  <input
                    name="address"
                    value={form.address}
                    onChange={updateField}
                    placeholder="Shop address"
                    required
                    className="input"
                  />

                  <div className="grid grid-cols-2 gap-3">

                    <input
                      name="city"
                      value={form.city}
                      onChange={updateField}
                      placeholder="City"
                      className="input"
                    />

                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={updateField}
                      placeholder="Pincode"
                      className="input"
                    />

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <input
                      name="latitude"
                      value={form.latitude}
                      onChange={updateField}
                      placeholder="Latitude"
                      type="number"
                      step="any"
                      className="input"
                    />

                    <input
                      name="longitude"
                      value={form.longitude}
                      onChange={updateField}
                      placeholder="Longitude"
                      type="number"
                      step="any"
                      className="input"
                    />

                  </div>

                  <p className="text-xs text-slate-400">
                    Latitude and longitude are used
                    for the initial delivery-distance
                    estimate.
                  </p>
                </>
              )}

            <input
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="Email address"
              type="email"
              required
              className="input"
            />

            <input
              name="password"
              value={form.password}
              onChange={updateField}
              placeholder="Password"
              type="password"
              required
              className="input"
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3.5 font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Auth;