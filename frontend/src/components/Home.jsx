import {
  useEffect,
  useState,
} from "react";

import {
  Search,
  ShoppingCart,
  Package,
} from "lucide-react";

import { apiRequest } from "../api";

const categories = [
  "All",
  "Groceries",
  "Electronics",
  "Clothing",
  "Stationery",
  "Home",
  "Beauty",
  "Other",
];

const Home = () => {
  const [products, setProducts] =
    useState([]);

  const [category, setCategory] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let endpoint =
        "/materials";

      const params =
        new URLSearchParams();

      if (category !== "All") {
        params.append(
          "category",
          category
        );
      }

      if (search.trim()) {
        params.append(
          "search",
          search
        );
      }

      const query =
        params.toString();

      if (query) {
        endpoint += `?${query}`;
      }

      const data =
        await apiRequest(endpoint);

      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const addToCart = (product) => {
    if (product.quantity <= 0) {
      return;
    }

    const cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const existing =
      cart.find(
        (item) =>
          item._id === product._id
      );

    if (existing) {
      if (
        existing.quantity <
        product.quantity
      ) {
        existing.quantity += 1;
      }
    } else {
      cart.push({
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
        availableQuantity:
          product.quantity,
        shop: product.shop,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    setMessage(
      `${product.title} added to cart`
    );

    setTimeout(
      () => setMessage(""),
      2000
    );
  };

  return (
    <div>

      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.35),_transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center">

          <div>
            <span className="mb-5 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-200">
              Local shopping made simple
            </span>

            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              Find what you need.
              <span className="block text-indigo-400">
                Buy from nearby shops.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Discover products from local
              shop owners, add them to your
              cart, and place your order with
              delivery estimates based on
              distance.
            </p>

            <a
              href="#products"
              className="mt-8 inline-block rounded-2xl bg-indigo-500 px-6 py-3.5 font-bold transition hover:bg-indigo-400"
            >
              Explore Products
            </a>
          </div>

          <div className="hidden md:block">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">

              <div className="grid grid-cols-2 gap-4">

                {[
                  ["Local Shops", "🏪"],
                  ["Categories", "🛍️"],
                  ["Easy Cart", "🛒"],
                  ["Delivery ETA", "🚚"],
                ].map(
                  ([text, icon]) => (
                    <div
                      key={text}
                      className="rounded-2xl bg-white/10 p-6"
                    >
                      <div className="text-3xl">
                        {icon}
                      </div>

                      <p className="mt-3 font-semibold">
                        {text}
                      </p>
                    </div>
                  )
                )}

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCTS */}

      <section
        id="products"
        className="mx-auto max-w-7xl px-4 py-14"
      >

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="font-semibold text-indigo-600">
              SHOP
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Browse Products
            </h2>

            <p className="mt-2 text-slate-500">
              Choose products from local
              sellers.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search products..."
              className="min-w-0 flex-1 px-4 py-3 outline-none"
            />

            <button
              className="bg-slate-900 px-5 text-white"
              type="submit"
            >
              <Search size={20} />
            </button>
          </form>

        </div>

        {/* CATEGORIES */}

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">

          {categories.map(
            (item) => (
              <button
                key={item}
                onClick={() =>
                  setCategory(item)
                }
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  category === item
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            )
          )}

        </div>

        {message && (
          <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {/* PRODUCTS GRID */}

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <Package
              className="mx-auto text-slate-300"
              size={50}
            />

            <p className="mt-4 font-semibold">
              No products found
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map(
              (product) => (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="relative aspect-square overflow-hidden bg-slate-100">

                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl">
                        🛍️
                      </div>
                    )}

                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-indigo-600 backdrop-blur">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-5">

                    <h3 className="line-clamp-1 text-lg font-bold">
                      {product.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                      {product.description}
                    </p>

                    <div className="mt-3 text-sm text-slate-400">
                      {product.shop?.shopName}
                    </div>

                    <div className="mt-4 flex items-end justify-between">

                      <div>
                        <p className="text-xl font-black">
                          ₹{product.price}
                        </p>

                        <p
                          className={`text-xs font-semibold ${
                            product.quantity > 0
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {product.quantity > 0
                            ? `${product.quantity} available`
                            : "Out of stock"}
                        </p>
                      </div>

                      <button
                        disabled={
                          product.quantity <= 0
                        }
                        onClick={() =>
                          addToCart(product)
                        }
                        className="rounded-xl bg-slate-900 p-3 text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        <ShoppingCart
                          size={19}
                        />
                      </button>

                    </div>
                  </div>
                </div>
              )
            )}

          </div>
        )}

      </section>
    </div>
  );
};

export default Home;