import "../styles/global.css";
import Navigation from "../components/navigation";
import React from "react";


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title> Converter Web site </title>
      </head>
      <body>
        <header>
          <Navigation />
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}