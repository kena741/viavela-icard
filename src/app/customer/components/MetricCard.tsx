import AnimatedNumber from "./AnimatedNumber";

export const MetricCard = ({
    icon,
    label,
    value,
    color,
    prefix,
}: {
    icon: string;
    label: string;
    value: number;
    color: string;
    prefix?: string;
}) => (
    <div className="bg-white rounded-lg py-2 px-1 md:py-3 md:px-3 transition-all hover:shadow-md border border-gray-100">
        <div className="flex flex-col items-center text-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`lucide lucide-${icon} w-4 h-4 md:w-5 md:h-5 text-${color} mb-0.5 md:mb-1`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <use href={`#${icon}`} />
            </svg>
            <div className="text-[10px] md:text-sm font-medium text-gray-500 mb-0.5 truncate w-full">
                {label}
            </div>
            <div className="text-base md:text-xl font-semibold text-gray-900">
                {prefix ? `${prefix} ` : ""}
                <AnimatedNumber value={value} />
            </div>
        </div>
    </div>
);


