import Link from 'next/link';
import Image from 'next/image';

function Footer() {
  // Data for navigation links
  const pageLinks = [
    { title: "Home", href: "/" },
    { title: "Pricing", href: "/pricing" },
    { title: "Blog", href: "/blog" },
    { title: "About page", href: "/about" },
    { title: "Blog Details page", href: "/blog/details" },
    { title: "Contact", href: "/contact" },
    { title: "404 Error page", href: "/404" },
  ];

  // Contact information
  const contactInfo = [
    { info: "contact@pdfease.com", href: "mailto:contact@pdfease.com" },
    { info: "+1 888 777 222", href: "tel:+18887772222" },
    { info: "123 Main Street, New York, NY", href: "#" },
  ];

  // Footer links
  const footerLinks = [
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Terms & Conditions", href: "/terms-conditions" },
  ];

  return (
    <footer className="w-full py-10 border-t border-[#e5e5e5]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Company info section */}
          <div className="space-y-3">
            <Image 
              src="/logo.svg" 
              alt="PdfEase Logo" 
              width={120}
              height={38}
              className="h-10 w-auto"
            />
            <p className="font-normal text-black text-sm">
              Experience document management like never <br className="hidden md:block" />
              before with PdfEase.
            </p>
            <div className="flex space-x-3">
              <Link
                href="#"
                className="w-7 h-7 bg-[#ebe7df] rounded-md flex items-center justify-center hover:bg-[#712fff] hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="w-7 h-7 bg-[#ebe7df] rounded-md flex items-center justify-center hover:bg-[#712fff] hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </Link>
              <Link
                href="#"
                className="w-7 h-7 bg-[#ebe7df] rounded-md flex items-center justify-center hover:bg-[#712fff] hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
            </div>
          </div>

          {/* Page links section */}
          <div className="space-y-3">
            <h3 className="font-medium text-[#312f2f] text-lg">Pages</h3>
            <nav className="grid grid-cols-2 gap-1">
              {pageLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="font-normal text-black text-sm hover:text-[#712fff] transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact section */}
          <div className="space-y-3">
            <h3 className="font-medium text-[#312f2f] text-lg">Contact Us</h3>
            <div className="space-y-2">
              {contactInfo.map((item, index) => (
                item.href.startsWith('mailto:') || item.href.startsWith('tel:') ? (
                  <a
                    key={index}
                    href={item.href}
                    className="block font-normal text-[#312f2f] text-sm hover:text-[#712fff] transition-colors"
                  >
                    {item.info}
                  </a>
                ) : (
                  <Link
                    key={index}
                    href={item.href}
                    className="block font-normal text-[#312f2f] text-sm hover:text-[#712fff] transition-colors"
                  >
                    {item.info}
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Footer bottom section */}
        <div className="mt-10 pt-3 border-t border-[#c1bfb4]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-normal text-[#2b2b2b] text-sm mb-3 md:mb-0">
              © {new Date().getFullYear()} PdfEase. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {footerLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="font-normal text-black text-sm hover:text-[#712fff] transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
