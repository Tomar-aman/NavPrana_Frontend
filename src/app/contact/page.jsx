"use client";

import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { sendContactQuery } from "@/services/contact/send-query";

import { getContactInfo } from "@/services/contact/get-contact-info";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/redux/features/uiSlice";
import { toast } from "sonner";
import contactUsImage from "@/assets/contact_us.png";
import Image from "next/image";

const Page = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    phone_numbers: [],
    emails: [],
    addresses: [],
  });

  useEffect(() => {

    const fetchContactInfo = async () => {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (err) {
        toast.error("Failed to load contact information");
      }
    };


    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(showLoader());

    try {
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone_number: form.phone,
        message: form.message,
        subject: form.subject,
      };

      const result = await sendContactQuery(payload);

      if (result.status === 201) {
        toast.success(
          "Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.",
        );
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setSubmitStatus(null);
      } else {
        toast.error("Failed to send message. Please try again.");
        setSubmitStatus({
          type: "error",
          message: "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to send message. Please try again.",
      );
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: "Phone",
      color: "bg-blue-50",
      iconColor: "text-blue-500",
      content: contactInfo.phone_numbers.length > 0
        ? contactInfo.phone_numbers.map((p) => p.phone_number)
        : ["No phone numbers"],
      sub: "Call us during business hours",
    },
    {
      icon: Mail,
      title: "Email",
      color: "bg-amber-50",
      iconColor: "text-amber-500",
      content: contactInfo.emails.length > 0
        ? contactInfo.emails.map((e) => e.email)
        : ["No emails"],
      sub: "Send us your queries",
    },
    {
      icon: MapPin,
      title: "Address",
      color: "bg-green-50",
      iconColor: "text-green-600",
      content: contactInfo.addresses.length > 0
        ? contactInfo.addresses.map(
          (a) => `${a.address_line1}${a.address_line2 ? ", " + a.address_line2 : ""}, ${a.city}, ${a.state} ${a.postal_code}`
        )
        : ["No address"],
      sub: "Visit our office/facility",
    },
    {
      icon: Clock,
      title: "Hours",
      color: "bg-purple-50",
      iconColor: "text-purple-500",
      content: ["Mon - Sat: 9 AM - 6 PM", "Sunday: 10 AM - 4 PM"],
      sub: "We're here to help",
    },
  ];

  return (
    <div className="min-h-screen bg-background mt-20">
      <main className="container mx-auto px-4 py-8 md:px-15">
        {/* Header */}
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            <Mail size={14} />
            Contact Us
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;d love to hear from you! Whether you have questions about our
            products, or need support with your order, we&apos;re here to help.
          </p>
        </section>

        {/* Contact Cards */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {contactCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition"
            >
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <h3 className="text-sm font-semibold mb-2">{card.title}</h3>
              <div className="space-y-1 mb-2">
                {card.content.map((line, i) => (
                  <p key={i} className="text-xs font-medium text-foreground">
                    {line}
                  </p>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">{card.sub}</p>
            </div>
          ))}
        </section>

        {/* Contact Form Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center mb-10">
          {/* Image */}
          <div className="flex justify-center">
            <Image
              src={contactUsImage}
              alt="Contact Us Illustration"
              width={380}
              height={400}
              className="w-auto h-auto max-w-full object-contain"
              priority
            />
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold mb-1">Send us a Message</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="text-xs font-medium mb-1 block">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="text-xs font-medium mb-1 block">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-xs font-medium mb-1 block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="phone" className="text-xs font-medium mb-1 block">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="text-xs font-medium mb-1 block">
                    Subject
                  </label>
                  <input
                    id="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="text-xs font-medium mb-1 block">
                  Message
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm min-h-[100px] focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-medium py-2.5 rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send size={15} />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>


      </main>
    </div>
  );
};

export default Page;
