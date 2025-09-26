import React from "react";

const sizes = {
  textxs: "text-[12px] font-normal",
};

const Text = ({ children, className = "", as, size = "textxs", ...restProps }) => {
  const Component = as || "p";

  return (
    <Component className={`text-black-900 font-Montserrat ${className} ${sizes[size]} `} {...restProps}>
      {children}
    </Component>
  );
};

export default Text;
