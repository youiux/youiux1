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
                  <div>
                    <label className="text-xs">Background</label>
                    <input type="color" className="w-full border rounded h-8" defaultValue="#e0e0e0" />
                  </div>
                  <div>
                    <label className="text-xs">Border Radius</label>
                    <input type="range" className="w-full" min="0" max="50" defaultValue="0" />
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <button className="w-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 py-1 rounded text-sm">
                  Delete Element
                </button>
              </div>
            </div>
          )}
          
          {activeTool !== 'select' && (
            <div className="text-sm text-gray-500">
              Select an element to edit its properties
            </div>
          )}
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-bold mb-3">Web3 Storage</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Version control:</span>
                <span className="font-mono">3 versions</span>
              </div>
              <div className="flex justify-between">
                <span>IPFS:</span>
                <a href="#" className="text-blue-500 truncate">ipfs://Qm...</a>
              </div>
              <button className="w-full mt-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 py-1.5 rounded text-sm">
                Save to Blockchain
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-bold mb-3">AI Assistant</h3>
            <div className="text-sm">
              <textarea 
                className="w-full border rounded p-2 mb-2 text-sm" 
                rows={3} 
                placeholder="Ask AI to modify your design..."
              ></textarea>
              <button className="w-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200 py-1.5 rounded text-sm">
                Generate with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
