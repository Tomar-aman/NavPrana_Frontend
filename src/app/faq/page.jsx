"use client";

import { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, Leaf, Search, MessageCircle } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { getFaqs } from "@/services/faq/get-faqs";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/redux/features/uiSlice";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden transition hover:border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-3 text-left px-5 py-4 cursor-pointer"
      >
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${isOpen ? "bg-primary/10" : "bg-gray-100"}`}>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-gray-500"}`}
          />
        </div>
        <span className={`text-sm font-medium leading-snug transition ${isOpen ? "text-primary" : "text-foreground"}`}>
          {question}
        </span>
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-muted-foreground leading-relaxed px-5 pb-4 pl-14">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        dispatch(showLoader());
        const data = await getFaqs();
        setFaqData(data);
      } catch (err) {
        toast.error("Failed to load FAQs");
      } finally {
        setLoading(false);
        dispatch(hideLoader());
      }
    };
    fetchFaqs();
  }, []);

  // Generate FAQ Schema for SEO
  const allQuestions = faqData.flatMap((cat) => cat.faqs || []);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const filteredData = faqData
    .map((cat) => ({
      ...cat,
      faqs: (cat.faqs || []).filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.faqs.length > 0);

  if (loading) {
    return null;
  }

  return (
    <>
      {/* FAQ Schema Structured Data */}
      {allQuestions.length > 0 && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="min-h-screen bg-background mt-20">
        <main className="max-w-3xl mx-auto px-4 py-10">
          {/* Hero */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4">
              <HelpCircle size={13} /> Help Center
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Frequently Asked{" "}
              <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Everything you need to know about NavPrana — our organic food
              products, health benefits, ordering, and more.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-10">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            />
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredData.map((category) => (
              <div key={category.id || category.slug}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Leaf size={14} className="text-primary" />
                  </div>
                  <h2 className="text-base font-bold">{category.name}</h2>
                  <span className="text-[11px] text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-md">
                    {category.faqs.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {category.faqs.map((item) => (
                    <FAQItem
                      key={item.id}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {searchQuery && filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={22} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No questions match &quot;{searchQuery}&quot;
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try a different search term
              </p>
            </div>
          )}

          {!searchQuery && faqData.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">
                No FAQs available at the moment.
              </p>
            </div>
          )}

          {/* Contact CTA */}
          <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={22} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Still have questions?</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
              Can&apos;t find what you&apos;re looking for? Our team is happy to
              help with any questions about our products.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition"
            >
              Contact Us
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default Page;
