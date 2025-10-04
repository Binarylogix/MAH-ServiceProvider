import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
// const { width, height } = Dimensions.get("screen");

export const COLORS = {
  primary: '#01A449', // green

  red: '#FF0000',  // red

  blue60: "rgba(32, 10, 77, 0.6)",
 
  blue: '#1080E9',
  bluePrimary: '#9284DF',
  darkblue: '#00063F',
  button: '#78258B', // Orange
  primary3: '#33354E', // Dark Blue
  orange: '#FF7900',
  secondary: '#FC2626', // Red
  bottomgray: '#777777',
  gray10: '#E5E5E5',   //lightgray
  gray20: '#CCCCCC',
  gray30: '#A1A1A1',
  gray40: '#999999',
  gray50: '#7F7F7F',
  gray60: '#666666',
  gray70: '#4C4C4C',
  gray80: '#333333',
  gray85: '#242526',
  gray90: '#191919',

  grayF3: '#ECEFF3',
  grayD80: '#666D80',

  inActiveColor: '#A4ACB9',

  // placeholderColor
  placeholderColor: "rgba(0, 0, 0, 0.64)",
  // placeholderColor: "#999999",
  placeholderBg: '#EEEEEE',

  red1: 'rgba(246, 119, 122, 1)',

  grayE: '#EEEEEE',
  grayCD: '#CDCDCD',
  grayC4: "#C4C4C4",
  grayC3: "#C3C3C3",
  grayD4: "#D4D4D4",
  gray8F: '#8F8F8F',

  danger: "#FF0000",

  // yellow
  yellow: "#FFE500",

  // light
  light: "#F6F6F6",
  light5: "#E5E5E5",
  lightD9: "#D9D9D9",

  lightB9: '#A4ACB9',

  black12: '#0D0D12',
  black35: '#272835',
  black25: '#1A1B25',
  black17: '#0A0E17',

  black1: "#4F4F4F",
  black82: "#828282",
  black52: '#525252',
  black8A: "#8A8A8A",
  black20: "rgba(0, 0, 0, 0.12)",
  lightBlack: "#A19B9B",
  black7B: "#7B7B7B",
  black6: "#666666",
  black7A: "#7A7A7A",

  additionalColor4: '#C3C3C3',
  additionalColor9: '#F3F3F3',
  additionalColor11: '#F0FFFB',
  additionalColor13: '#EBF3EF',

  white: '#FFFFFF',
  black: '#000000',

  bgLight: 'rgba(247, 247, 247, 1)',
  bg1: '#F7F7F7',
  bg2: '#6ee38fff',


  transparent: 'transparent',
  transparentWhite1: 'rgba(255, 255, 255, 0.1)',
  transparentWhite2: 'rgba(255, 255, 255, 0.2)',
  transparentWhite3: 'rgba(255, 255, 255, 0.3)',
  transparentBlack1: 'rgba(0, 0, 0, 0.1)',
  transparentBlack2: 'rgba(0, 0, 0, 0.2)',
  transparentBlack3: 'rgba(0, 0, 0, 0.3)',
  transparentBlack4: 'rgba(0, 0, 0, 0.4)',
  transparentBlack5: 'rgba(0, 0, 0, 0.5)',
  transparentBlack7: 'rgba(0, 0, 0, 0.7)',
};
export const SIZES = {
  // app dimensions
  width,
  height,

  // font sizes
  text30: width * .088,
  text27: width * .08,
  text24: width * .07,
  text20: width * .06,
  text18: width * .046,
  text16: width * .04,
  text15: width * .038,
  text14: width * .036,
  text13: width * .034,
  text12: width * .032,
  text11: width * .031,
  text10: width * .03,
  text9: width * .028,
  text8: width * .026,
};
  export const FONTS = {
    // primary font
    black: 'Poppins-Black',
    bold: 'Poppins-Bold',
    semiBold: 'Poppins-SemiBold',
    medium: 'Poppins-Medium',
    regular: 'Poppins-Regular',
    light: 'Poppins-Light',
    thin: 'Poppins-Thin',
  };


export const darkTheme = {
  name: "dark",
  backgroundColor1: COLORS.gray85,
  backgroundColor2: COLORS.gray90,
  backgroundColor3: COLORS.gray90,
  backgroundColor4: COLORS.primary,
  backgroundColor5: COLORS.gray85,
  backgroundColor6: COLORS.black,
  backgroundColor7: COLORS.gray90,
  backgroundColor8: COLORS.gray70,
  lineDivider: COLORS.gray70,
  borderColor1: COLORS.gray70,
  borderColor2: COLORS.gray70,
  textColor: COLORS.white,
  textColor2: COLORS.white,
  textColor3: COLORS.gray40,
  textColor4: COLORS.white,
  textColor5: COLORS.gray30,
  textColor6: COLORS.gray30,
  textColor7: COLORS.gray40,
  tintColor: COLORS.white,
  dotColor1: COLORS.white,
  dotColor2: COLORS.primary,
}

export const lightTheme = {
  name: "light",
  backgroundColor1: COLORS.white,
  backgroundColor2: COLORS.primary3,
  backgroundColor3: COLORS.additionalColor11,
  backgroundColor4: COLORS.white,
  backgroundColor5: COLORS.additionalColor13,
  backgroundColor6: COLORS.primary3,
  backgroundColor7: COLORS.white,
  backgroundColor8: COLORS.gray10,
  lineDivider: COLORS.gray20,
  borderColor1: COLORS.white,
  borderColor2: COLORS.black,
  textColor: COLORS.black,
  textColor2: COLORS.primary,
  textColor3: COLORS.gray80,
  textColor4: COLORS.white,
  textColor5: COLORS.black,
  textColor6: COLORS.gray,
  textColor7: COLORS.black,
  tintColor: COLORS.black,
  dotColor1: COLORS.gray20,
  dotColor2: COLORS.primary3,
}

export const selectedTheme = darkTheme

const appTheme = { COLORS, SIZES, FONTS, darkTheme, lightTheme };

export default appTheme;
