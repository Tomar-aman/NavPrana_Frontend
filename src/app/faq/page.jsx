import FaqClient from "./FaqClient";

const BASE_API = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://api.navprana.cloud/"
).replace(/\/+$/, "");

// Fetched on the server so both the FAQ content and the FAQPage schema
// are present in the very first HTML response — required for AEO
// (ChatGPT/GPTBot, Perplexity, Google-Extended, etc. don't run JS).
async function getFaqData() {
  try {
    const res = await fetch(`${BASE_API}/api/v1/contact/faqs/`, {
      next: { revalidate: 3600 }, // refresh once an hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("Server FAQ fetch failed:", error);
    return [];
  }
}

export const dynamic = "force-dynamic";

const Page = async () => {
  const faqData = await getFaqData();
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

  return (
    <>
      {allQuestions.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <FaqClient initialFaqs={faqData} />
    </>
  );
};

export default Page;
