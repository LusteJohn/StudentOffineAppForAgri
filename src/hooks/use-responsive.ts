import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

export type ScreenSizeCategory = 'compact' | 'regular' | 'large';

export interface ResponsiveDimensions {
  width: number;
  height: number;
  isCompact: boolean;
  isTablet: boolean;
  isLarge: boolean;
  screenSizeCategory: ScreenSizeCategory;
  modalMaxWidth: number;
  modalMaxHeight: string;
  formMaxWidth: number;
  padding: number;
  margin: number;
}

export function useResponsive(): ResponsiveDimensions {
  const { width, height } = useWindowDimensions();

  const responsive = useMemo(() => {
    // Define breakpoints
    const COMPACT_BREAKPOINT = 390;
    const TABLET_BREAKPOINT = 768;
    const LARGE_BREAKPOINT = 1024;

    const isCompact = width < COMPACT_BREAKPOINT;
    const isTablet = width >= TABLET_BREAKPOINT && width < LARGE_BREAKPOINT;
    const isLarge = width >= LARGE_BREAKPOINT;

    let screenSizeCategory: ScreenSizeCategory = 'compact';
    if (isLarge) {
      screenSizeCategory = 'large';
    } else if (isTablet) {
      screenSizeCategory = 'regular';
    }

    // Calculate responsive dimensions
    const modalMaxWidth = isCompact 
      ? width * 0.92 
      : isTablet 
        ? Math.min(width * 0.7, 520) 
        : Math.min(width * 0.5, 600);
    
    const modalMaxHeight = '85%';
    
    const formMaxWidth = isCompact 
      ? width * 0.95 
      : isTablet 
        ? Math.min(width * 0.6, 480) 
        : Math.min(width * 0.4, 500);

    const padding = isCompact ? 16 : isTablet ? 24 : 32;
    const margin = isCompact ? 12 : isTablet ? 20 : 28;

    return {
      width,
      height,
      isCompact,
      isTablet,
      isLarge,
      screenSizeCategory,
      modalMaxWidth,
      modalMaxHeight,
      formMaxWidth,
      padding,
      margin,
    };
  }, [width, height]);

  return responsive;
}
