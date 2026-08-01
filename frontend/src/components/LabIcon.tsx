import React from 'react';
import * as Lucide from 'lucide-react';

interface LabIconProps extends Lucide.LucideProps {
  name: string;
  className?: string;
  size?: number;
}

export const LabIcon: React.FC<LabIconProps> = ({ name, className = '', size = 20, ...props }) => {
  const icons = Lucide as unknown as Record<string, React.ComponentType<Lucide.LucideProps>>;
  const IconComponent = icons[name];

  if (!IconComponent) {
    return <Lucide.HelpCircle className={className} size={size} {...props} />;
  }

  return <IconComponent className={className} size={size} {...props} />;
};
