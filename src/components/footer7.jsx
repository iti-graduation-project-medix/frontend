import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DrugAlert } from "./DrugAlert";

const defaultSections = [
  {
    title: "Qiuck Links",
    links: [
      { name: "Home", href: "/" },
      { name: "Deals", href: "/deals" },
      { name: "Pharmacies", href: "/pharmacies" },
      { name: "Advertise", href: "/advertise" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <FaInstagram className="size-5" />, href: "https://instagram.com/dawaback", label: "Instagram" },
  { icon: <FaFacebook className="size-5" />, href: "https://facebook.com/dawaback", label: "Facebook" },
  { icon: <FaTwitter className="size-5" />, href: "https://twitter.com/dawaback", label: "Twitter" },
  { icon: <FaLinkedin className="size-5" />, href: "https://linkedin.com/company/dawaback", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

const Footer7 = ({
  logo = {
    url: "/",
    src: "/DawabackNewLogo.png",
    alt: "logo",
    title: "Dawaback",
  },
  sections = defaultSections,
  description = "Dawaback is the #1 platform for pharmacists to exchange medicines and sell pharmacies.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2025 dawaback.com. All rights reserved.",
  legalLinks = defaultLegalLinks,
}) => {
  return (
    <footer className="bg-background text-foreground p-6 md:px-16 lg:px-32 pt-3 border-t border-border shadow-inner">
      <div className="container mx-auto">
        {/* Top: Logo + Description + Socials */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between text-center lg:text-left gap-8 lg:gap-16 w-full">
          <div className="-mt-15 flex flex-col items-center lg:items-start max-w-lg mx-auto lg:mx-0 w-full lg:w-1/4">
            <Link to={logo.url} className="flex items-center gap-3 mb-4">
              <img
                src={logo.src}
                className="h-8 sm:h-10 md:h-12 drop-shadow-md"
                alt={logo.alt}
              />
              <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                {logo.title}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-full md:max-w-md lg:max-w-xl font-light">
              {description}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  to={social.href}
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-primary transition-colors duration-150"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Section + DrugAlert */}
          <div className="flex flex-col w-full gap-8 lg:flex-row lg:gap-16 mt-10 lg:mt-0 items-center lg:items-center">
            <div className="grid gap-6 w-full text-center lg:text-left sm:grid-cols-1 md:grid-cols-1 lg:gap-12 lg:w-1/4 flex-shrink-0">
              {sections.map((section, idx) => (
                <div key={idx} className="flex flex-col items-center lg:items-start">
                  <h4 className="font-bold text-base mb-2 text-primary uppercase tracking-wide letter-spacing-wide">
                    {section.title}
                  </h4>
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-start justify-center gap-2 text-sm text-muted-foreground">
                    {section.links.map((link, linkIdx) => (
                      <Link
                        key={linkIdx}
                        to={link.href}
                        className="hover:text-primary hover:font-semibold transition-colors duration-150 px-2 py-1 rounded-md"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full lg:flex-1 flex items-center justify-center lg:justify-end lg:mt-0 max-w-full">
              <DrugAlert className="w-full max-w-xl sm:max-w-2xl" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-6" />

        {/* Footer Bottom */}
        <div className="text-sm flex flex-col items-center justify-center text-muted-foreground">
          <p className="text-center font-light">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer7 };
