import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export default function SearchInput({
  placeholder = "Search...",
  variant = "borderBottom",
  theme = "light",
  searchStr,
  onSearchChanged
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

      const [value, setValue] = useState("");
  
      const OnKeyPressed = (e) => {
          if (e.keyCode === 13 || e.charCode === 13 || e.which === 13) {
              if (onSearchChanged) onSearchChanged(value);
          }
      }
  
      const OnInputChanged = (e) => {
          e.preventDefault();
          setValue(e.target.value);
      }
  
      const OnClearInput = (e) => {
          e.preventDefault();
          setValue("");
          if (onSearchChanged) onSearchChanged("");
      }
  
      useEffect(() => {
          setValue(searchStr);
      }, [searchStr])

  const baseBorder =
    variant === "borderBottom"
      ? "border-b"
      : "border rounded-xl";

  const themeStyle =
    theme === "dark"
      ? "bg-gray-900 text-white border-gray-600 placeholder-gray-400"
      : "bg-white text-black border-gray-300 placeholder-gray-500";

  return (
    <div className="flex items-center">
      {/* Search Button (when closed) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <SearchIcon fontSize="small" className="w-6 h-6 text-[#000]" />
        </button>
      )}

      {/* Expanding Input (when open) */}
      {open && (
        <div
          className={`flex items-center transition-all duration-300 ease-in-out overflow-hidden ${baseBorder} ${themeStyle}`}
          style={{ width: open ? "180px" : "0px", opacity: open ? 1 : 0 }}
        >
          <SearchIcon fontSize="small" className="ml-2 text-gray-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => OnInputChanged(e)}
            onKeyPress={(e) => OnKeyPressed(e)}
            placeholder={placeholder}
            autoFocus
            className="w-full px-2 py-1 text-sm bg-transparent text-[#000] focus:outline-none"
          />
          <button
            onClick={(e) => {
              setOpen(false);
              OnClearInput(e);
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full mr-1"
          >
            <CloseIcon fontSize="small" className="text-[#000]" />
          </button>
        </div>
      )}
    </div>
  );
}
