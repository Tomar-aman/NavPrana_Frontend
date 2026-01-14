import Benefits from "../../components/Benefits";
// import Footer from "../../components/Footer";
// import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Products from "../../components/Products";
import Testimonials from "../../components/Testimonials";

const Page = () => {
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <main>
        <Hero />
        <Benefits />
        <Products />
        <Testimonials />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Page;
