type TSpace = {
  direction: 'vertical' | 'horizontal';
  size: number;
};

export default function Space({ direction, size }: TSpace) {
  return (
    <div
      style={{
        width: direction === 'horizontal' ? size : 0,
        height: direction === 'vertical' ? size : 0,
      }}
    />
  );
}
