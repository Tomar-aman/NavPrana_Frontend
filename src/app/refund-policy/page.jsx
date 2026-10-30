import { RotateCcw, ShieldCheck, Clock, PackageCheck, Phone } from "lucide-react";
import Link from "next/link";
import { whatsappUrl, WHATSAPP_NUMBER } from "@/lib/whatsapp";

// Same terms as the "Returns and Refunds" section of /terms-of-service and the
// MerchantReturnPolicy in the product JSON-LD — change all three together.
export const metadata = {
  title: "Return & Refund Policy — 7-Day Returns on Ghee",
  description:
    "NavPrana Organics return and refund policy: 7-day returns on unopened jars, free replacement or full refund for damaged or defective ghee, refunds in 5-7 business days.",
  openGraph: {
    title: "Return & Refund Policy | NavPrana Organics",
    description:
      "7-day returns on unopened jars. Damaged or defective ghee is replaced free or fully refunded.",
    url: "/refund-policy",
  },
  alternates: {
    canonical: "/refund-policy",
  },
};

const highlights = [
  {
    icon: ShieldCheck,
    title: "Damaged or defective?",
    description: "Free replacement or a full refund. Just tell us within 48 hours of delivery.",
  },
  {
    icon: RotateCcw,
    title: "7-day returns",
    description: "Return unopened jars in their original packaging within 7 days of delivery.",
  },
  {
    icon: Clock,
    title: "Refund in 5-7 days",
    description: "Refunds are processed within 5-7 business days once approved.",
  },
];

const displayPhone = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2)}`;

const Page = () => {
  return (
    <div className="min-h-screen bg-background mt-20">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Return &amp; Refund Policy</h1>
        <p className="text-muted-foreground leading-relaxed mb-10">
          We want you to be completely satisfied with your NavPrana ghee. If a
          jar reaches you damaged, leaking or not right, we will make it right.
        </p>

        <section className="grid md:grid-cols-3 gap-4 mb-12">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h.icon className="h-6 w-6 text-primary mb-3" />
              <h2 className="font-semibold mb-1">{h.title}</h2>
              <p className="text-sm text-muted-foreground">{h.description}</p>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Quality Guarantee</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you receive a damaged or defective product, we will replace it at
            no charge or provide a full refund. Please contact us within 48
            hours of delivery with your order number and a photo of the jar and
            packaging.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Returns</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>7-day return window from the delivery date</li>
            <li>Products must be unopened and in their original packaging</li>
            <li>Return shipping costs are the responsibility of the customer</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Refunds &amp; Cancellations</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Refunds are processed within 5-7 business days once approved</li>
            <li>Cancelled prepaid orders receive a full refund</li>
          </ul>
        </section>

        <section className="rounded-2xl bg-primary/5 p-6">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-primary" /> How to raise a return
          </h2>
          <p className="text-muted-foreground mb-4">
            Message us on WhatsApp or call with your order number.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <a
              href={whatsappUrl("Hi NavPrana, I want to raise a return/refund for my order.\n\nOrder number: ")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white"
            >
              WhatsApp us
            </a>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold"
            >
              <Phone className="h-4 w-4" /> {displayPhone}
            </a>
          </div>
        </section>

        <p className="text-sm text-muted-foreground mt-10">
          See also our <Link href="/shipping-policy" className="text-primary underline">Shipping Policy</Link> and{" "}
          <Link href="/terms-of-service" className="text-primary underline">Terms of Service</Link>.
        </p>
      </main>
    </div>
  );
};

export default Page;
