import { useEffect, useRef } from 'react';

export default function FlyingButton({ children, targetTop, targetLeft }) {
  const elementRef = useRef(null);

  useEffect(() => {
    // Make sure the elementRef is not null
    if (!elementRef.current) return;

    const element = elementRef.current;

    // Check if targetTop and targetLeft are defined and valid
    if (targetTop === undefined || targetLeft === undefined) {
      console.error('targetTop and targetLeft must be defined');
      return;
    }

    // Get the bounding rectangle of the element
    const rect = element.getBoundingClientRect();
    
    // Calculate the distance to move the element
    const flyToTop = targetTop - rect.top;
    const flyToLeft = targetLeft - rect.left;

    // Apply the styles after calculating the translation
    element.style.transform = `translate(${flyToLeft}px, ${flyToTop}px)`;
    element.style.opacity = '0';  // You can set this to '1' to make it visible after the animation
    element.style.transition = 'all 1s'; // Smooth transition
  }, [targetTop, targetLeft]); // Re-run the effect when these values change

  return (
    <div ref={elementRef} className="fixed">
      {children}
    </div>
  );
}
