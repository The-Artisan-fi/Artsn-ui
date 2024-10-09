'use client';
import { useTheme } from '@/hooks/use-theme';

import { Icon } from '@iconify/react';
import { motion, MotionProps } from 'framer-motion';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const DarkModeButton = ({
  className,
  onClick,
  ...rest
}: Props & MotionProps) => {
  const { isDarkMode, toggle } = useTheme();

  const clickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    onClick && onClick(e);
    toggle();
  };

  return (
    <motion.button
      className={`rounded-lg p-1 text-black hover:text-secondary focus:bg-secondary focus:outline-none cursor-pointer w-fit ${className} duration-200`}
      onClick={clickHandler}
      {...rest}
    >
      <Icon
        icon={isDarkMode ? 'carbon:sun' : 'ph:moon'}
        className={`${isDarkMode ? 'text-yellow-400' : 'text-gray-800'}`}
        width="26"
        height="26"
      />
    </motion.button>
  );
};

export default DarkModeButton;
