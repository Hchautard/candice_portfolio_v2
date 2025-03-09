"use client";

import React from "react";
import { ThreeDCardDemo } from "./ThreeDCard";

export function CardGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* First row - 3 equal cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ThreeDCardDemo />
        <ThreeDCardDemo />
        <ThreeDCardDemo />
      </div>
      
      {/* Second row - 1 card spanning 2 columns, 1 card in the last column */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <ThreeDCardDemo width="full" />
        </div>
        <div className="col-span-1">
          <ThreeDCardDemo />
        </div>
      </div>
      
      {/* Third row - 3 equal cards */}
      <div className="grid grid-cols-3 gap-4">
        <ThreeDCardDemo />
        <ThreeDCardDemo />
        <ThreeDCardDemo />
      </div>
    </div>
  );
}