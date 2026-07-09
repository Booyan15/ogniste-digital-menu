import { Minus, Plus } from 'lucide-react';
import ognisteLogo from '../assets/ogniste-logo.png';

export default function ProductCard({
  item,
  quantity = 0,
  onAdd,
  onIncrement,
  onDecrement,
  language,
  copy,
}) {
  const name = item.name[language];

  return (
    <article className="product-card">
      <div className="product-media">
        {item.image ? (
          <img src={item.image} alt={name} loading="lazy" />
        ) : (
          <div className="product-placeholder" aria-hidden="true">
            <img src={ognisteLogo} alt="" />
          </div>
        )}
      </div>

      <div className="product-info">
        <div className="product-top-row">
          <h3 className="product-title">{name}</h3>
          <strong className="product-price">{item.priceLabel[language]}</strong>
        </div>
        <p className="product-description">{item.description[language]}</p>

        <div className="product-action">
          {quantity > 0 ? (
            <div className="stepper" aria-label={`${copy.quantity} ${name}`}>
              <button type="button" onClick={onDecrement} aria-label={`${copy.decrease} ${name}`}>
                <Minus size={16} strokeWidth={2.6} aria-hidden="true" />
              </button>
              <strong className="qty">{quantity}</strong>
              <button type="button" onClick={onIncrement} aria-label={`${copy.increase} ${name}`}>
                <Plus size={16} strokeWidth={2.6} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button className="add-button" type="button" onClick={onAdd}>
              <Plus size={16} strokeWidth={2.6} aria-hidden="true" />
              {copy.add}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
