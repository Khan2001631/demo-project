import React from 'react';

interface SvgProps {
  fillColor: string;
  className: string;
}

const customSvg: React.FC<SvgProps> = ({ fillColor, className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18" height="18" viewBox="0 0 1000 1000"
      className={className}
      
    >
      <path d="M 500 0C 224 0 0 224 0 500C 0 776 224 1000 500 1000C 776 1000 1000 776 1000 500C 1000 224 776 0 500 0C 500 0 500 0 500 0M 0,0" fill={fillColor}/>
    </svg>
  );
}

export default customSvg;
