import { useEffect } from 'react';

/**
 * TawkToChat Component
 * React component that implements the Tawk.to live chat widget integration
 */
const TawkToChat = () => {
  useEffect(() => {
    // Make sure any existing instances are removed first
    const existingScript = document.querySelector('script[src*="tawk.to"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Reset Tawk variables in case they were previously initialized
    window.Tawk_API = {};
    window.Tawk_LoadStart = new Date();

    // Create and insert the script
    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    
    s1.async = true;
    s1.src = 'https://embed.tawk.to/67fded8b103aa0190d9e877a/1iorufr69'; // Your existing property ID
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
      console.log('Tawk.to script added to DOM');
    } else {
      document.head.appendChild(s1);
      console.log('Tawk.to script added to head (fallback)');
    }

    // Set up event handlers
    window.Tawk_API = {
      onLoad: function() {
        console.log('Tawk.to chat widget loaded successfully');
      },
      onStatusChange: function(status) {
        console.log('Tawk.to status changed to:', status);
      }
    };

    return () => {
      // Clean up function
      const tawkScript = document.querySelector('script[src*="tawk.to"]');
      if (tawkScript) {
        tawkScript.remove();
        console.log('Tawk.to script removed from DOM');
      }
    };
  }, []);

  return null; // Component doesn't render anything visible
};

export default TawkToChat;
