const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col align-center justify-center text-center">
          <p className="text-sm">&copy; 2025 Scrap Bidding Application</p>
          <p className="text-sm">
            Powered by{" "}
            <a
              href="https://aiiventure.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              aiiventure.com
            </a>
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  