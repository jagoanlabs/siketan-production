import React from "react";

const HomeLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="container mx-auto max-w-screen-2xl scroll-smooth">
      {/* content will be rendered here */}
      {children}
    </div>
  );
};

export default HomeLayout;
