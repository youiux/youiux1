// AI generation utilities

export interface AIGenerationParams {
  prompt: string;
  style?: string;
  colorScheme?: string;
  elements?: string[];
}

export const generateDesignWithAI = async (params: AIGenerationParams) => {
  // In a real implementation, you would call an AI API like OpenAI
  try {
    console.log('Generating design with AI:', params);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock elements based on the prompt
    const prompt = params.prompt.toLowerCase();
    const elements = [];
    
    // Add a container element
    elements.push({
      id: `ai-container-${Date.now()}`,
      type: 'rectangle',
      x: 50,
      y: 50,
      width: 500,
      height: 300,
      style: { 
        backgroundColor: prompt.includes('dark') ? '#1a1a1a' : '#f8f9fa',
        borderRadius: prompt.includes('round') ? '12px' : '4px',
      }
    });
    
    // Add a title based on the prompt
    elements.push({
      id: `ai-title-${Date.now()}`,
      type: 'text',
      x: 80,
      y: 80,
      width: 440,
      height: 50,
      text: prompt.includes('title') 
        ? params.prompt.replace(/title|with|create|generate|design/gi, '').trim() 
        : 'AI Generated Design',
      style: { 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: prompt.includes('dark') ? '#ffffff' : '#000000'
      }
    });
    
    // Add additional elements based on keywords
    if (prompt.includes('button')) {
      elements.push({
        id: `ai-button-${Date.now()}`,
        type: 'rectangle',
        x: 80,
        y: 250,
        width: 120,
        height: 40,
        style: { 
          backgroundColor: params.colorScheme?.includes('blue') ? '#3b82f6' : 
                          params.colorScheme?.includes('green') ? '#10b981' : 
                          params.colorScheme?.includes('red') ? '#ef4444' : '#3b82f6',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 'bold'
        },
        text: prompt.includes('signup') ? 'Sign Up' : 
              prompt.includes('register') ? 'Register' : 
              prompt.includes('subscribe') ? 'Subscribe' : 'Click Me'
      });
    }
    
    if (prompt.includes('image') || prompt.includes('picture') || prompt.includes('photo')) {
      elements.push({
        id: `ai-image-${Date.now()}`,
        type: 'image',
        x: 80,
        y: 140,
        width: 200,
        height: 100,
        style: { 
          backgroundColor: prompt.includes('dark') ? '#333333' : '#f0f0f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: prompt.includes('dark') ? '#aaaaaa' : '#888888',
          fontSize: '12px',
          boxShadow: prompt.includes('shadow') ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
          border: '1px solid',
          borderColor: prompt.includes('dark') ? '#444444' : '#e5e7eb',
        },
        text: 'Image Placeholder'
      });
    }
    
    if (prompt.includes('form')) {
      elements.push({
        id: `ai-form-${Date.now()}`,
        type: 'rectangle',
        x: 80,
        y: 150,
        width: 300,
        height: 180,
        style: { 
          backgroundColor: prompt.includes('dark') ? '#2a2a2a' : '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid',
          borderColor: prompt.includes('dark') ? '#444444' : '#e5e7eb',
          boxShadow: prompt.includes('shadow') ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
        },
        children: [
          {
            id: `ai-form-title-${Date.now()}`,
            type: 'text',
            text: 'Contact Form',
            style: {
              fontSize: '18px',
              fontWeight: 'bold',
              color: prompt.includes('dark') ? '#ffffff' : '#000000',
            }
          }
        ]
      });

      // Add form input field
      elements.push({
        id: `ai-form-input-${Date.now()}`,
        type: 'rectangle',
        x: 95,
        y: 190,
        width: 270,
        height: 40,
        style: { 
          backgroundColor: prompt.includes('dark') ? '#333333' : '#f8f8f8',
          borderRadius: '6px',
          border: '1px solid',
          borderColor: prompt.includes('dark') ? '#555555' : '#e0e0e0',
          padding: '8px 12px',
          fontSize: '14px',
        },
        text: 'Email'
      });

      // Add form button
      elements.push({
        id: `ai-form-button-${Date.now()}`,
        type: 'rectangle',
        x: 95,
        y: 245,
        width: 120,
        height: 40,
        style: { 
          backgroundColor: colorPalette.accent,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        text: 'Submit'
      });
    }
    
    if (prompt.includes('card') || prompt.includes('cards')) {
      // First card
      elements.push({
        id: `ai-card-1-${Date.now()}`,
        type: 'rectangle',
        x: 80,
        y: 150,
        width: 200,
        height: 160,
        style: { 
          backgroundColor: prompt.includes('dark') ? '#2a2a2a' : '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid',
          borderColor: prompt.includes('dark') ? '#444444' : '#f0f0f0',
        }
      });
      
      // Card title
      elements.push({
        id: `ai-card-title-1-${Date.now()}`,
        type: 'text',
        x: 95,
        y: 165,
        width: 170,
        height: 30,
        text: 'Card Title',
        style: { 
          fontSize: '16px', 
          fontWeight: 'bold',
          color: prompt.includes('dark') ? '#ffffff' : '#333333',
        }
      });
      
      // Card content
      elements.push({
        id: `ai-card-content-1-${Date.now()}`,
        type: 'text',
        x: 95,
        y: 200,
        width: 170,
        height: 60,
        text: 'This is a card with some sample content that you can edit.',
        style: { 
          fontSize: '12px',
          color: prompt.includes('dark') ? '#aaaaaa' : '#666666',
        }
      });
      
      // If multiple cards mentioned, add a second card
      if (prompt.includes('cards')) {
        elements.push({
          id: `ai-card-2-${Date.now()}`,
          type: 'rectangle',
          x: 290,
          y: 150,
          width: 200,
          height: 160,
          style: { 
            backgroundColor: prompt.includes('dark') ? '#2a2a2a' : '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: prompt.includes('dark') ? '#444444' : '#f0f0f0',
          }
        });
        
        // Card 2 title
        elements.push({
          id: `ai-card-title-2-${Date.now()}`,
          type: 'text',
          x: 305,
          y: 165,
          width: 170,
          height: 30,
          text: 'Card Title 2',
          style: { 
            fontSize: '16px', 
            fontWeight: 'bold',
            color: prompt.includes('dark') ? '#ffffff' : '#333333',
          }
        });
        
        // Card 2 content
        elements.push({
          id: `ai-card-content-2-${Date.now()}`,
          type: 'text',
          x: 305,
          y: 200,
          width: 170,
          height: 60,
          text: 'This is another card with some sample content you can customize.',
          style: { 
            fontSize: '12px',
            color: prompt.includes('dark') ? '#aaaaaa' : '#666666',
          }
        });
      }
    }
    
    return elements;
    
  } catch (error) {
    console.error('Error generating with AI:', error);
    throw error;
  }
};

// Helper function to get color palette based on the specified color scheme
const getColorPalette = (colorScheme: string) => {
  // Default palette (blue)
  let palette = {
    accent: '#3b82f6', // blue
    lightBg: '#f8f9fa',
    darkBg: '#1a1a1a',
    success: '#10b981', // green
    warning: '#f59e0b', // amber
    error: '#ef4444', // red
  };
  
  if (colorScheme.includes('green')) {
    palette.accent = '#10b981';
  } else if (colorScheme.includes('purple')) {
    palette.accent = '#8b5cf6'; 
  } else if (colorScheme.includes('pink')) {
    palette.accent = '#ec4899';
  } else if (colorScheme.includes('orange')) {
    palette.accent = '#f97316';
  } else if (colorScheme.includes('red')) {
    palette.accent = '#ef4444';
  } else if (colorScheme.includes('teal')) {
    palette.accent = '#14b8a6';
  } else if (colorScheme.includes('indigo')) {
    palette.accent = '#6366f1';
  }
  
  // Check for gradient
  if (colorScheme.includes('gradient')) {
    palette.accent = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
  }
  
  // Check for dark theme
  if (colorScheme.includes('dark')) {
    palette.lightBg = '#2a2a2a';
    palette.darkBg = '#1a1a1a';
  }
  
  return palette;
};

export const generateImageWithAI = async (prompt: string) => {
  // In a real implementation, you would call an image generation API like DALL-E or Stable Diffusion
  try {
    console.log('Generating image with AI:', prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // In a real implementation, return the URL of the generated image
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/600/400`;
  } catch (error) {
    console.error('Error generating image with AI:', error);
    throw error;
  }
};
