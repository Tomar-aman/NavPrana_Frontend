"use client";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import LogoImage from "@/assets/logo-ghee.svg";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { getSocialMediaLinks } from "@/services/contact/get-social-media-links";

const SOCIAL_ICON_MAP = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const links = await getSocialMediaLinks();
      setSocialLinks(links);
    };
    fetchLinks();
  }, []);

  return (
    <footer className="bg-foreground text-white md:px-15">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Image className="w-40 h-15" alt="NavPrana Organics" src={LogoImage} />
            </div>
            <p className="text-background/80 leading-relaxed">
              Bringing you the finest pure desi ghee using traditional methods
              passed down through generations. Experience the authentic taste
              and nutrition of real ghee.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              {socialLinks.length > 0
                ? socialLinks.map((item) => {
                  const Icon =
                    SOCIAL_ICON_MAP[item.platform_name.toLowerCase()];
                  return (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full text-background hover:text-primary hover:bg-background/10 transition-colors"
                      aria-label={item.platform_name}
                    >
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </a>
                  );
                })
                : [Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                  <span
                    key={idx}
                    className="p-2 rounded-full text-background/40 bg-background/10"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold">Quick Links</h4>
            <div className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Products", path: "/products" },
                { label: "Health Benefits", path: "/health-benefits" },
                { label: "About", path: "/about" },
                { label: "Contact", path: "/contact" },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.path}
                  className="block text-background/80 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Customer Support */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold">Customer Support</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-background/80">+91 7509531811</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-background/80">support@navprana.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <span className="text-background/80">
                  L-232, Old H.B Colony,
                  <br />
                  Morena, Madhya Pradesh,
                  <br />
                  India 476001
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold">Stay Updated</h4>
            <p className="text-background/80 text-sm">
              Subscribe to our newsletter for exclusive offers, health tips, and
              traditional recipes.
            </p>
            <div className="space-y-3">
              {/* Custom Input */}
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-background/10 border border-background/20 text-background placeholder:text-background/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {/* Custom Button */}
              <button className="w-full px-4 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
            <div className="text-xs text-background/60">
              We respect your privacy. Unsubscribe at any time.
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-background/80 text-sm">
              © {new Date().getFullYear()} NavPrana Organics. All rights
              reserved. Made with ❤️ for traditional food lovers.
            </div>

            <div className="flex space-x-6 text-sm">
              <a
                href="/privacy-policy"
                className="text-background/80 hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-of-service"
                className="text-background/80 hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
              {/* <a
                href="shipping-policy"
                className="text-background/80 hover:text-primary transition-colors"
              >
                Shipping Policy
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
