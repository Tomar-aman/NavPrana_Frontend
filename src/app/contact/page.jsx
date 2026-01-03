"use client";

import { ArrowLeft, Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 98765 43210", "+91 98765 43211"],
      description: "Call us during business hours",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@goldghee.com", "orders@goldghee.com"],
      description: "Send us your queries",
    },
    {
      icon: MapPin,
      title: "Address",
      details: [
        "Village Khemka, Tehsil Bari",
        "District Dholpur, Rajasthan 328021",
      ],
      description: "Visit our farm and facility",
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon - Sat: 9 AM - 6 PM", "Sunday: 10 AM - 4 PM"],
      description: "We're here to help",
    },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 ">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-6 md:px-15">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-gradient">Contact Us</h1>
            <div></div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 md:px-15">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We'd love to hear from you! Whether you have questions about our
            products, want to visit our farm, or need support with your order,
            we're here to help.
          </p>
        </section>

        {/* Contact Info */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, i) => (
            <div
              key={i}
              className="p-6 text-center border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{info.title}</h3>
              <div className="space-y-2 my-3">
                {info.details.map((d, j) => (
                  <p key={j} className="text-sm font-medium">
                    {d}
                  </p>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {info.description}
              </p>
            </div>
          ))}
        </section>

        {/* Contact Form + Farm Info */}
        <section className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Form */}
          <div className="border border-border/50 rounded-lg p-8 bg-card/50 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-2">Send us a Message</h3>
            <p className="text-muted-foreground mb-6">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="w-full border border-border/50 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="w-full border border-border/50 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-border/50 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full border border-border/50 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  className="w-full border border-border/50 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  className="w-full border border-border/50 rounded-lg px-3 py-2 min-h-[120px]"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>

          {/* Farm Info */}
          <div className="space-y-6">
            <div className="border border-border/50 rounded-lg p-8 bg-card/50 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">Visit Our Farm</h3>
              <p className="text-muted-foreground mb-4">
                We welcome visitors to our organic farm! Experience how we make
                premium desi ghee using traditional methods.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🌿 Guided tour of our farm</li>
                <li>🐄 Meet our A2 cows</li>
                <li>🥣 Watch the bilona process</li>
                <li>🍯 Taste fresh ghee</li>
                <li>🍴 Farm-to-table lunch</li>
              </ul>
              <div className="bg-primary/5 rounded-lg p-4 mt-4">
                <h5 className="font-semibold mb-2">Booking Required</h5>
                <p className="text-sm text-muted-foreground">
                  Please call us at least 48 hours in advance. Discounts for
                  groups of 10+.
                </p>
              </div>
            </div>

            <div className="border border-border/50 rounded-lg p-8 bg-card/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-2">Bulk Orders</h3>
              <p className="text-muted-foreground mb-4">
                Want to stock our ghee in your store or need bulk quantities? We
                offer wholesale pricing.
              </p>
              <button className="w-full border border-primary text-primary py-3 rounded-lg hover:bg-primary/10 transition">
                Request Wholesale Pricing
              </button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-card/30 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center mb-10 text-foreground">
            Frequently Asked Questions
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="p-5 bg-background rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="font-semibold text-lg text-foreground mb-2">
                  How long does shipping take?
                </h4>
                <p className="text-muted-foreground">
                  Delivery takes 2-5 business days.
                </p>
              </div>

              <div className="p-5 bg-background rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="font-semibold text-lg text-foreground mb-2">
                  Do you ship nationwide?
                </h4>
                <p className="text-muted-foreground">
                  Yes, we deliver across India with special packaging.
                </p>
              </div>

              <div className="p-5 bg-background rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="font-semibold text-lg text-foreground mb-2">
                  What is your return policy?
                </h4>
                <p className="text-muted-foreground">
                  Contact us within 7 days if you're not satisfied. 100%
                  guarantee.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="p-5 bg-background rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="font-semibold text-lg text-foreground mb-2">
                  How should I store the ghee?
                </h4>
                <p className="text-muted-foreground">
                  Store in a cool, dry place. Refrigeration optional for longer
                  shelf life.
                </p>
              </div>

              <div className="p-5 bg-background rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="font-semibold text-lg text-foreground mb-2">
                  Is your ghee lactose-friendly?
                </h4>
                <p className="text-muted-foreground">
                  Yes, most lactose intolerant individuals can consume it.
                </p>
              </div>

              <div className="p-5 bg-background rounded-xl shadow-sm hover:shadow-md transition">
                <h4 className="font-semibold text-lg text-foreground mb-2">
                  Do you offer gift packaging?
                </h4>
                <p className="text-muted-foreground">
                  Yes, we provide premium gift packaging with messages.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
