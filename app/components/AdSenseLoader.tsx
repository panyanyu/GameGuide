'use client';

import { useEffect } from 'react';
import { ADSENSE_CONFIG } from '../../config/adsense';

export default function AdSenseLoader() {
  useEffect(() => {
    // 创建 script 标签
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.clientId}`;
    script.crossOrigin = 'anonymous';
    
    // 添加到 head
    document.head.appendChild(script);

    return () => {
      // 清理时移除脚本
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
}
