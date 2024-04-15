import React, { useEffect, useRef } from 'react';
import { Tooltip } from 'bootstrap';

interface TooltipProps {
  children: React.ReactNode;
  title: string;
  placement?: 'auto' | 'top' | 'bottom' | 'left' | 'right' | undefined;
}

const TooltipComponent: React.FC<TooltipProps> = ({ children, title, placement }) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<Tooltip | null>(null);

  useEffect(() => {
    const node = nodeRef.current;
    
    if (node) {
      // Destroy the existing tooltip if there is one
      if (tooltipRef.current) {
        tooltipRef.current.dispose();
      }

      const tooltip = new Tooltip(node, {
          title: title,
          trigger: 'hover',
          html: true,
          placement: placement ? placement : 'top',
      });

      const showTooltip = (e: Event) => {
          e.preventDefault();
          tooltip.show();
      };

      const hideTooltip = () => {
          tooltip.hide();
    };

    node.addEventListener('mouseenter', showTooltip);
    node.addEventListener('mouseleave', hideTooltip);
    node.addEventListener('focus', hideTooltip);
    node.addEventListener('click', hideTooltip);    

      return () => {
        if (node) {
          node.removeEventListener('mouseenter', showTooltip);
          node.addEventListener('mouseleave', hideTooltip);
          node.removeEventListener('focus', hideTooltip);
          node.removeEventListener('click', hideTooltip);
        }
      };
    }
  }, [title]);

  return <span ref={nodeRef}>{children}</span>;
};

export default TooltipComponent;