import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  MapPin,
  Truck,
} from "lucide-react";

import { apiRequest } from "../api";

const Checkout = () => {
  const navigate = useNavigate();

  const cart =
    JSON.parse(
      localStorage.getItem("cart")
    ) || [];

  const [address, setAddress] =
    useState({
      line1: "",
      city: "",
      state: "",
      pincode: "",
      latitude: "",
      longitude: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [order, setOrder] =
    useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAddress({
          ...address,
          latitude:
            position.coords.latitude,
          longitude:
            position.coords.longitude,
        });
      },
      () => {
        setError(
          "Unable to get your location."
        );
      }
    );
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await apiRequest(
          "/orders",
          {
            method: "POST",

            body: JSON.stringify({
              items: cart.map(
                (item) => ({
                  material:
                    item._id,
                  quantity:
                    item.quantity,
                })
              ),

              deliveryAddress: {
                ...address,
                latitude:
                  Number(
                    address.latitude
                  ),
                longitude:
                  Number(
                    address.longitude
                  ),
              },
            }),
          }
        );

      setOrder(data.order);

      localStorage.removeItem(
        "cart"
      );

      window.dispatchEvent(
        new Event("storage")
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-black">
          Your cart is empty
        </h1>
      </div>
    );
  }

  if (order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">

        <div className="rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-200">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Order Placed!
          </h1>

          <p className="mt-2 text-slate-500">
            Your order has been successfully
            recorded.
          </p>

          <p className="mt-5 rounded-xl bg-slate-100 p-3 font-mono text-sm">
            Order ID: {order._id}
          </p>

          <p className="mt-5 text-2xl font-black">
            ₹{order.totalAmount}
          </p>

          <div className="mt-6 space-y-3 text-left">

            {order.delivery?.map(
              (delivery) => (
                <div
                  key={
                    delivery.shop
                  }
                  className="rounded-2xl bg-indigo-50 p-4"
                >
                  <div className="flex items-center gap-2 font-bold text-indigo-700">
                    <Truck size={18} />
                    Estimated Delivery
                  </div>

                  <p className="mt-2 text-sm text-indigo-900">
                    Distance:
                    {" "}
                    {delivery.distanceKm}
                    {" km"}
                  </p>

                  <p className="text-sm text-indigo-900">
                    Estimated time:
                    {" "}
                    {delivery.estimatedMinutes}
                    {" minutes"}
                  </p>
                </div>
              )
            )}

          </div>

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="mt-8 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
          >
            View My Orders
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">

      <div className="mb-8">
        <p className="font-semibold text-indigo-600">
          CHECKOUT
        </p>

        <h1 className="mt-2 text-4xl font-black">
          Delivery Details
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={placeOrder}
        className="grid gap-8 lg:grid-cols-[1fr_320px]"
      >

        <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">

          <div className="flex items-center gap-3">
            <MapPin
              className="text-indigo-600"
            />

            <h2 className="text-xl font-bold">
              Where should we deliver?
            </h2>
          </div>

          <div className="mt-6 space-y-4">

            <textarea
              required
              value={address.line1}
              onChange={(e) =>
                setAddress({
                  ...address,
                  line1:
                    e.target.value,
                })
              }
              placeholder="House / Door No, Street, Area"
              rows="3"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <div className="grid gap-4 sm:grid-cols-2">

              <input
                required
                value={address.city}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    city: e.target.value,
                  })
                }
                placeholder="City"
                className="input"
              />

              <input
                required
                value={address.state}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    state: e.target.value,
                  })
                }
                placeholder="State"
                className="input"
              />

              <input
                required
                value={address.pincode}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    pincode:
                      e.target.value,
                  })
                }
                placeholder="Pincode"
                className="input"
              />

            </div>

            <button
              type="button"
              onClick={getLocation}
              className="w-full rounded-xl border border-indigo-200 bg-indigo-50 py-3 font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              📍 Use my current location
            </button>

            <div className="grid grid-cols-2 gap-4">

              <input
                value={address.latitude}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    latitude:
                      e.target.value,
                  })
                }
                placeholder="Latitude"
                type="number"
                step="any"
                className="input"
              />

              <input
                value={address.longitude}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    longitude:
                      e.target.value,
                  })
                }
                placeholder="Longitude"
                type="number"
                step="any"
                className="input"
              />

            </div>

            <p className="text-xs text-slate-400">
              Location coordinates are used
              for the initial distance and
              delivery-time estimate.
            </p>

          </div>
        </div>

        <div className="h-fit rounded-3xl bg-slate-950 p-6 text-white">

          <h2 className="text-xl font-bold">
            Order Summary
          </h2>

          <div className="mt-5 space-y-3">

            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between gap-3 text-sm"
              >
                <span className="text-slate-300">
                  {item.title}
                  {" × "}
                  {item.quantity}
                </span>

                <span>
                  ₹
                  {item.price *
                    item.quantity}
                </span>
              </div>
            ))}

          </div>

          <div className="my-6 border-t border-white/10" />

          <div className="flex justify-between text-xl font-black">
            <span>Total</span>

            <span>
              ₹
              {cart.reduce(
                (sum, item) =>
                  sum +
                  item.price *
                    item.quantity,
                0
              )}
            </span>
          </div>

          <button
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-indigo-500 py-3.5 font-bold hover:bg-indigo-400 disabled:opacity-50"
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            No online payment is required.
          </p>

        </div>

      </form>
    </div>
  );
};

export default Checkout;