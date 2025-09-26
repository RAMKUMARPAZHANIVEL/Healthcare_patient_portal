import React from "react";

const sizes = {
  texts: "text-[14px] font-medium",
  textmd: "text-[16px] font-medium lg:text-[13px]",
  headingxs: "text-[14px] font-bold",
  headings: "text-[24px] font-semibold lg:text-[20px] md:text-[22px]",
};

const Heading = ({ children, className = "", size = "textmd", as, ...restProps }) => {
  const Component = as || "h6";

  return (
    <Component className={`text-gray-900_cc font-poppins ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export default Heading;
