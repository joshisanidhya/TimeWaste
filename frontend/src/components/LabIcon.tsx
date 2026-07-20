import React from 'react';
import * as Lucide from 'lucide-react';

interface LabIconProps extends Omit<React.ComponentProps<any>, 'name'> {
  name: string;
  className?: string;
  size?: number;
}

export const LabIcon: React.FC<LabIconProps> = ({ name, className = '', size = 20, ...props }) => {
  // Safe lookup for the icon component. Fallback to HelpCircle if not found.
  const IconComponent = (Lucide as any)[name];

  if (!IconComponent) {
    return <Lucide.HelpCircle className={className} size={size} {...props} />;
  }

  return <IconComponent className={className} size={size} {...props} />;
};
