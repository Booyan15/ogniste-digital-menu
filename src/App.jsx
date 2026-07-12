import { useEffect, useMemo, useRef, useState } from 'react';
import { Flame, SearchX } from 'lucide-react';
import CategoryTabs from './components/CategoryTabs.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import OrderDrawer from './components/OrderDrawer.jsx';
import ProductCard from './components/ProductCard.jsx';
import { categories, menuItems, uiText } from './data/menu.js';
import { itemSearchText, normalizeForSearch } from './utils/transliteration.js';

const STORAGE_KEY = 'ogniste-order-v1';
const LANGUAGE_STORAGE_KEY = 'ogniste-language-v1';
const ACTIVE_CATEGORY_STORAGE_KEY = 'ogniste-active-category';

function readStorageValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore unavailable storage; the app should keep working without persistence.
  }
}

function getInitialOrder() {
  try {
    const saved = readStorageValue(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function getInitialLanguage() {
  return readStorageValue(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'mk';
}

function getInitialActiveCategory() {
  const saved = readStorageValue(ACTIVE_CATEGORY_STORAGE_KEY);
  const savedExists = categories.some((category) => category.id === saved);

  return savedExists ? saved : (categories[0]?.id ?? '');
}

function getStickyMenuOffset() {
  const rawValue = getComputedStyle(document.documentElement).getPropertyValue(
    '--sticky-menu-height',
  );
  const value = Number.parseFloat(rawValue);

  return Number.isFinite(value) ? value : 190;
}

export default function App() {
  const stickyMenuRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(getInitialActiveCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState(getInitialOrder);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [language, setLanguage] = useState(getInitialLanguage);
  const copy = uiText[language];

  const categoryNameById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [],
  );

  const preparedItems = useMemo(
    () =>
      menuItems.map((item) => ({
        ...item,
        searchText: itemSearchText(item, categoryNameById[item.categoryId]),
      })),
    [categoryNameById],
  );

  const normalizedQuery = normalizeForSearch(searchQuery);
  const isMenuEmpty = preparedItems.length === 0;

  const visibleItems = useMemo(() => {
    const tokens = normalizedQuery.split(' ').filter(Boolean);
    return preparedItems.filter((item) => {
      const matchesCategory = tokens.length > 0 || item.categoryId === activeCategory;
      const matchesSearch = tokens.length
        ? tokens.every((token) => item.searchText.includes(token))
        : true;

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, normalizedQuery, preparedItems]);

  const orderItems = useMemo(
    () =>
      Object.entries(order)
        .map(([itemId, quantity]) => ({
          item: menuItems.find((item) => item.id === itemId),
          quantity,
        }))
        .filter(({ item, quantity }) => item && quantity > 0),
    [order],
  );

  const orderCount = orderItems.reduce((sum, entry) => sum + entry.quantity, 0);
  const orderTotal = orderItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);
  const productGridClassName = orderCount > 0 ? 'product-grid has-floating-cart' : 'product-grid';

  useEffect(() => {
    writeStorageValue(STORAGE_KEY, JSON.stringify(order));
  }, [order]);

  useEffect(() => {
    writeStorageValue(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    document.body.classList.toggle('drawer-open', isOrderOpen);
    return () => document.body.classList.remove('drawer-open');
  }, [isOrderOpen]);

  useEffect(() => {
    const stickyMenu = stickyMenuRef.current;

    if (!stickyMenu) {
      return undefined;
    }

    const updateStickyMenuHeight = () => {
      const height = Math.ceil(stickyMenu.getBoundingClientRect().height);

      if (height > 0) {
        document.documentElement.style.setProperty('--sticky-menu-height', `${height}px`);
      }
    };

    updateStickyMenuHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateStickyMenuHeight);
      observer.observe(stickyMenu);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateStickyMenuHeight);
    return () => window.removeEventListener('resize', updateStickyMenuHeight);
  }, []);

  function scrollToMenu() {
    const menu = document.getElementById('menu');

    if (!menu) {
      return;
    }

    const top = menu.getBoundingClientRect().top + window.scrollY - getStickyMenuOffset() - 16;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }

  function handleCategoryChange(categoryId) {
    setActiveCategory(categoryId);
    writeStorageValue(ACTIVE_CATEGORY_STORAGE_KEY, categoryId);
    requestAnimationFrame(scrollToMenu);
  }

  function incrementItem(itemId) {
    setOrder((current) => ({ ...current, [itemId]: (current[itemId] || 0) + 1 }));
  }

  function decrementItem(itemId) {
    setOrder((current) => {
      const nextQuantity = (current[itemId] || 0) - 1;
      const next = { ...current };

      if (nextQuantity > 0) {
        next[itemId] = nextQuantity;
      } else {
        delete next[itemId];
      }

      return next;
    });
  }

  return (
    <>
      <Hero onMenuClick={scrollToMenu} onOrderClick={() => setIsOrderOpen(true)} copy={copy} />

      <div className="menu-sticky-shell" ref={stickyMenuRef}>
        <div className="menu-sticky-shell__inner">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            orderCount={orderCount}
            onOrderClick={() => setIsOrderOpen(true)}
            language={language}
            onLanguageChange={setLanguage}
            copy={copy}
          />
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelect={handleCategoryChange}
            language={language}
            copy={copy}
          />
        </div>
      </div>

      <main id="menu" className="menu-shell">
        <div className="menu-intro">
          <div>
            <span className="section-kicker">
              <Flame size={15} strokeWidth={2.4} aria-hidden="true" />
              {copy.menuKicker}
            </span>
            <h2>{copy.menuTitle}</h2>
          </div>
          <p>{copy.menuDescription}</p>
        </div>

        <section className={`${productGridClassName} products-section`} aria-live="polite">
          {visibleItems.length ? (
            visibleItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                quantity={order[item.id] || 0}
                onAdd={() => incrementItem(item.id)}
                onIncrement={() => incrementItem(item.id)}
                onDecrement={() => decrementItem(item.id)}
                language={language}
                copy={copy}
              />
            ))
          ) : (
            <div className="empty-search">
              <span aria-hidden="true">
                <SearchX size={28} strokeWidth={2.4} />
              </span>
              {isMenuEmpty ? (
                <>
                  <h3>{copy.emptyMenuTitle}</h3>
                  <p>{copy.emptyMenuDescription}</p>
                </>
              ) : (
                <h3>{copy.noResults}</h3>
              )}
            </div>
          )}
        </section>
      </main>

      {orderCount > 0 ? (
        <button className="mobile-order-fab" type="button" onClick={() => setIsOrderOpen(true)}>
          {copy.myOrder}
          <strong>{orderCount}</strong>
        </button>
      ) : null}

      <OrderDrawer
        isOpen={isOrderOpen}
        items={orderItems}
        total={orderTotal}
        onClose={() => setIsOrderOpen(false)}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onClear={() => setOrder({})}
        language={language}
        copy={copy}
      />
    </>
  );
}
