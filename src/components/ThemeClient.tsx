"use client";

import { useEffect } from "react";

export default function ThemeClient() {
  useEffect(() => {
    const saved = localStorage.getItem("garage_theme");
    const isDark = saved === "dark";
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
  }, []);
  return null;
}
