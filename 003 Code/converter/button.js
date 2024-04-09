// Button.js
'use client'
import React from 'react';
import { Upload } from './actions';
export function Button() {
  const handleClick = () => {
    console.log("Upload!");
    Upload();
  };
  return (
    <button onClick={handleClick}>
      Upload
    </button>
  );
}
