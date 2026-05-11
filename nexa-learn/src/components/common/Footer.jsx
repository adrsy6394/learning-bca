import React from "react";
import { useNavigate } from "react-router-dom";
import { Github, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const socialLinks = [
    { icon: Github, href: "https://github.com/adrsy6394" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/adarshyadav2006/" },
    { icon: Instagram, href: "https://www.instagram.com/adrs_dev.vibe/" },
  ];

  return (
    <footer className="py-24 bg-[#fdf7e9] border-t border-[#0b2b24]/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-[#0b2b24] rounded-full flex items-center justify-center text-[#d1e8c4] font-serif text-2xl">
                <img
                  src="/image.png"
                  alt="Logo"
                  className="h-10 w-10 rounded-full object-cover border-2 border-[#d1e8c4]"
                />
              </div>
              <span className="font-serif text-3xl text-[#0b2b24] tracking-tighter">
                NexaLearn
              </span>
            </div>
            <p className="text-[#0b2b24]/60 max-w-sm mb-8 text-lg font-light leading-relaxed">
              Empowering BCA students with AI-driven insights and a premium,
              high-quality learning experience.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-full border border-[#0b2b24]/10 text-[#0b2b24] hover:bg-[#0b2b24] hover:text-white transition-all duration-300"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h4 className="font-black text-[#0b2b24] mb-8 uppercase text-xs tracking-[0.3em]">
              Quick Links
            </h4>
            <ul className="space-y-4 text-[#0b2b24]/70 text-sm font-bold uppercase tracking-widest">
              <li>
                <button
                  onClick={() => navigate("/learning")}
                  className="hover:text-[#0b2b24] transition-colors"
                >
                  AI Learning
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/flashcards")}
                  className="hover:text-[#0b2b24] transition-colors"
                >
                  Flashcards
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/progress")}
                  className="hover:text-[#0b2b24] transition-colors"
                >
                  Progress Tracker
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[#0b2b24] mb-8 uppercase text-xs tracking-[0.3em]">
              Support
            </h4>
            <ul className="space-y-4 text-[#0b2b24]/70 text-sm font-bold uppercase tracking-widest">
              <li>
                <a href="#" className="hover:text-[#0b2b24] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0b2b24] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0b2b24] transition-colors">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-12 border-t border-[#0b2b24]/10 text-[#0b2b24]/40 text-xs font-bold uppercase tracking-widest">
          © 2025 NexaLearn Platform. All rights reserved. Premium Education for
          BCA.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
