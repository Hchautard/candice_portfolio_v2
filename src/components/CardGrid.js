"use client";

import flora1 from "../assets/images/makeup/flora_1.png";
import flora2 from "../assets/images/makeup/flora_2.png";
import mira1 from "../assets/images/makeup/mira_1.png";
import karole1 from "../assets/images/makeup/karole_1.png";
import karole2 from "../assets/images/makeup/karole_2.png";
import alice1 from "../assets/images/makeup/alice_1.png";
import song1 from "../assets/images/makeup/song_1.png";
import candice1 from "../assets/images/makeup/candice_1.jpg";
import karole3 from "../assets/images/makeup/karole_3.png";
import perles1 from "../assets/images/makeup/perles_1.png";
import carte1 from "../assets/images/makeup/carte_1.png";
import ziggy1 from "../assets/images/makeup/ziggy_1.png";
import hematome1 from "../assets/images/makeup/hematome_1.png";

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
          imageUrl={alice1}
        />
        <ThreeDCardDemo 
          title="Skin First" 
          description="Makeup that nourishes your skin while enhancing your beauty" 
          imageUrl={karole1} 
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
            imageUrl={karole2} 
          />
        </div>
      </div>
      
      {/* Third row - 3 equal cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <ThreeDCardDemo 
          title="For Every Skin Tone" 
          description="Inclusive shade ranges for all complexions" 
          imageUrl={song1}
        />
        <ThreeDCardDemo 
          title="Pro Tools" 
          description="Professional-grade brushes and applicators" 
          imageUrl={flora2}
        />
        <ThreeDCardDemo 
          title="Clean Beauty" 
          description="Free from harmful ingredients, gentle on sensitive skin" 
          imageUrl={perles1}
        />
      </div> 

      {/* Fourth row - 1 card in the first column, 1 card spanning 2 columns */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <ThreeDCardDemo  
            title="New Arrivals" 
            description="Just launched products to elevate your makeup routine" 
            imageUrl={karole3}
          />
        </div>
        <div className="col-span-2">
          <ThreeDCardDemo 
            width="full" 
            title="Makeup Masterclass" 
            description="Learn techniques from our expert makeup artists" 
            imageUrl={candice1}
          />
        </div>
      </div>

      {/* Fifth row - 3 equal cards */}
      <div className="grid grid-cols-3 gap-4">
        <ThreeDCardDemo 
          title="Vegan Formulas" 
          description="Cruelty-free beauty products with plant-based ingredients" 
          imageUrl={carte1}
        />
        <ThreeDCardDemo 
          title="Bestsellers" 
          description="Our most loved products that customers can't get enough of" 
          imageUrl={ziggy1}
        />
        <ThreeDCardDemo 
          title="Gift Sets" 
          description="Perfect combinations for gifting or trying something new" 
          imageUrl={hematome1}
        />
      </div> 
    </div>
  );
}