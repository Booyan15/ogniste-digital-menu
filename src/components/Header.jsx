import { ShoppingBag } from 'lucide-react';
import ognisteLogo from '../assets/ogniste-logo.png';
import SearchBar from './SearchBar.jsx';

export default function Header({
  searchQuery,
  onSearchChange,
  orderCount,
  onOrderClick,
  language,
  onLanguageChange,
  copy,
}) {
  return (
    <header className="sticky-header">
      <div className="sticky-header__top">
        <a className="brand-mark" href="#top" aria-label={copy.restaurantName}>
          <img src={ognisteLogo} alt="" />
          <span>{language === 'mk' ? 'Огниште' : 'Ognishte'}</span>
        </a>

        <div className="sticky-header__actions">
          <div className="language-switcher" aria-label={copy.languageLabel}>
            {['mk', 'en'].map((option) => (
              <button
                type="button"
                key={option}
                className={language === option ? 'is-active' : ''}
                aria-pressed={language === option}
                onClick={() => onLanguageChange(option)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="order-pill" type="button" onClick={onOrderClick}>
            <ShoppingBag size={19} strokeWidth={2.5} aria-hidden="true" />
            <span>{copy.myOrder}</span>
            <strong>{orderCount}</strong>
          </button>
        </div>
      </div>

      <div className="sticky-header__search">
        <SearchBar value={searchQuery} onChange={onSearchChange} copy={copy} />
      </div>
    </header>
  );
}
