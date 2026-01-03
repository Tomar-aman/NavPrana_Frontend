import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "The taste and aroma of this ghee reminds me of my grandmother's homemade ghee. Pure quality and authentic flavor. Our whole family loves it!",
      initial: "PS",
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      text: "Been using this ghee for 6 months now. My digestive issues have improved significantly. The quality is exceptional and delivery is always on time.",
      initial: "RK",
    },
    {
      name: "Meera Patel",
      location: "Ahmedabad",
      rating: 5,
      text: "As a mother of two, I'm very conscious about what I feed my family. This ghee is pure, nutritious, and my kids love the taste in their food.",
      initial: "MP",
    },
    {
      name: "Dr. Vinod Singh",
      location: "Pune",
      rating: 5,
      text: "From an Ayurvedic perspective, this ghee has all the qualities mentioned in ancient texts. Highly recommend for health-conscious families.",
      initial: "VS",
    },
    {
      name: "Anita Reddy",
      location: "Bangalore",
      rating: 5,
      text: "The packaging is excellent and the ghee stays fresh for months. Love the traditional bilona method used. Worth every penny!",
      initial: "AR",
    },
    {
      name: "Suresh Gupta",
      location: "Jaipur",
      rating: 5,
      text: "Started using this ghee on my trainer's recommendation. Great for pre-workout energy and post-workout recovery. Authentic taste guaranteed!",
      initial: "SG",
    },
  ];

  return (
    <section className="py-20 bg-gradient-warm/50 md:px-15">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied customers who have made the switch to
            pure, traditional desi ghee and experienced the difference in taste
            and health.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-[#f3f2ee]/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-lg group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-8 w-8 text-primary" />
              </div>

              <div className="space-y-4">
                {/* Rating */}
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-[#2b6033] fill-current"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground/90 leading-relaxed text-sm">
                  "{testimonial.text}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center space-x-3 pt-2 ">
                  {/* Avatar */}
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#2b6033] from-primary to-secondary text-white border  font-semibold text-sm">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="text-center bg-[#f3f2ee]/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-400/50">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                4.9/5
              </div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                5000+
              </div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                99%
              </div>
              <p className="text-muted-foreground">Would Recommend</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
