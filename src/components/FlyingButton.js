import { useEffect, useRef } from 'react';

export default function FlyingButton({children, targetTop, targetLeft}) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      const flyToTop = targetTop - rect.top;
      const flyToLeft = targetLeft - rect.left;

      element.style.transform = `translate(${flyToLeft}px, ${flyToTop}px)`;
      element.style.opacity = '0';
      element.style.transition = 'all 1s';
    }
  }, [targetTop, targetLeft]);

  return (
    <div ref={elementRef} className="fixed">
      {children}
    </div>
  );
}
