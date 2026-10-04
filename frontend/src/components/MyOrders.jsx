import {
  useEffect,
  useState,
} from "react";

import {
  Package,
  Truck,
} from "lucide-react";

import { apiRequest } from "../api";

const MyOrders = () => {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadOrders =
      async () => {
        try {
          const data =
            await apiRequest(
              "/orders/my"
            );

          setOrders(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">

      <p className="font-semibold text-indigo-600">
        PURCHASE HISTORY
      </p>

      <h1 className="mt-2 text-4xl font-black">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white p-12 text-center ring-1 ring-slate-200">

          <Package
            className="mx-auto text-slate-300"
            size={50}
          />

          <p className="mt-4 font-semibold">
            No orders yet.
          </p>

        </div>
      ) : (
        <div className="mt-8 space-y-5">

          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >

              <div className="flex flex-col justify-between gap-4 sm:flex-row">

                <div>
                  <p className="text-xs text-slate-400">
                    ORDER ID
                  </p>

                  <p className="mt-1 font-mono text-sm">
                    {order._id}
                  </p>
                </div>

                <span className="h-fit rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
                  {order.status}
                </span>

              </div>

              <div className="mt-6 space-y-3">

                {order.items.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b border-slate-100 pb-3"
                    >

                      <div>
                        <p className="font-semibold">
                          {item.title}
                        </p>

                        <p className="text-sm text-slate-500">
                          Quantity:
                          {" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold">
                        ₹
                        {item.price *
                          item.quantity}
                      </p>

                    </div>
                  )
                )}

              </div>

              <div className="mt-5 flex items-center justify-between">

                <span className="text-lg font-bold">
                  Total
                </span>

                <span className="text-xl font-black">
                  ₹{order.totalAmount}
                </span>

              </div>

              {order.delivery?.map(
                (delivery) => (
                  <div
                    key={
                      delivery.shop
                    }
                    className="mt-5 flex gap-3 rounded-2xl bg-indigo-50 p-4"
                  >

                    <Truck
                      className="shrink-0 text-indigo-600"
                    />

                    <div>
                      <p className="font-bold text-indigo-700">
                        Delivery Estimate
                      </p>

                      <p className="mt-1 text-sm text-indigo-900">
                        {delivery.distanceKm}
                        {" km"} ·{" "}
                        {
                          delivery.estimatedMinutes
                        }
                        {" minutes"}
                      </p>
                    </div>

                  </div>
                )
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default MyOrders;