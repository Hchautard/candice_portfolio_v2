"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "./Card";
import '../styles/ThreeDCard.css';

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function ThreeDCardDemo({ 
  height = 70, 
  width = 'auto', 
  title = "Make things float in air", 
  description = "Hover over this card to unleash the power of CSS perspective",
  imageUrl = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
}) {
  return (
    <CardContainer className={cn('h-64', width === 'full' ? 'w-full' : 'w-lg') + ' card-container'}>
      <CardBody
        className={cn(
          "bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]",
          "dark:bg-black dark:border-white/[0.2] border-black/[0.1]",
          "h-auto rounded-xl border",
          width === 'full' ? 'w-full' : 'w-auto sm:w-[30rem]'
        )}
      >
        <CardItem translateY="20" translateZ="101"
          className="title absolute">
          {title}
        </CardItem>

        {/* <CardItem
          as="p"
          translateY="80" translateZ="101"
          className="content absolute">
          {description}
        </CardItem> */}

        <CardItem translateZ="100" className="w-full">
          <img
            src={imageUrl}
            height="1000"
            width="1000"
            className="w-full h-60 object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail" />
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}