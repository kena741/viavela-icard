import React from "react";

interface CancelButtonProps {
  onClick: () => void;
  label: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick, label }) => (
  <button
    type="button"
    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-white hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 w-auto text-black"
    onClick={onClick}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x mr-1 h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
    {label}
  </button>
);

export default CancelButton;
