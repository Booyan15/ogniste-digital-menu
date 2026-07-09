import { ChevronDown, Flame, ShoppingBag } from 'lucide-react';
import ognisteLogo from '../assets/ogniste-logo.png';

export default function Hero({ onMenuClick, onOrderClick, copy }) {
  return (
    <section className="hero" id="top">
      <div className="hero-tablecloth" aria-hidden="true" />
      <div className="hero__pattern" aria-hidden="true" />
      <div className="hero__inner">
        <div className="hero__content">
          <div className="hero__logo-wrap">
            <img className="hero__logo" src={ognisteLogo} alt={copy.restaurantName} />
          </div>
          <div className="hero__eyebrow">
            <Flame size={16} strokeWidth={2.4} aria-hidden="true" />
            {copy.heroEyebrow}
          </div>
          <h1>{copy.heroTitle}</h1>
          <p>{copy.heroSubtitle}</p>
          <div className="hero__actions">
            <button className="button button--primary" type="button" onClick={onMenuClick}>
              {copy.viewMenu}
              <ChevronDown size={18} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button className="button button--secondary" type="button" onClick={onOrderClick}>
              <ShoppingBag size={18} strokeWidth={2.5} aria-hidden="true" />
              {copy.myOrder}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
