import React from 'react';
import './index.less';

interface CircleLoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const CircleLoading: React.FC<CircleLoadingProps> = ({ size = 'medium', color = '#1890ff', className = '' }) => {
  return (
    <div className={`circle-loading circle-loading--${size} ${className}`}>
      <div className="circle-loading__spinner" style={{ borderTopColor: color }}>
        <div className="circle-loading__inner"></div>
      </div>
    </div>
  );
};

export default CircleLoading;
