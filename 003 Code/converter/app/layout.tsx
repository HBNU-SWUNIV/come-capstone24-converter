import "../styles/global.css";
import { Metadata } from "next";
import Navigation from "../components/navigation";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Next Movies",
    default: "Loading...",
  },
  description: 'The best movies on the best framework',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <Navigation />
      {children}
      </body>
    </html>
  )
}
