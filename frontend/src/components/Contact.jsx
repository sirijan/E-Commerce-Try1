const Contact = () => {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20">

      <div className="grid gap-8 md:grid-cols-2">

        <div>
          <p className="font-semibold text-indigo-600">
            CONTACT
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Get in touch
          </h1>

          <p className="mt-4 leading-7 text-slate-500">
            Have a question about an order,
            product or shop? Contact us and
            we'll help you.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">

          <input
            placeholder="Your name"
            className="input"
          />

          <input
            placeholder="Email"
            type="email"
            className="input mt-4"
          />

          <textarea
            placeholder="Your message"
            rows="5"
            className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />

          <button className="mt-4 w-full rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-indigo-600">
            Send Message
          </button>

        </div>

      </div>

    </section>
  );
};

export default Contact;