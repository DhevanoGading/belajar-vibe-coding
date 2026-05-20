"use client";

import { redirect } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect("/login");
  }

  redirect("/home");
}