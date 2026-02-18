"use client";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  Leaf,
} from "lucide-react";
import LogoImage from "@/assets/logo-ghee.svg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms-of-service" },
  ];

  return (
    <footer className="bg-foreground text-white md:px-15">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-10 md:py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">

          {/* Brand Section — 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/">
              <Image
                className="w-40 h-15 -mt-2"
                alt="NavPrana Organics"
                src={LogoImage}
                width={160}
                height={60}
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Bringing you the finest pure desi ghee using traditional methods
              passed down through generations.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2 pt-1">
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
                      className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all"
                      aria-label={item.platform_name}
                    >
                      {Icon ? <Icon size={16} /> : null}
                    </a>
                  );
                })
                : [Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                  <span
                    key={idx}
                    className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white/30"
                  >
                    <Icon size={16} />
                  </span>
                ))}
            </div>
          </div>

          {/* Quick Links — 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Quick Links
            </h4>
            <div className="space-y-2.5">
              {quickLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.path}
                  className="block text-sm text-white/70 hover:text-primary transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact — 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Contact Us
            </h4>
            <div className="space-y-3.5">
              <a
                href="tel:+917509531811"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <Phone size={14} className="text-primary" />
                </div>
                <span className="text-sm text-white/70 group-hover:text-white transition">
                  +91 7509531811
                </span>
              </a>
              <a
                href="mailto:support@navprana.com"
                className="flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition">
                  <Mail size={14} className="text-primary" />
                </div>
                <span className="text-sm text-white/70 group-hover:text-white transition">
                  support@navprana.com
                </span>
              </a>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={14} className="text-primary" />
                </div>
                <span className="text-sm text-white/60 leading-relaxed">
                  L-232, Old H.B Colony,
                  <br />
                  Morena, Madhya Pradesh,
                  <br />
                  India 476001
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter — 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-white/60 mb-4">
              Subscribe for exclusive offers, health tips & recipes.
            </p>
            <div className="space-y-2.5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/40 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition cursor-pointer">
                  <ArrowRight size={14} className="text-white" />
                </button>
              </div>
              <p className="text-[11px] text-white/40">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} NavPrana Organics. All rights reserved.
              Made with ❤️ for traditional food lovers.
            </p>

            <div className="flex items-center gap-5">
              {legalLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.path}
                  className="text-xs text-white/40 hover:text-white/70 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
