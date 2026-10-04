import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Trash2,
  Package,
} from "lucide-react";

import { apiRequest } from "../api";

const ShopDashboard = () => {
  const [products, setProducts] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      price: "",
      category: "Groceries",
      image: "",
      quantity: "",
    });

  const loadProducts = async () => {
    try {
      const data =
        await apiRequest(
          "/materials/mine"
        );

      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const data =
        await apiRequest(
          "/materials",
          {
            method: "POST",

            body: JSON.stringify({
              ...form,
              price: Number(
                form.price
              ),
              quantity: Number(
                form.quantity
              ),
            }),
          }
        );

      setMessage(
        data.message
      );

      setForm({
        title: "",
        description: "",
        price: "",
        category: "Groceries",
        image: "",
        quantity: "",
      });

      setShowForm(false);

      loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteProduct = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this product?"
      )
    ) {
      return;
    }

    try {
      await apiRequest(
        `/materials/${id}`,
        {
          method: "DELETE",
        }
      );

      loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

        <div>
          <p className="font-semibold text-indigo-600">
            SHOP OWNER
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Shop Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your products and stock.
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(
              !showForm
            )
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-indigo-600"
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>

      {message && (
        <div className="mt-6 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700">
          {message}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={addProduct}
          className="mt-8 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200"
        >

          <h2 className="text-2xl font-black">
            Add New Product
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <input
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="Product name"
              required
              className="input"
            />

            <select
              name="category"
              value={form.category}
              onChange={updateField}
              className="input"
            >
              <option>
                Groceries
              </option>

              <option>
                Electronics
              </option>

              <option>
                Clothing
              </option>

              <option>
                Stationery
              </option>

              <option>
                Home
              </option>

              <option>
                Beauty
              </option>

              <option>
                Other
              </option>
            </select>

            <input
              name="price"
              value={form.price}
              onChange={updateField}
              placeholder="Price"
              type="number"
              min="0"
              required
              className="input"
            />

            <input
              name="quantity"
              value={form.quantity}
              onChange={updateField}
              placeholder="Available quantity"
              type="number"
              min="0"
              required
              className="input"
            />

            <input
              name="image"
              value={form.image}
              onChange={updateField}
              placeholder="Product image URL"
              className="input md:col-span-2"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Product description"
              rows="4"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 md:col-span-2"
            />

          </div>

          <button className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-500">
            Add Product
          </button>

        </form>
      )}

      <div className="mt-10">

        <h2 className="text-2xl font-black">
          Your Products
        </h2>

        {products.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-12 text-center ring-1 ring-slate-200">

            <Package
              className="mx-auto text-slate-300"
              size={50}
            />

            <p className="mt-4 font-semibold">
              You haven't added any products yet.
            </p>

          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-5 py-4">
                      Product
                    </th>

                    <th className="px-5 py-4">
                      Category
                    </th>

                    <th className="px-5 py-4">
                      Price
                    </th>

                    <th className="px-5 py-4">
                      Stock
                    </th>

                    <th className="px-5 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {products.map(
                    (product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-slate-50"
                      >

                        <td className="px-5 py-4 font-semibold">
                          {product.title}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {product.category}
                        </td>

                        <td className="px-5 py-4">
                          ₹{product.price}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              product.quantity > 0
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </td>

                        <td className="px-5 py-4">

                          <button
                            onClick={() =>
                              deleteProduct(
                                product._id
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2
                              size={18}
                            />
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>
              </table>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ShopDashboard;