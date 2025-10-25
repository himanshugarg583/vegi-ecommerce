import React from "react";

const footerBlocks = [
  {
    title: "Service",
    links: [
      { text: "Specials", href: "index.php?controller=prices-drop" },
      { text: "New products", href: "index.php?controller=new-products" },
      { text: "Best sellers", href: "index.php?controller=best-sales" },
      { text: "Our stores", href: "index.php?controller=stores" },
      { text: "Contact us", href: "index.php?controller=contact" },
    ],
  },
  {
    title: "Information",
    links: [
      { text: "Delivery", href: "index.php?id_cms=1&controller=cms&id_lang=1" },
      { text: "Legal Notice", href: "index.php?id_cms=2&controller=cms&id_lang=1" },
      { text: "About us", href: "index.php?id_cms=4&controller=cms&id_lang=1" },
      { text: "Sitemap", href: "index.php?controller=sitemap" },
    ],
  },
  {
    title: "My Account",
    links: [
      { text: "My orders", href: "index.php?controller=history" },
      { text: "My credit slips", href: "index.php?controller=order-slip" },
      { text: "My addresses", href: "index.php?controller=addresses" },
      { text: "My personal info", href: "index.php?controller=identity" },
    ],
  },
];

const contactBlock = {
  title: "Contact us",
  content: [
    "info@digithela.com",
    "+91 7413877437",
    "in front of sharma sweet,kumbha marg",
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#" },
  { name: "Twitter", href: "#" },
  { name: "RSS", href: "#" },
  { name: "Pinterest", href: "#" },
  { name: "Google+", href: "#" },
];

const LayoutFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-green-50 to-blue-50 text-gray-700 text-[13px] font-sans w-full">
      <div className="w-full bg-cover bg-center bg-no-repeat">
        <div className="w-full mx-auto px-6 py-12 lg:px-20 xl:px-32">
          {/* Footer Blocks */}
          <div className="flex flex-wrap justify-between gap-y-10 lg:gap-y-12">
            {footerBlocks.map((block) => (
              <div
                key={block.title}
                className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5"
              >
                <h4 className="text-xl sm:text-2xl font-semibold uppercase border-b border-gray-300 pb-3 mb-4 text-gray-900">
                  {block.title}
                </h4>
                <ul className="space-y-2 text-sm sm:text-base">
                  {block.links.map((link) => (
                    <li key={link.text}>
                      <a
                        href={link.href}
                        className="hover:text-[#0C6C44] transition-colors"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Block */}
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <h4 className="text-xl sm:text-2xl font-semibold uppercase border-b border-gray-300 pb-3 mb-4 text-gray-900">
                {contactBlock.title}
              </h4>
              <div className="space-y-2 text-sm sm:text-base">
                <div>
                  <a
                    href={`mailto:${contactBlock.content[0]}`}
                    className="hover:text-[#0C6C44] transition-colors"
                  >
                    {contactBlock.content[0]}
                  </a>
                  <div className="mt-1">{contactBlock.content[1]}</div>
                  <div className="mt-1">{contactBlock.content[2]}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-10 flex flex-col lg:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            {/* Copyright */}
            <div>© 2025 ReconcileTech, All Rights Reserved</div>

            {/* Social Links */}
            <div className="flex space-x-4 text-sm sm:text-base">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="hover:text-[#0C6C44] transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LayoutFooter;
