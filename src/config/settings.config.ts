import { type TCustomIconsStyle } from '../components/custom-icons/types';

export type TSettingsThemeMode = 'light' | 'dark' | 'system';
export type TNotificationMode = 'on' | 'off'

export type TSettingsContainer = 'default' | 'fluid' | 'fixed';

export interface ISettings {
  NotificationMode: TNotificationMode;
  themeMode: TSettingsThemeMode;
  container: TSettingsContainer;
  IconsStyle: TCustomIconsStyle;
}

// Default settings for the application
const defaultSettings: ISettings = {
  NotificationMode: 'on',
  themeMode: 'dark',
  IconsStyle: 'filled',
  container: 'fixed'
};

export { defaultSettings };
