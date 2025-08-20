'use client';

import { useEffect, useState } from 'react';

import type { ImgHTMLAttributes } from 'react';

import { domAnimation, LazyMotion, m, useAnimation } from 'framer-motion';

const animationVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const FadeInImage = (properties: ImgHTMLAttributes<HTMLImageElement>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const animationControls = useAnimation();

  useEffect(() => {
    if (isLoaded) {
      animationControls.start('visible');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        animate={animationControls}
        initial='hidden'
        transition={{ duration: 0.3, ease: 'easeOut' }}
        variants={animationVariants}
        style={{ willChange: isLoaded ? 'auto' : 'opacity' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...properties}
          onLoad={() => {
            setIsLoaded(true);
          }}
          alt=''
          loading="lazy"
          decoding="async"
          style={{
            ...properties.style,
            transform: 'translateZ(0)', // Enable hardware acceleration
            backfaceVisibility: 'hidden'
          }}
        />
      </m.div>
    </LazyMotion>
  );
};

export default FadeInImage;
