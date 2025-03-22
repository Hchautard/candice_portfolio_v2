"use client";

import flora1 from "../assets/images/flora_1.png";
import flora2 from "../assets/images/flora_2.png";
import mira1 from "../assets/images/mira_1.png";

import React from "react";
import { ThreeDCardDemo } from "./ThreeDCard";

export function CardGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* First row - 3 equal cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ThreeDCardDemo 
          title="Natural Beauty" 
          description="Discover our collection of organic makeup products" 
          imageUrl={flora1}
        />
        <ThreeDCardDemo 
          title="Bold Colors" 
          description="Express yourself with vibrant, long-lasting pigments" 
          imageUrl="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2560&auto=format&fit=crop" 
        />
        <ThreeDCardDemo 
          title="Skin First" 
          description="Makeup that nourishes your skin while enhancing your beauty" 
          imageUrl="https://images.unsplash.com/photo-1619451334792-150fd785ee74?q=80&w=2560&auto=format&fit=crop" 
        />
      </div>
      
      {/* Second row - 1 card spanning 2 columns, 1 card in the last column */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <ThreeDCardDemo 
            width="full" 
            title="Limited Edition Collection" 
            description="Explore our exclusive seasonal palette with unique textures and finishes" 
            imageUrl={mira1}
          />
        </div>
        <div className="col-span-1">
          <ThreeDCardDemo 
            title="Eco-Friendly" 
            description="Sustainable beauty products in recyclable packaging" 
            imageUrl="https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=2560&auto=format&fit=crop" 
          />
        </div>
      </div>
      
      {/* Third row - 3 equal cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ThreeDCardDemo 
          title="For Every Skin Tone" 
          description="Inclusive shade ranges for all complexions" 
          imageUrl="https://images.unsplash.com/photo-1576426863848-c21f53c60b19?q=80&w=2560&auto=format&fit=crop" 
        />
        <ThreeDCardDemo 
          title="Pro Tools" 
          description="Professional-grade brushes and applicators" 
          imageUrl="https://images.unsplash.com/photo-1596224584716-5e16d933c1ac?q=80&w=2560&auto=format&fit=crop" 
        />
        <ThreeDCardDemo 
          title="Clean Beauty" 
          description="Free from harmful ingredients, gentle on sensitive skin" 
          imageUrl="https://images.unsplash.com/photo-1571781565036-d3f759be73e4?q=80&w=2560&auto=format&fit=crop" 
        />
      </div> 

      {/* Fourth row - 1 card in the first column, 1 card spanning 2 columns */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <ThreeDCardDemo  
            title="New Arrivals" 
            description="Just launched products to elevate your makeup routine" 
            imageUrl="https://images.unsplash.com/photo-1631730359585-43c8f93a51ed?q=80&w=2560&auto=format&fit=crop" 
          />
        </div>
        <div className="col-span-2">
          <ThreeDCardDemo 
            width="full" 
            title="Makeup Masterclass" 
            description="Learn techniques from our expert makeup artists" 
            imageUrl="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2560&auto=format&fit=crop" 
          />
        </div>
      </div>

      {/* Fifth row - 3 equal cards */}
      <div className="grid grid-cols-3 gap-4">
        <ThreeDCardDemo 
          title="Vegan Formulas" 
          description="Cruelty-free beauty products with plant-based ingredients" 
          imageUrl="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2560&auto=format&fit=crop" 
        />
        <ThreeDCardDemo 
          title="Bestsellers" 
          description="Our most loved products that customers can't get enough of" 
          imageUrl="https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2560&auto=format&fit=crop" 
        />
        <ThreeDCardDemo 
          title="Gift Sets" 
          description="Perfect combinations for gifting or trying something new" 
          imageUrl="https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=2560&auto=format&fit=crop" 
        />
      </div> 
    </div>
  );
}