"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
      // In a real implementation, make a call to an AI API (like OpenAI)
      console.log("Generating design with AI prompt:", aiPrompt);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate some mock elements based on the prompt
      const promptLower = aiPrompt.toLowerCase();
      const aiElements = [];
      
      // Add a container element
      aiElements.push({
        id: `ai-container-${Date.now()}`,
        type: 'rectangle',
        x: 50,
        y: 50,
        width: 500,
        height: 300,
        style: { 
          backgroundColor: promptLower.includes('dark') ? '#1a1a1a' : '#f8f9fa',
          borderRadius: promptLower.includes('round') ? '12px' : '4px',
        }
      });
      
      // Add a title based on the prompt
      aiElements.push({
        id: `ai-title-${Date.now()}`,
        type: 'text',
        x: 80,
        y: 80,
        width: 440,
        height: 50,
        text: promptLower.includes('title') ? aiPrompt.replace('title', '').trim() : 'AI Generated Design',
        style: { 
          fontSize: '24px', 
          fontWeight: 'bold',
          color: promptLower.includes('dark') ? '#ffffff' : '#000000'
        }
      });
      
      // Add additional elements based on keywords
      if (promptLower.includes('button')) {
        aiElements.push({
          id: `ai-button-${Date.now()}`,
          type: 'rectangle',
          x: 80,
          y: 250,
          width: 120,
          height: 40,
          style: { 
            backgroundColor: '#3b82f6',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 'bold'
          },
          text: 'Click Me'
        });
      }
      
      if (promptLower.includes('image') || promptLower.includes('picture')) {
        aiElements.push({
          id: `ai-image-${Date.now()}`,
          type: 'image',
          x: 80,
          y: 140,
          width: 200,
          height: 100,
          style: { 
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '12px'
          },
          text: 'Image Placeholder'
        });
      }
      
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
    <div className="flex flex-col h-screen">
      {/* Top navigation */}
      <header className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="YouiUX Logo"
              width={24}
              height={24}
              className="dark:invert"
            />
            <span className="font-bold">YouiUX</span>
          </Link>
          <span className="text-gray-400">|</span>
          <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">File</button>
          <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">Edit</button>
          <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">View</button>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={generateWithAI}
            className="text-sm px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 rounded flex items-center gap-1"
          >
            <span>AI Generate</span>
          </button>
          
          <button 
            onClick={connectWallet}
            className={`text-sm px-3 py-1.5 rounded flex items-center gap-1 ${
              walletConnected 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            <span>{walletConnected ? 'Connected' : 'Connect Wallet'}</span>
          </button>
          
          <button className="text-sm px-3 py-1.5 bg-black text-white dark:bg-white dark:text-black rounded">
            Share
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Tools */}
        <div className="w-14 border-r flex flex-col items-center py-3 gap-3">
          <button 
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded ${activeTool === 'select' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l7 7m0 0v-6m0 6h-6" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              setActiveTool('rectangle');
              addElement('rectangle');
            }}
            className={`p-2 rounded ${activeTool === 'rectangle' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
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
            className={`p-2 rounded ${activeTool === 'ellipse' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
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
            className={`p-2 rounded ${activeTool === 'text' ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="border-t w-8 my-2"></div>
          
          <button className="p-2 rounded" title="Export as NFT">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </button>
        </div>
        
        {/* Main canvas area */}
        <div 
          className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto flex items-center justify-center"
          onClick={handleCanvasClick}
        >
          <div 
            ref={canvasRef}
            className="bg-white dark:bg-gray-800 shadow-lg"
            style={{ width: '1200px', height: '800px', position: 'relative' }}
          >
            {elements.map(element => (
              <div
                key={element.id}
                style={{
                  position: 'absolute',
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  backgroundColor: element.style.backgroundColor,
                  borderRadius: element.style.borderRadius,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: activeTool === 'select' ? 'move' : 'default',
                  border: '1px solid',
                  borderColor: selectedElementId === element.id ? '#3b82f6' : 'transparent',
                  fontSize: element.style.fontSize,
                  color: element.style.color,
                  fontWeight: element.style.fontWeight,
                  boxShadow: selectedElementId === element.id ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
                  userSelect: 'none'
                }}
                onClick={(e) => handleElementSelect(element.id, e)}
              >
                {element.type === 'text' && element.text}
                {element.type === 'image' && element.text}
                {element.type === 'rectangle' && element.text && element.text}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right sidebar - Properties */}
        <div className="w-64 border-l p-4 overflow-y-auto">
          <h3 className="font-bold mb-3">Properties</h3>
          
          {selectedElement && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Position</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs">X</label>
                    <input 
                      type="number" 
                      className="w-full border rounded px-2 py-1 text-sm" 
                      value={selectedElement.x}
                      onChange={(e) => updateElementProperty('x', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-xs">Y</label>
                    <input 
                      type="number" 
                      className="w-full border rounded px-2 py-1 text-sm" 
                      value={selectedElement.y}
                      onChange={(e) => updateElementProperty('y', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Size</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs">Width</label>
                    <input 
                      type="number" 
                      className="w-full border rounded px-2 py-1 text-sm" 
                      value={selectedElement.width}
                      onChange={(e) => updateElementProperty('width', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-xs">Height</label>
                    <input 
                      type="number" 
                      className="w-full border rounded px-2 py-1 text-sm" 
                      value={selectedElement.height}
                      onChange={(e) => updateElementProperty('height', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              
              {selectedElement.type !== 'text' && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Style</label>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs">Background</label>
                      <input 
                        type="color" 
                        className="w-full border rounded h-8" 
                        value={selectedElement.style.backgroundColor || '#e0e0e0'}
                        onChange={(e) => updateElementProperty('style.backgroundColor', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs">Border Radius</label>
                      <input 
                        type="range" 
                        className="w-full" 
                        min="0" 
                        max="50" 
                        value={parseInt(selectedElement.style.borderRadius) || 0}
                        onChange={(e) => updateElementProperty('style.borderRadius', `${e.target.value}px`)}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {selectedElement.type === 'text' && (
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Text</label>
                  <div className="space-y-2">
                    <div>
                      <textarea 
                        className="w-full border rounded px-2 py-1 text-sm" 
                        rows={2}
                        value={selectedElement.text}
                        onChange={(e) => updateElementProperty('text', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs">Font Size</label>
                      <input 
                        type="range" 
                        className="w-full" 
                        min="8" 
                        max="72" 
                        value={parseInt(selectedElement.style.fontSize) || 18}
                        onChange={(e) => updateElementProperty('style.fontSize', `${e.target.value}px`)}
                      />
                    </div>
                    <div>
                      <label className="text-xs">Color</label>
                      <input 
                        type="color" 
                        className="w-full border rounded h-8" 
                        value={selectedElement.style.color || '#000000'}
                        onChange={(e) => updateElementProperty('style.color', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-2 border-t">
                <button 
                  className="w-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 py-1 rounded text-sm"
                  onClick={deleteSelectedElement}
                >
                  Delete Element
                </button>
              </div>
            </div>
          )}
          
          {!selectedElement && activeTool === 'select' && (
            <div className="text-sm text-gray-500">
              Select an element to edit its properties
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-bold mb-3">Web3 Storage</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Connected:</span>
                <span className={`font-mono ${walletConnected ? 'text-green-500' : 'text-red-500'}`}>
                  {walletConnected ? 'Yes' : 'No'}
                </span>
              </div>
              <button 
                className="w-full mt-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 py-1.5 rounded text-sm"
                onClick={saveToIPFS}
              >
                Save to IPFS
              </button>
              <button 
                className="w-full mt-2 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200 py-1.5 rounded text-sm"
                onClick={() => alert("This would mint your design as an NFT")}
              >
                Mint as NFT
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-bold mb-3">AI Assistant</h3>
            <div className="text-sm">
              <textarea 
                className="w-full border rounded p-2 mb-2 text-sm" 
                rows={3} 
                placeholder="Describe a design to generate (e.g., 'Create a dark landing page with a title and button')"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              ></textarea>
              <button 
                className={`w-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 py-1.5 rounded text-sm flex items-center justify-center ${isGeneratingAI ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={generateWithAI}
                disabled={isGeneratingAI}
              >
                {isGeneratingAI ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600 dark:text-purple-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : 'Generate with AI'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
