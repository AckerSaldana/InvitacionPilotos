import { useState, useCallback } from 'react';
import { EVENT_DATA } from '../utils/eventData';

export const useShare = () => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: EVENT_DATA.event.fullTitle,
    text: `Te invitamos a la ${EVENT_DATA.event.title} del ${EVENT_DATA.organization.shortName}. ${EVENT_DATA.dateTime.displayDate} a las ${EVENT_DATA.dateTime.displayTime}`,
    url: typeof window !== 'undefined' ? window.location.href : ''
  };

  const canNativeShare = typeof navigator !== 'undefined' && navigator.share !== undefined;

  const nativeShare = useCallback(async () => {
    if (canNativeShare) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
        return false;
      }
    }
    return false;
  }, [canNativeShare, shareData]);

  const shareWhatsApp = useCallback(() => {
    const text = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }, [shareData]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareData.url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    }
  }, [shareData.url]);

  return {
    nativeShare,
    shareWhatsApp,
    copyLink,
    copied,
    canNativeShare
  };
};
