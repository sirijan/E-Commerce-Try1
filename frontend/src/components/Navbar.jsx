import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  ShoppingCart,
  Store,
  User,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || null;

  const cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

        <Link
          to="/"
          className="text-2xl font-black tracking-tight text-slate-900"
        >
          Shop<span className="text-indigo-600">Nest</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            Contact
          </Link>

          {user?.role === "shop" && (
            <Link
              to="/shop-dashboard"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              <Store size={17} />
              My Shop
            </Link>
          )}

          {user?.role === "user" && (
            <Link
              to="/orders"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600"
            >
              My Orders
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">

          {user?.role === "user" && (
            <Link
              to="/cart"
              className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100"
            >
              <ShoppingCart size={21} />

              {cart.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {cart.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}
                </span>
              )}
            </Link>
          )}

          {token && user ? (
            <div className="flex items-center gap-2">

              <div className="hidden text-right sm:block">
                <p className="text-xs text-slate-400">
                  {user.role === "shop"
                    ? "Shop Owner"
                    : "Buyer"}
                </p>

                <p className="max-w-28 truncate text-sm font-semibold">
                  {user.name ||
                    user.shopName}
                </p>
              </div>

              <button
                onClick={logout}
                className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              <User size={17} />
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;