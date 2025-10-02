import React from "react";

interface AddButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, label = "Add Service", className }) => (
  <div className={`flex justify-end mb-8 ${className || ""}`}>
    <button
      className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 transition-opacity w-full sm:w-auto bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 text-white"
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-4 w-4 mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
      {label}
    </button>
  </div>
);

export default AddButton;
