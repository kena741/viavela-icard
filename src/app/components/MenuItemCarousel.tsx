import React from "react";
import Image from "next/image";

export interface MenuItemCarouselProps {
    images: string[];
    alt: string;
}

const MenuItemCarousel: React.FC<MenuItemCarouselProps> = ({ images, alt }) => {
    // For now, just show the first image. You can replace this with a real carousel if you want.
    return (
        <div className="relative aspect-square min-h-48 sm:min-h-56 md:min-h-64 overflow-hidden group bg-gray-100">
            <Image
                src={images[0] || "/img/placeholder.jpg"}
                alt={alt}
                fill
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, 33vw"
            />
        </div>
    );
};

export default MenuItemCarousel;
