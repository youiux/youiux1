"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { generateDesignWithAI } from "../utils/ai";
import Canvas from "../components/Canvas";

export default function Editor() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<string>("select");
  const [elements, setElements] = useState<any[]>([]);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  // Find the selected element
  const selectedElement = elements.find(el => el.id === selectedElementId);
  
  const connectWallet = async () => {
    // Check if window.ethereum is available
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        setWalletConnected(false);
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Connected wallet:", accounts[0]);
        setWalletConnected(true);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet to use this feature");
    }
  };
  
  const addElement = (type: string) => {
    const newElement = {
      id: `element-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      text: type === 'text' ? 'Double click to edit' : '',
      style: {
        backgroundColor: type === 'text' ? 'transparent' : '#e0e0e0',
        borderRadius: type === 'ellipse' ? '50%' : '0',
        fontSize: '18px',
      }
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElementId(newElement.id);
  };
  
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a prompt for the AI");
      return;
    }
    
    setIsGeneratingAI(true);
    
    try {
      // Call the AI utility function
      const aiElements = await generateDesignWithAI({
        prompt: aiPrompt,
        colorScheme: 'blue'
      });
      
      setElements([...elements, ...aiElements]);
      setAiPrompt("");
    } catch (error) {
      console.error("Error generating with AI:", error);
      alert("Failed to generate design with AI");
    } finally {
      setIsGeneratingAI(false);
    }
  };
  
  const handleElementSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === 'select') {
      setSelectedElementId(id);
      
      // Setup for drag
      const element = elements.find(el => el.id === id);
      if (element) {
        setIsDragging(true);
        setDragStart({ 
          x: e.clientX - element.x, 
          y: e.clientY - element.y 
        });
      }
    }
  };
  
  const handleCanvasClick = () => {
    if (activeTool === 'select') {
      setSelectedElementId(null);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedElementId) {
      const newElements = elements.map(el => {
        if (el.id === selectedElementId) {
          return {
            ...el,
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
          };
        }
        return el;
      });
      setElements(newElements);
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const updateElementProperty = (property: string, value: any) => {
    if (!selectedElementId) return;
    
    const newElements = elements.map(el => {
      if (el.id === selectedElementId) {
        if (property.startsWith('style.')) {
          const styleProp = property.split('.')[1];
          return {
            ...el,
            style: {
              ...el.style,
              [styleProp]: value
            }
          };
        }
        return {
          ...el,
          [property]: value
        };
      }
      return el;
    });
    
    setElements(newElements);
  };
  
  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    setElements(elements.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
  };
  
  const saveToIPFS = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first");
      return;
    }
    
    try {
      // In a real implementation, you would:
      // 1. Serialize the design data
      // 2. Upload to IPFS using a service like Pinata or nft.storage
      // 3. Store the IPFS hash in a smart contract if needed
      
      const designData = JSON.stringify(elements);
      console.log("Saving design to IPFS:", designData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock IPFS hash
      const mockIPFSHash = "QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxM";
      alert(`Design saved to IPFS: ipfs://${mockIPFSHash}`);
    } catch (error) {
      console.error("Error saving to IPFS:", error);
      alert("Failed to save design to IPFS");
    }
  };
  
  useEffect(() => {
    // Add global mouse event listeners for drag operations
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, selectedElementId, dragStart, elements]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Top navigation */}
      <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-white dark:bg-gray-800 shadow-sm animate-fade-in">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <Image
              src="/logo.svg"
              alt="YouiUX Logo"
              width={28}
              height={28}
              className="dark:invert"
            />
            <span className="font-bold text-lg">You<span className="gradient-text">i</span>UX</span>
          </Link>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex gap-1">
            <button className="text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">File</button>
            <button className="text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Edit</button>
            <button className="text-sm px-4 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">View</button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={generateWithAI}
            className="text-sm px-4 py-2 bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200 rounded-lg flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-800/40 transition-colors shadow-sm hover:shadow"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21.17 8C18.9741 0.913907 5.02589 0.913911 2.83003 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.83002 16C5.02589 23.0861 18.9741 23.0861 21.17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>AI Generate</span>
          </button>
          
          <button 
            onClick={connectWallet}
            className={`text-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:shadow transition-all ${
              walletConnected 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800/40' 
                : 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800/40'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 11C16 12.1046 15.1046 13 14 13C12.8954 13 12 12.1046 12 11C12 9.89543 12.8954 9 14 9C15.1046 9 16 9.89543 16 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 16L21 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 16L5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3L8 7H16L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{walletConnected ? 'Connected' : 'Connect Wallet'}</span>
          </button>
          
          <button className="text-sm px-4 py-2 gradient-bg text-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 6L12 2L8 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 2V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Share</span>
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Tools */}
        <div className="w-16 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-5 gap-4 bg-white dark:bg-gray-800 shadow-sm animate-fade-in">
          <button 
            onClick={() => setActiveTool('select')}
            className={`p-3 rounded-xl transition-all ${activeTool === 'select' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 9l4.5 4.5L18 5" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setActiveTool('rectangle');
              addElement('rectangle');
            }}
            className={`p-3 rounded-xl transition-all ${activeTool === 'rectangle' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setActiveTool('ellipse');
              addElement('ellipse');
            }}
            className={`p-3 rounded-xl transition-all ${activeTool === 'ellipse' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setActiveTool('text');
              addElement('text');
            }}
            className={`p-3 rounded-xl transition-all ${activeTool === 'text' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7V4h16v3M9 20h6M12 4v16" />
            </svg>
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 w-8 my-2"></div>
          
          <button className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-purple-600 dark:text-purple-400" title="Export as NFT">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </button>
        </div>
        
        {/* Main canvas area - Using the Canvas component */}
        <Canvas
          elements={elements}
          selectedElementId={selectedElementId}
          activeTool={activeTool}
          onElementSelect={handleElementSelect}
          onCanvasClick={handleCanvasClick}
        />
        
        {/* Right sidebar - Properties */}
        <div className="w-72 border-l border-gray-200 dark:border-gray-800 p-5 overflow-y-auto bg-white dark:bg-gray-800 shadow-sm animate-fade-in">
          <h3 className="font-bold mb-4 text-lg">Properties</h3>
          
          {selectedElement && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">Position</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block">X</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition-all" 
                      value={selectedElement.x}
                      onChange={(e) => updateElementProperty('x', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block">Y</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition-all" 
                      value={selectedElement.y}
                      onChange={(e) => updateElementProperty('y', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">Size</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block">Width</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition-all" 
                      value={selectedElement.width}
                      onChange={(e) => updateElementProperty('width', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block">Height</label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition-all" 
                      value={selectedElement.height}
                      onChange={(e) => updateElementProperty('height', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              
              {selectedElement.type !== 'text' && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">Style</label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs mb-1 block">Background</label>
                      <input 
                        type="color" 
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg h-10 cursor-pointer" 
                        value={selectedElement.style.backgroundColor || '#e0e0e0'}
                        onChange={(e) => updateElementProperty('style.backgroundColor', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block">Border Radius</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" 
                          className="flex-1 accent-blue-500" 
                          min="0" 
                          max="50" 
                          value={parseInt(selectedElement.style.borderRadius) || 0}
                          onChange={(e) => updateElementProperty('style.borderRadius', `${e.target.value}px`)}
                        />
                        <span className="text-xs font-mono">{parseInt(selectedElement.style.borderRadius) || 0}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedElement.type === 'text' && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">Text</label>
                  <div className="space-y-3">
                    <div>
                      <textarea 
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 transition-all" 
                        rows={2}
                        value={selectedElement.text}
                        onChange={(e) => updateElementProperty('text', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block">Font Size</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" 
                          className="flex-1 accent-blue-500" 
                          min="8" 
                          max="72" 
                          value={parseInt(selectedElement.style.fontSize) || 18}
                          onChange={(e) => updateElementProperty('style.fontSize', `${e.target.value}px`)}
                        />
                        <span className="text-xs font-mono">{parseInt(selectedElement.style.fontSize) || 18}px</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs mb-1 block">Color</label>
                      <input 
                        type="color" 
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg h-10 cursor-pointer" 
                        value={selectedElement.style.color || '#000000'}
                        onChange={(e) => updateElementProperty('style.color', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-3">
                <button 
                  className="w-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 py-2 rounded-lg text-sm hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors"
                  onClick={deleteSelectedElement}
                >
                  Delete Element
                </button>
              </div>
            </div>
          )}
          
          {!selectedElement && activeTool === 'select' && (
            <div className="text-sm text-gray-500 dark:text-gray-400 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 italic">
              Select an element to edit its properties
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Web3 Storage
            </h3>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Connected:</span>
                <span className={`font-mono text-sm px-2 py-1 rounded-md ${walletConnected ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300'}`}>
                  {walletConnected ? 'Yes' : 'No'}
                </span>
              </div>
              <button 
                className="w-full mt-2 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 py-2.5 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors flex items-center justify-center gap-2"
                onClick={saveToIPFS}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Save to IPFS
              </button>
              <button 
                className="w-full mt-2 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 py-2.5 rounded-lg text-sm hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors flex items-center justify-center gap-2"
                onClick={() => alert("This would mint your design as an NFT")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5 12.5723C19.5 13.9464 19.0839 15.2883 18.3 16.4397C17.5161 17.591 16.3979 18.499 15.0786 19.0468C13.7592 19.5946 12.2997 19.7563 10.8903 19.5133C9.48095 19.2704 8.18814 18.6329 7.15735 17.682C6.12656 16.7312 5.40222 15.489 5.10668 14.1188C4.81114 12.7485 4.9537 11.3155 5.48197 10.0155C6.01025 8.71556 6.9927 7.61342 8.2086 6.83423C9.42451 6.05504 10.8281 5.63232 12.2639 5.62502" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 8.75L19.5 4.25L21.5 6.25L17 10.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Mint as NFT
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
                <path d="M21.17 8C18.9741 0.913907 5.02589 0.913911 2.83003 8" />
                <path d="M2.83002 16C5.02589 23.0861 18.9741 23.0861 21.17 16" />
              </svg>
              AI Assistant
            </h3>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
              <textarea 
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 transition-all mb-3" 
                rows={3} 
                placeholder="Describe a design to generate (e.g., 'Create a dark landing page with a title and button')"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              ></textarea>
              <button 
                className={`w-full bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 py-2.5 rounded-lg text-sm hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors flex items-center justify-center gap-2 ${isGeneratingAI ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={generateWithAI}
                disabled={isGeneratingAI}
              >
                {isGeneratingAI ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-purple-600 dark:text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21.17 8C18.9741 0.913907 5.02589 0.913911 2.83003 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.83002 16C5.02589 23.0861 18.9741 23.0861 21.17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
