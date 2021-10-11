import { EAction } from "./definitions/modes";

export interface IButtonSetting {
  mode: EAction;
  values: number[];
  enabled: boolean;
}

export interface IButtonSettings {
  primary: IButtonSetting;
  secondary: IButtonSetting;
}
export interface ITextSettings {
  text: string;
  font: string;
}
export interface IImageSettings {
  dither: boolean;
  blackThreshold: number;
  contrast: number;
  brightness: number;
  whiteThreshold: number;
  invert: boolean;
}

export interface ITextWithIconSettings {
  iconWidthMultiplier: number;
}

export type IOriginalImage = Buffer | null;
export type IOriginalImagePage = IOriginalImage[];
export type IConvertedImage = Buffer;
export type IConvertedImagePage = IConvertedImage[];
export interface IDisplay {
  imageSettings: IImageSettings;
  textSettings: ITextSettings;
  textWithIconSettings: ITextWithIconSettings;
  isGeneratedFromDefaultBackImage: boolean;
  previousPage?: number;
  previousDisplay?: number;
  originalImage: IOriginalImage;
  convertedImage: IConvertedImage;
  previewImage: string;
}

export type IButtonSettingsPage = IButtonSettings[];
export type IDisplaySettingsPage = IDisplay[];
