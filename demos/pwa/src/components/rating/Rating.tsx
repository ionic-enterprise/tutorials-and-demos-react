import { IonIcon } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import './Rating.css';

interface Props {
  rating?: number;
  onRatingChange?: (rating: number) => unknown;
}

export const Rating = ({ rating = 0, onRatingChange = () => void 0 }: Props) => (
  <div className="rating">
    {[1, 2, 3, 4, 5].map((num, idx) => (
      <IonIcon
        key={idx}
        icon={num <= rating ? star : starOutline}
        data-testid={num <= rating ? `star` : `outline`}
        onClick={() => onRatingChange(num)}
      />
    ))}
  </div>
);
