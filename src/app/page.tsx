import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[70px_1fr_70px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-7xl flex justify-between items-center">
        <div className="flex items-center gap-2 hover-lift">
          <Image
            src="/logo.svg"
            alt="YouiUX Logo"
            width={40}
            height={40}
            className="dark:invert animate-fade-in"
          />
          <h1 className="text-2xl font-bold">You<span className="gradient-text">i</span>UX</h1>
        </div>
        <nav className="hidden sm:flex gap-6">
          <a href="#features" className="relative hover:text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full">Features</a>
          <a href="#pricing" className="relative hover:text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full">Pricing</a>
          <a href="#about" className="relative hover:text-blue-500 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full">About</a>
        </nav>
      </header>
      
      <main className="flex flex-col gap-[40px] row-start-2 items-center text-center max-w-4xl animate-fade-in">
        <h2 className="text-4xl sm:text-6xl font-bold leading-tight">
          Design. Collaborate. <span className="gradient-text">Own Your Work.</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl animate-slide-up opacity-0" style={{animationDelay: "0.2s", animationFillMode: "forwards"}}>
          YouiUX is a next-generation design tool built for the web3 era, powered by AI to enhance your workflow and reimagine your creative process.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8 animate-slide-up opacity-0" style={{animationDelay: "0.4s", animationFillMode: "forwards"}}>
          <Link
            className="rounded-full border border-solid border-transparent transition-all flex items-center justify-center gradient-bg text-white gap-2 hover:shadow-lg font-medium text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 sm:w-auto hover-lift"
            href="/editor"
          >
            Launch Editor
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-all flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 w-full sm:w-auto hover-lift"
            href="/examples"
          >
            View Examples
          </Link>
        </div>
        
        <div className="w-full mt-12 relative animate-slide-up opacity-0" style={{animationDelay: "0.6s", animationFillMode: "forwards"}}>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 overflow-hidden h-[300px] sm:h-[400px] shadow-2xl dark:shadow-[0_10px_20px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400 flex items-center justify-center h-full">
              <Image 
                src="/editor-preview.jpg" 
                alt="Editor Preview" 
                width={800} 
                height={500} 
                className="rounded-lg shadow-md"
                style={{objectFit: "contain"}}
              />
            </div>
          </div>
          
          <div className="absolute -z-10 inset-0 blur-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-70"></div>
        </div>
        
        <section id="features" className="w-full mt-16 animate-slide-up opacity-0" style={{animationDelay: "0.8s", animationFillMode: "forwards"}}>
          <h3 className="text-2xl font-bold mb-12 gradient-text inline-block">Key Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="#6366F1" strokeWidth="2"/>
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">AI-Powered Design</h4>
              <p className="text-gray-600 dark:text-gray-300">Generate layouts, suggest improvements, and automate repetitive tasks with cutting-edge AI technology</p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Web3 Integration</h4>
              <p className="text-gray-600 dark:text-gray-300">Export designs as NFTs and store version history securely on the blockchain with true ownership</p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-xl mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="font-bold text-lg mb-2">Real-time Collaboration</h4>
              <p className="text-gray-600 dark:text-gray-300">Work together with your team seamlessly in real-time with decentralized access control and tracking</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="row-start-3 w-full max-w-7xl flex justify-between items-center text-sm text-gray-500">
        <div>© 2023 You<span className="gradient-text">i</span>UX</div>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-gray-800 dark:hover:text-white transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-gray-800 dark:hover:text-white transition-colors">Terms</a>
          <a href="/contact" className="hover:text-gray-800 dark:hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
