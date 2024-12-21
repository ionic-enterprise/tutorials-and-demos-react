import { Mock, vi } from 'vitest';
import { SplashScreen } from '@capacitor/splash-screen';
import { render } from '@testing-library/react';
import { isPlatform } from '@ionic/react';
import SplashContainer from './SplashContainer';

vi.mock('@capacitor/splash-screen');
vi.mock('@ionic/react', async (getOriginal) => {
  const original: object = await getOriginal();
  return { ...original, isPlatform: vi.fn() };
});

describe('<SplashContainer />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('in a mobile context', () => {
    beforeEach(() => (isPlatform as Mock).mockReturnValue(true));

    it('should hide the splash screen', () => {
      render(<SplashContainer />);
      expect(SplashScreen.hide).toHaveBeenCalledTimes(1);
    });
  });

  describe('in a web context', () => {
    beforeEach(() => (isPlatform as Mock).mockReturnValue(false));

    it('should not hide the splash screen', () => {
      render(<SplashContainer />);
      expect(SplashScreen.hide).not.toHaveBeenCalled();
    });
  });
});
