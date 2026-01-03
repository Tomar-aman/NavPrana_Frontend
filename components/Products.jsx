import { ShoppingCart, Star, Truck, Shield, Heart } from "lucide-react";
import gheeProductImage from "@/assets/ghee-product.jpg";
import cookingGheeImage from "@/assets/cooking-with-ghee.jpg";
import Image from "next/image";

const Products = () => {
  const products = [
    {
      id: 1,
      name: "Premium Desi Ghee",
      image: gheeProductImage,
      price: "₹899",
      originalPrice: "₹1,199",
      size: "500ml",
      description:
        "Pure A2 ghee from grass-fed Gir cows, traditionally churned",
      features: [
        "100% Pure A2",
        "Grass-Fed Cows",
        "Traditional Churning",
        "Lab Tested",
      ],
      rating: 4.9,
      reviews: 1247,
      badge: "Bestseller",
    },
    {
      id: 2,
      name: "Traditional Bilona Ghee",
      image: cookingGheeImage,
      price: "₹1,299",
      originalPrice: "₹1,599",
      size: "750ml",
      description:
        "Hand-churned using ancient bilona method, rich in nutrients",
      features: [
        "Bilona Method",
        "Hand Churned",
        "Rich Aroma",
        "Premium Quality",
      ],
      rating: 4.8,
      reviews: 896,
      badge: "Premium",
    },
    {
      id: 3,
      name: "Organic Farm Ghee",
      image: gheeProductImage,
      price: "₹699",
      originalPrice: "₹899",
      size: "250ml",
      description:
        "Small batch organic ghee perfect for families trying first time",
      features: [
        "Organic Certified",
        "Small Batch",
        "Perfect Starter",
        "Chemical Free",
      ],
      rating: 4.7,
      reviews: 543,
      badge: "New",
    },
  ];

  return (
    <section id="products" className="py-20 bg-background md:px-15">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-gradient">Premium Collection</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from our carefully crafted range of pure desi ghee, each made
            with traditional methods and the finest ingredients for authentic
            taste and nutrition.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group overflow-hidden border-0 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-black/40 transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm rounded-xl"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                      product.badge === "Bestseller"
                        ? "bg-primary text-primary-foreground"
                        : product.badge === "Premium"
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Product Details */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {product.features.slice(0, 2).map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 border border-primary/30 text-xs rounded-md text-foreground/80"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-primary fill-current" />
                    <span className="font-medium text-sm">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price & Size */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-foreground">
                        {product.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.size}
                    </span>
                  </div>

                  {/* Custom Button */}
                  <button className="px-6 py-2 rounded-md bg-primary text-white font-medium text-sm flex items-center group-hover:bg-primary/90 transition-colors">
                    <ShoppingCart className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              desc: "On orders above ₹999",
            },
            {
              icon: Shield,
              title: "Quality Assured",
              desc: "Lab tested purity",
            },
            {
              icon: Star,
              title: "5000+ Reviews",
              desc: "Customer satisfaction",
            },
            {
              icon: Heart,
              title: "Made with Love",
              desc: "Traditional methods",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center space-y-3 p-6 bg-card/30 rounded-lg"
            >
              <div className="w-12 h-12 bg-[#2b6033] rounded-full flex items-center justify-center">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
