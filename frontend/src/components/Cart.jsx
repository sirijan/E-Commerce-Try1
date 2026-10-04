import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
} from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] =
    useState(
      JSON.parse(
        localStorage.getItem("cart")
      ) || []
    );

  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const updateQuantity = (
    id,
    amount
  ) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item._id !== id) {
            return item;
          }

          const newQuantity =
            item.quantity + amount;

          if (newQuantity <= 0) {
            return null;
          }

          if (
            newQuantity >
            item.availableQuantity
          ) {
            return item;
          }

          return {
            ...item,
            quantity: newQuantity,
          };
        })
        .filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCart((current) =>
      current.filter(
        (item) => item._id !== id
      )
    );
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price * item.quantity,
    0
  );

  const checkout = () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">

        <ShoppingBag
          size={70}
          className="mx-auto text-slate-200"
        />

        <h1 className="mt-6 text-3xl font-black">
          Your cart is empty
        </h1>

        <p className="mt-2 text-slate-500">
          Add some products to continue.
        </p>

        <Link
          to="/"
          className="mt-7 inline-block rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
        >
          Browse Products
        </Link>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">

      <h1 className="text-4xl font-black">
        Your Cart
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

        <div className="space-y-4">

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >

              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">
                    🛍️
                  </div>
                )}

              </div>

              <div className="min-w-0 flex-1">

                <h2 className="font-bold">
                  {item.title}
                </h2>

                <p className="mt-1 font-semibold text-indigo-600">
                  ₹{item.price}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Available:
                  {" "}
                  {item.availableQuantity}
                </p>

                <div className="mt-3 flex items-center gap-2">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        -1
                      )
                    }
                    className="rounded-lg border p-1.5"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="w-8 text-center font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        1
                      )
                    }
                    className="rounded-lg border p-1.5"
                  >
                    <Plus size={15} />
                  </button>

                </div>
              </div>

              <div className="flex flex-col items-end justify-between">

                <button
                  onClick={() =>
                    removeItem(item._id)
                  }
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>

                <p className="font-black">
                  ₹
                  {item.price *
                    item.quantity}
                </p>

              </div>

            </div>
          ))}

        </div>

        <div className="h-fit rounded-3xl bg-slate-950 p-6 text-white">

          <h2 className="text-xl font-bold">
            Order Summary
          </h2>

          <div className="mt-6 flex justify-between text-slate-300">
            <span>Items</span>
            <span>
              {cart.reduce(
                (sum, item) =>
                  sum + item.quantity,
                0
              )}
            </span>
          </div>

          <div className="my-5 border-t border-white/10" />

          <div className="flex justify-between">
            <span className="text-lg font-semibold">
              Total
            </span>

            <span className="text-2xl font-black">
              ₹{total}
            </span>
          </div>

          <button
            onClick={checkout}
            className="mt-7 w-full rounded-xl bg-indigo-500 py-3.5 font-bold hover:bg-indigo-400"
          >
            Continue to Checkout
          </button>

        </div>

      </div>
    </div>
  );
};

export default Cart;