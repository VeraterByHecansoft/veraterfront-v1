export type TCustomIconsStyle = 'duotone' | 'filled' | 'solid' | 'outline';

export interface ICustomIconsProps {
  icon: string;
  style?: TCustomIconsStyle;
  className?: string;
  color?:string
}
