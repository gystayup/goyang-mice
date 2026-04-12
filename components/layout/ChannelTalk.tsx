"use client";

import { useEffect } from "react";

const PLUGIN_KEY = "d8b5659b-f9b8-468b-8a8e-c166bab220f3";

declare global {
  interface Window {
    ChannelIO?: (...args: unknown[]) => void;
    ChannelIOInitialized?: boolean;
  }
}

export default function ChannelTalk() {
  useEffect(() => {
    // 중복 로드 방지
    if (window.ChannelIO) return;

    const ch = (...args: unknown[]) => { (ch as any).q.push(args); };
    (ch as any).q = [];
    window.ChannelIO = ch as (...args: unknown[]) => void;

    const load = () => {
      if (window.ChannelIOInitialized) return;
      window.ChannelIOInitialized = true;
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
      document.head.appendChild(s);
    };

    if (document.readyState === "complete") {
      load();
    } else {
      window.addEventListener("DOMContentLoaded", load);
      window.addEventListener("load", load);
    }

    window.ChannelIO("boot", {
      pluginKey: PLUGIN_KEY,
      hideChannelButtonOnBoot: true, // 기본 버튼 숨김 (커스텀 버튼 사용)
    });

    return () => {
      window.ChannelIO?.("shutdown");
    };
  }, []);

  return null;
}

// 채널톡 열기 함수 (외부에서 호출 가능)
export function openChannelTalk() {
  window.ChannelIO?.("showMessenger");
}
