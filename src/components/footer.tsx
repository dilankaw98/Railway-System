import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold mb-4">Railway Platform</h3>
            <p className="text-sm text-blue-200 mb-4">
              Book your train tickets easily and securely.
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="flex items-center justify-center md:justify-start mb-2">
              <FaPhone className="mr-2 text-blue-300" />
              <p className="text-sm text-blue-200">+91 12345 67890</p>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <FaEnvelope className="mr-2 text-blue-300" />
              <p className="text-sm text-blue-200">info@railwayplatform.com</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a
                href="#"
                className="text-white hover:text-blue-300 transition duration-300"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-300 transition duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-300 transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-6 pt-6 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Railway Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  