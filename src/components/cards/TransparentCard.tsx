'use client';
import styles from '@/styles/cards/TransparentCard.module.css';

import { motion, MotionProps } from 'framer-motion';

interface DefaultProps {
  children: React.ReactNode | string;
  className?: string;
}

interface ButtonProps extends DefaultProps {
  onClick?: (event: React.MouseEvent) => void;
}

type Props = ({ type?: 'button'; } & ButtonProps)

const TransparentCard = (props: Props & MotionProps) => {
  const {
    children,
  } = props;

  return (
    <div className={props.className} onClick={props.onClick}>
      {children}
    </div>
  );

};

export default TransparentCard;
