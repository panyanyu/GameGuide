'use client';

import { useEffect } from 'react';
import { ADSENSE_CONFIG } from '../../config/adsense';

export default function AdSenseLoader() {
  useEffect(() => {
    // Only load script once
    if (document.querySelector('script[src*="adsbygoogle"]')) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.clientId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, []);

  return null;
}
