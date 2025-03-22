import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[70px_1fr_70px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-7xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="YouiUX Logo"
            width={40}
            height={40}
            className="dark:invert"
          />
          <h1 className="text-2xl font-bold">YouiUX</h1>
        </div>
        <nav className="hidden sm:flex gap-4">
          <a href="#features" className="hover:text-blue-500">Features</a>
          <a href="#pricing" className="hover:text-blue-500">Pricing</a>
          <a href="#about" className="hover:text-blue-500">About</a>
        </nav>
      </header>
      
      <main className="flex flex-col gap-[32px] row-start-2 items-center text-center max-w-4xl">
        <h2 className="text-4xl sm:text-6xl font-bold">
          Design. Collaborate. <span className="text-blue-500">Own Your Work.</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
          YouiUX is a next-generation design tool built for the web3 era, powered by AI to enhance your workflow.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-6">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 font-medium text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 sm:w-auto"
            href="/editor"
          >
            Launch Editor
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 w-full sm:w-auto"
            href="/examples"
          >
            View Examples
          </Link>
        </div>
        
        <div className="w-full mt-12 relative">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-hidden h-[300px] sm:h-[400px]">
            <div className="text-center text-gray-500 dark:text-gray-400 flex items-center justify-center h-full">
              Editor Preview Image
            </div>
          </div>
        </div>
        
        <section id="features" className="w-full mt-16">
          <h3 className="text-2xl font-bold mb-8">Key Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-bold mb-2">AI-Powered Design</h4>
              <p className="text-gray-600 dark:text-gray-300">Generate layouts, suggest improvements, and automate repetitive tasks</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-bold mb-2">Web3 Integration</h4>
              <p className="text-gray-600 dark:text-gray-300">Export designs as NFTs and store version history on the blockchain</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h4 className="font-bold mb-2">Real-time Collaboration</h4>
              <p className="text-gray-600 dark:text-gray-300">Work together with your team in real-time with decentralized access control</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="row-start-3 w-full max-w-7xl flex justify-between items-center text-sm text-gray-500">
        <div>© 2023 YouiUX</div>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-gray-800 dark:hover:text-white">Privacy</a>
          <a href="/terms" className="hover:text-gray-800 dark:hover:text-white">Terms</a>
          <a href="/contact" className="hover:text-gray-800 dark:hover:text-white">Contact</a>
        </div>
      </footer>
    </div>
  );
}
