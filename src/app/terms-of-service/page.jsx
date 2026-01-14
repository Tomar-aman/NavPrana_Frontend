import { ArrowLeft } from "lucide-react";
import Link from "next/link";
const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      {/* <div className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-gradient">
              Terms of Service
            </h1>
            <div></div>
          </div>
        </div>
      </div> */}

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card/30 rounded-3xl p-8 md:p-12">
            <div className="mb-8">
              <p className="text-muted-foreground">
                Last updated: January 1, 2024
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using the GoldGhee website, you accept and
                  agree to be bound by the terms and provision of this
                  agreement. If you do not agree to abide by the above, please
                  do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Use License</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the
                  materials on GoldGhee's website for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a
                  transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>modify or copy the materials</li>
                  <li>
                    use the materials for any commercial purpose or for any
                    public display
                  </li>
                  <li>
                    attempt to reverse engineer any software contained on the
                    website
                  </li>
                  <li>
                    remove any copyright or other proprietary notations from the
                    materials
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This license shall automatically terminate if you violate any
                  of these restrictions and may be terminated by GoldGhee at any
                  time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Product Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We strive to provide accurate product information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Product descriptions and ingredients</li>
                  <li>Pricing and availability</li>
                  <li>Nutritional information</li>
                  <li>Storage and usage instructions</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  However, we do not warrant that product descriptions or other
                  content is accurate, complete, reliable, current, or
                  error-free.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Orders and Payment</h2>
                <h3 className="text-xl font-semibold mb-3">Order Acceptance</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All orders are subject to acceptance and availability. We
                  reserve the right to refuse or cancel any order for any
                  reason, including but not limited to product availability,
                  errors in pricing, or suspected fraud.
                </p>

                <h3 className="text-xl font-semibold mb-3">Pricing</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All prices are displayed in Indian Rupees (INR)</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Shipping charges and taxes will be added at checkout</li>
                  <li>We reserve the right to correct pricing errors</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">
                  Shipping and Delivery
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We ship nationwide across India. Delivery terms include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Processing time: 1-2 business days</li>
                  <li>
                    Shipping time: 2-7 business days depending on location
                  </li>
                  <li>Special packaging for temperature-sensitive products</li>
                  <li>Tracking information provided for all orders</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Risk of loss and title for products pass to you upon delivery
                  to the carrier.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Returns and Refunds</h2>
                <h3 className="text-xl font-semibold mb-3">Return Policy</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We want you to be completely satisfied with your purchase. Our
                  return policy includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>7-day return window from delivery date</li>
                  <li>Products must be unopened and in original packaging</li>
                  <li>
                    Return shipping costs are the responsibility of the customer
                  </li>
                  <li>Refunds processed within 5-7 business days</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">
                  Quality Guarantee
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you receive a damaged or defective product, we will replace
                  it at no charge or provide a full refund. Please contact us
                  within 48 hours of delivery for quality issues.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you create an account with us, you must provide accurate
                  and complete information. You are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    Maintaining the confidentiality of your account and password
                  </li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Providing accurate and up-to-date information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Prohibited Uses</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may not use our website for any unlawful purpose or to
                  solicit others to perform unlawful acts. You may not violate
                  any local, state, national, or international laws or
                  regulations.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Prohibited activities include but are not limited to: fraud,
                  harassment, intellectual property infringement, and
                  distribution of harmful content.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The materials on GoldGhee's website are provided on an 'as is'
                  basis. GoldGhee makes no warranties, expressed or implied, and
                  hereby disclaims and negates all other warranties including
                  without limitation, implied warranties or conditions of
                  merchantability, fitness for a particular purpose, or
                  non-infringement of intellectual property or other violation
                  of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Limitations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall GoldGhee or its suppliers be liable for any
                  damages (including, without limitation, damages for loss of
                  data or profit, or due to business interruption) arising out
                  of the use or inability to use the materials on GoldGhee's
                  website, even if GoldGhee or its authorized representative has
                  been notified orally or in writing of the possibility of such
                  damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These terms and conditions are governed by and construed in
                  accordance with the laws of India. Any disputes relating to
                  these terms shall be subject to the exclusive jurisdiction of
                  the courts of Rajasthan, India.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to revise these terms of service at any
                  time without notice. By using this website, you are agreeing
                  to be bound by the then current version of these terms of
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="bg-background/50 rounded-lg p-4 space-y-2">
                  <p>
                    <strong>Email:</strong> legal@goldghee.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                  <p>
                    <strong>Address:</strong> Village Khemka, Tehsil Bari,
                    District Dholpur, Rajasthan 328021
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
