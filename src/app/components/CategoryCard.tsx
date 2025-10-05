import React from "react";
import Image from "next/image";

interface CategoryCardProps {
    name: string;
    icon: string;
    selected: boolean;
    onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, selected, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-base transition-all duration-300 whitespace-nowrap focus:outline-none shadow-sm`
                + (selected
                    ? ' bg-blue-50 text-blue-700 shadow-md scale-105'
                    : ' bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md')
            }
            aria-pressed={selected}
            style={{ height: 64 }}
        >
            <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                <Image src={icon} alt={name} width={40} height={40} style={{ width: 40, height: 40 }} />
            </span>
            <span className="font-medium text-base truncate text-left">{name}</span>
        </button>
    );
};

export default CategoryCard;
