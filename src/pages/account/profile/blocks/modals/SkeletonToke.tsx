

import clsx from 'clsx';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SkeletonToke = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-muted rounded-md',
        className
      )}
      {...props}
    />
  );
};
export {SkeletonToke}