import Link from "next/link";

export function CheckoutEmpty() {
  return (
    <section className="max-w-xl mx-auto px-5 py-32 text-center">
      <h1 className="serif text-4xl mb-4">Your cart is empty</h1>
      <p className="mute text-sm mb-6">
        Discover the new TAGE arrivals before proceeding to checkout.
      </p>
      <Link href="/shop" className="btn">
        Go to shop
      </Link>
    </section>
  );
}

