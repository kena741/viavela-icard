import React from "react";
import MenuItemCarousel from "@/app/components/MenuItemCarousel";

export interface MenuItemCardProps {
  id?: string;
  name: string;
  description?: string;
  price: number | string;
  image_url?: string;
  images?: string[]; // for carousel
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ name, description, price, image_url, images }) => {
  return (
    <div
      className="rounded-lg border border-blue-100 bg-blue-50 text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col group h-full"
    >
      <div className="flex-1 flex flex-col cursor-pointer" tabIndex={0}>
        <div className="relative aspect-square min-h-48 sm:min-h-56 md:min-h-64 overflow-hidden group bg-gray-100" role="region" aria-roledescription="carousel">
          {images && images.length > 0 ? (
            <MenuItemCarousel images={images} alt={name} />
          ) : (
            <MenuItemCarousel images={[image_url || "/img/placeholder.jpg"]} alt={name} />
          )}
        </div>
        <div className="p-4 flex-1 flex flex-col " role="button" aria-label={`View details for ${name}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="grow overflow-hidden">
              <h3 className="text-lg font-bold truncate text-gray-900">{name}</h3>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold whitespace-nowrap text-blue-500">ETB&nbsp;{price}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3 break-words">{description}</p>
        </div>
      </div>
      <div className="flex justify-between gap-2 mt-auto px-4 pb-4">
        <button
          className="whitespace-nowrap font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-500 bg-white hover:bg-blue-100 text-blue-500 h-9 rounded-md px-3 flex-1 flex items-center justify-center gap-1 text-xs sm:text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye h-3 w-3 sm:h-4 sm:w-4"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
          View
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 flex-1 bg-blue-600 hover:opacity-90 text-white text-xs sm:text-sm"
          type="button"
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
