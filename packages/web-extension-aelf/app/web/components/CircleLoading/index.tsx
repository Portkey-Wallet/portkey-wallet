import './index.less';

export type LoadingType = {
  width?: number;
  height?: number;
  theme?: 'dark' | 'light';
  variant?: 'default' | 'gradient';
  size?: 'small' | 'medium' | 'large' | 'xl' | 'custom';
};

// TODO-SA
const theme = 'dark';

const CircleLoading = (props: LoadingType) => {
  const { width = 16, height = 16, theme: propTheme = theme, variant = 'default', size = 'custom' } = props;

  const getSizeClass = () => {
    if (size === 'custom') return '';
    return `circle-loading-${size}`;
  };

  const getThemeClass = () => {
    return `circle-loading-${propTheme}`;
  };

  const getVariantClass = () => {
    if (variant === 'gradient') return 'circle-loading-gradient';
    return 'circle-loading';
  };

  const containerStyle = size === 'custom' ? { width, height } : {};

  return <div className={`${getVariantClass()} ${getThemeClass()} ${getSizeClass()}`} style={containerStyle} />;
};

export default CircleLoading;
