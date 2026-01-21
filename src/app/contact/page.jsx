"use client";

import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { sendContactQuery } from "@/services/contact/send-query";
import { getContactFaqs } from "@/services/contact/get-faqs";
import { getContactInfo } from "@/services/contact/get-contact-info";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/redux/features/uiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [faqs, setFaqs] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    phone_numbers: [],
    emails: [],
    addresses: [],
  });

  // const info = [
  //   {
  //     icon: Phone,
  //     title: "Phone",
  //     details: ["+91 98765 43210", "+91 98765 43211"],
  //     description: "Call us during business hours",
  //   },
  //   {
  //     icon: Mail,
  //     title: "Email",
  //     details: ["info@goldghee.com", "orders@goldghee.com"],
  //     description: "Send us your queries",
  //   },
  //   {
  //     icon: MapPin,
  //     title: "Address",
  //     details: [
  //       "Village Khemka, Tehsil Bari",
  //       "District Dholpur, Rajasthan 328021",
  //     ],
  //     description: "Visit our farm and facility",
  //   },
  //   {
  //     icon: Clock,
  //     title: "Hours",
  //     details: ["Mon - Sat: 9 AM - 6 PM", "Sunday: 10 AM - 4 PM"],
  //     description: "We're here to help",
  //   },
  // ];

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getContactFaqs();
        setFaqs(data);
      } catch (err) {
        // Optionally show a toast or fallback
        toast.error("Failed to load FAQs");
      }
    };
    const fetchContactInfo = async () => {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (err) {
        toast.error("Failed to load contact information");
      }
    };

    fetchFaqs();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 ">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <main className="container mx-auto px-4 py-12 md:px-15">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We'd love to hear from you! Whether you have questions about our
            products, or need support with your order, we're here to help.
          </p>
        </section>

        {/* Contact Info */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Phone */}
          <div className="p-6 text-center border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Phone</h3>
            <div className="space-y-2 my-3">
              {contactInfo.phone_numbers.length > 0 ? (
                contactInfo.phone_numbers.map((p) => (
                  <p key={p.id} className="text-sm font-medium">
                    {p.phone_number}
                  </p>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No phone numbers
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Call us during business hours
            </p>
          </div>
          {/* Email */}
          <div className="p-6 text-center border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Email</h3>
            <div className="space-y-2 my-3">
              {contactInfo.emails.length > 0 ? (
                contactInfo.emails.map((e) => (
                  <p key={e.id} className="text-sm font-medium">
                    {e.email}
                  </p>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No emails</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Send us your queries
            </p>
          </div>
          {/* Address */}
          <div className="p-6 text-center border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Address</h3>
            <div className="space-y-2 my-3">
              {contactInfo.addresses.length > 0 ? (
                contactInfo.addresses.map((a) => (
                  <p key={a.id} className="text-sm font-medium">
                    {a.address_line1}
                    <br />
                    {a.address_line2 && (
                      <>
                        {a.address_line2}
                        <br />
                      </>
                    )}
                    {a.city}, {a.state} {a.postal_code}
                    <br />
                    {a.country}
                  </p>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No address</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Visit our office/facility
            </p>
          </div>
          {/* Hours (static) */}
          <div className="p-6 text-center border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Hours</h3>
            <div className="space-y-2 my-3">
              <p className="text-sm font-medium">Mon - Sat: 9 AM - 6 PM</p>
              <p className="text-sm font-medium">Sunday: 10 AM - 4 PM</p>
            </div>
            <p className="text-xs text-muted-foreground">We're here to help</p>
          </div>
        </section>

        {/* Contact Form - Two Column Layout Responsive and Equal */}
        <section className="flex flex-col md:flex-row justify-center items-stretch min-h-[70vh] mb-16 gap-8">
          {/* Left: Image */}
          <div className="flex-1 flex justify-center items-center min-h-[500px]  mb-6 md:mb-0">
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={contactUsImage}
                alt="Contact Us Illustration"
                width={420}
                height={500}
                className="w-auto h-auto max-w-full object-contain"
                priority
              />
            </div>
          </div>
          {/* Right: Form */}
          <div className="flex-1 flex items-center justify-center min-h-[500px]">
            <div className="w-full max-w-lg bg-white/80 shadow-xl rounded-2xl p-10 border border-border/30 backdrop-blur-md mx-auto">
              <h3 className="text-3xl font-extrabold mb-3 text-center text-primary">
                Send us a Message
              </h3>
              <p className="text-base text-muted-foreground mb-8 text-center">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-1">
                    <label htmlFor="firstName" className="font-medium text-sm">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full border border-border/40 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label htmlFor="lastName" className="font-medium text-sm">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="w-full border border-border/40 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="font-medium text-sm">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full border border-border/40 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="space-y-1">
                    <label htmlFor="phone" className="font-medium text-sm">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full border border-border/40 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="subject" className="font-medium text-sm">
                      Subject
                    </label>
                    <input
                      id="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                      className="w-full border border-border/40 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="message" className="font-medium text-sm">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className="w-full border border-border/40 rounded-lg px-4 py-2 min-h-[100px] focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-lg shadow-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  <Send className="h-5 w-5" />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-card/30 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center mb-10 text-foreground">
            Frequently Asked Questions
          </h3>

          {faqs.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No FAQs available.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-5 bg-background rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-lg text-foreground mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Page;
