import { Coffee, Minus, Plus, Trash2, X } from 'lucide-react';

export default function OrderDrawer({
  isOpen,
  items,
  total,
  onClose,
  onIncrement,
  onDecrement,
  onClear,
  language,
  copy,
}) {
  return (
    <div className={isOpen ? 'order-shell open' : 'order-shell'} aria-hidden={!isOpen}>
      <button
        className="order-backdrop"
        type="button"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        aria-label={copy.closeOrder}
      />
      <aside className="order-drawer" aria-modal="true" role="dialog" aria-label={copy.myOrder}>
        <div className="order-drawer__header">
          <div>
            <span>{copy.waiterList}</span>
            <h2>{copy.myOrder}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={copy.close}>
            <X size={20} strokeWidth={2.6} aria-hidden="true" />
          </button>
        </div>

        {items.length ? (
          <>
            <div className="order-list">
              {items.map(({ item, quantity }) => (
                <div className="order-item" key={item.id}>
                  <div>
                    <h3>{item.name[language]}</h3>
                    <p>
                      {item.priceLabel[language]} × {quantity}
                    </p>
                  </div>
                  <div className="qty-stepper qty-stepper--light">
                    <button
                      type="button"
                      onClick={() => onDecrement(item.id)}
                      aria-label={`${copy.decrease} ${item.name[language]}`}
                    >
                      <Minus size={15} strokeWidth={2.6} aria-hidden="true" />
                    </button>
                    <strong>{quantity}</strong>
                    <button
                      type="button"
                      onClick={() => onIncrement(item.id)}
                      aria-label={`${copy.increase} ${item.name[language]}`}
                    >
                      <Plus size={15} strokeWidth={2.6} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="order-total">
                <span>{copy.total}</span>
                <strong>
                  {total} {language === 'mk' ? 'ден.' : 'MKD'}
                </strong>
              </div>
              <p>{copy.showWaiter}</p>
              <button className="clear-button" type="button" onClick={onClear}>
                <Trash2 size={17} strokeWidth={2.5} aria-hidden="true" />
                {copy.clearOrder}
              </button>
            </div>
          </>
        ) : (
          <div className="empty-order">
            <div aria-hidden="true">
              <Coffee size={30} strokeWidth={2.3} />
            </div>
            <h3>{copy.emptyOrder}</h3>
          </div>
        )}
      </aside>
    </div>
  );
}
