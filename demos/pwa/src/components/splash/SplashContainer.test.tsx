import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { render } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import SplashContainer from './SplashContainer';

vi.mock('@capacitor/core');
vi.mock('@capacitor/splash-screen');

describe('<SplashContainer />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('in a mobile context', () => {
    beforeEach(() => (Capacitor.isNativePlatform as Mock).mockReturnValue(true));

    it('should hide the splash screen', () => {
      render(<SplashContainer />);
      expect(SplashScreen.hide).toHaveBeenCalledTimes(1);
    });
  });

  describe('in a web context', () => {
    beforeEach(() => (Capacitor.isNativePlatform as Mock).mockReturnValue(false));

    it('should not hide the splash screen', () => {
      render(<SplashContainer />);
      expect(SplashScreen.hide).not.toHaveBeenCalled();
    });
  });
});
