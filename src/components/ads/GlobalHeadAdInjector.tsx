'use client';

import React, { useEffect } from 'react';

export function GlobalHeadAdInjector() {
  useEffect(() => {
    let isMounted = true;

    async function loadHeadTags() {
      try {
        const res = await fetch('/api/v1/ads/head-tags');
        if (!res.ok) return;
        const json = await res.json();
        if (!isMounted || !Array.isArray(json.data)) return;

        const head = document.head;

        json.data.forEach((item: { id: string; snippet: string }) => {
          if (!item.snippet) return;
          const elementId = `earnspace-head-ad-${item.id}`;
          if (document.getElementById(elementId)) return; // Avoid duplicate injection

          const wrapper = document.createElement('div');
          wrapper.id = elementId;

          const parser = new DOMParser();
          const doc = parser.parseFromString(item.snippet, 'text/html');

          // Append meta tags
          doc.querySelectorAll('meta').forEach((meta) => {
            const newMeta = document.createElement('meta');
            Array.from(meta.attributes).forEach((attr) => {
              newMeta.setAttribute(attr.name, attr.value);
            });
            head.appendChild(newMeta);
          });

          // Append scripts
          doc.querySelectorAll('script').forEach((oldScript) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach((attr) => {
              newScript.setAttribute(attr.name, attr.value);
            });
            if (oldScript.textContent) {
              newScript.textContent = oldScript.textContent;
            }
            head.appendChild(newScript);
          });
        });
      } catch (err) {
        console.error('GlobalHeadAdInjector error:', err);
      }
    }

    loadHeadTags();
    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}

