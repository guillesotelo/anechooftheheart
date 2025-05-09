import React, { useRef, useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode
}
export default function FadeInSection({ children }: Props) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      });
    });

    observer.observe(domRef.current as HTMLDivElement);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fade-in ${isVisible ? 'visible' : ''}`}
      ref={domRef}
    >
      {children}
    </div>
  );
};