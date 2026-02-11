import {
  ArrowLeft,
  Truck,
  Package,
  Clock,
  MapPin,
  Shield,
  Phone,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Shipping Policy — Fast & Secure Delivery Across India",
  description:
    "Learn about NavPrana Organics shipping policy. We deliver pure desi ghee across India with temperature-controlled packaging, free shipping available on qualifying orders.",
  keywords: [
    "NavPrana shipping",
    "ghee delivery India",
    "organic ghee shipping",
    "free shipping ghee",
  ],
  openGraph: {
    title: "Shipping Policy | NavPrana Organics",
    description:
      "Fast and secure delivery of organic desi ghee across India. Temperature-controlled packaging ensures freshness.",
    url: "/shipping-policy",
  },
  alternates: {
    canonical: "/shipping-policy",
  },
};

const Page = () => {
  const shippingZones = [
    {
      zone: "Metro Cities",
      cities: "Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad",
      duration: "2-3 business days",
      charges: "Free shipping on orders above ₹999",
    },
    {
      zone: "Tier 1 Cities",
      cities: "Pune, Ahmedabad, Jaipur, Lucknow, Kanpur, Nagpur",
      duration: "3-4 business days",
      charges: "Free shipping on orders above ₹999",
    },
    {
      zone: "Tier 2 Cities",
      cities: "Agra, Varanasi, Meerut, Nashik, Faridabad",
      duration: "4-5 business days",
      charges: "Free shipping on orders above ₹999",
    },
    {
      zone: "Remote Areas",
      cities: "Hill stations, remote villages, islands",
      duration: "5-7 business days",
      charges: "Additional charges may apply",
    },
  ];

  const packagingFeatures = [
    {
      icon: Package,
      title: "Temperature Control",
      description:
        "Special insulated packaging to maintain product quality during transit",
    },
    {
      icon: Shield,
      title: "Secure Packaging",
      description:
        "Multiple layers of protection to prevent damage and contamination",
    },
    {
      icon: Truck,
      title: "Trusted Carriers",
      description:
        "Partnership with reliable logistics providers for safe delivery",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 my-20">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Fast & <span className="text-gradient">Secure Delivery</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We ensure your premium desi ghee reaches you fresh and safe with
              our reliable shipping services across India.
            </p>
          </section>

          {/* Shipping Zones */}
          <section className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">
              Delivery Timeline & Charges
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {shippingZones.map((zone, index) => (
                <div
                  key={index}
                  className="border border-border/50 bg-card/50 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h4 className="font-bold">{zone.zone}</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Coverage:</p>
                      <p className="text-sm text-muted-foreground">
                        {zone.cities}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium mb-1">
                          Delivery Time:
                        </p>
                        <p className="text-sm text-primary font-semibold">
                          {zone.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium mb-1">Shipping:</p>
                        <p className="text-sm text-green-600">{zone.charges}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Packaging Features */}
          <section className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">
              Our Packaging Promise
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {packagingFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="text-center border border-border/50 bg-card/50 backdrop-blur-sm rounded-xl p-6"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-bold mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Process */}
          <section className="bg-card/30 rounded-3xl p-8 md:p-12 mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">
              How We Ship Your Order
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                "Order Processing",
                "Quality Check",
                "Secure Packaging",
                "Delivery",
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">{step}</h4>
                  <p className="text-sm text-muted-foreground">
                    {index === 0 &&
                      "Orders are processed within 24 hours of confirmation"}
                    {index === 1 &&
                      "Each product undergoes quality inspection before packaging"}
                    {index === 2 &&
                      "Temperature-controlled packaging ensures freshness"}
                    {index === 3 &&
                      "Real-time tracking until safe delivery to your doorstep"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Terms & Tracking */}
          <section className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-bold mb-6">
                Shipping Terms & Conditions
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                <li>Orders placed before 2 PM are processed the same day</li>
                <li>
                  Orders placed after 2 PM are processed the next business day
                </li>
                <li>No processing on Sundays and national holidays</li>
                <li>Custom orders may take 2-3 additional days</li>
              </ul>
            </div>
            <div className="bg-background/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Real-time tracking available
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Once your order is shipped, you'll receive a tracking number via
                SMS and email.
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>Call us at +91 98765 43210</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Page;
