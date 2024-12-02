"use client";
import { allPortfolioImages } from "@/app/lib/best-ofs";
import {
  CameraIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../shared/button";

export default function InstagramView({}: {}) {
  const getRandomImageIndex = () => {
    return Math.floor(Math.random() * allPortfolioImages.length);
  };
  const [selectedImageIndex, setSelectedImageIndex] =
    useState(getRandomImageIndex);
  const text = `Bemont Photo is your wedding photography dream team! We still have a few 2025 dates available, so check out our all new site (link in bio) to get in touch!
  
#rochesterwedding #rochesterweddings #rochesterphotographer #rochesternyphotographer #rochesterweddingphotographer #rochesterweddingphotography #buffalowedding #buffaloweddings #buffaloweddingphotographer #buffaloweddingphotography #fingerlakesweddingphotographer #fingerlakeswedding #fingerlakesweddings`;
  return (
    <div className="w-full flow-root overflow-x-auto">
      <div className="inline-block min-w-full align-middle overflow-hidden rounded-md bg-accent2/30 m-1 p-2">
        <h1 className={`mb-2 text-xl md:text-2xl`}>Instagram Helper</h1>
        <div
          className="cursor-pointer mb-2"
          onClick={() => navigator.clipboard.writeText(text)}
        >
          <Button>Copy Text</Button>
          <p className="text-sm whitespace-pre text-wrap overflow-y-auto rounded-lg border border-black bg-white/50 p-2 mt-1">
            {text}
          </p>
        </div>
        <div>
          <Button onClick={() => setSelectedImageIndex(getRandomImageIndex)}>
            Pick another image
          </Button>
          <div className="rounded-lg border border-black bg-white/50 p-2 mt-1">
            <Image
              unoptimized
              src={allPortfolioImages[selectedImageIndex].image}
              alt="proposed image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
