export default function CategoryTabs({ categories, activeCategory, onSelect, language, copy }) {
  return (
    <nav className="category-tabs" aria-label={copy.categoriesLabel}>
      <div className="category-tabs__track">
        {categories.map((category) => (
          <button
            key={category.id}
            className={category.id === activeCategory ? 'category-chip active' : 'category-chip'}
            type="button"
            onClick={() => onSelect(category.id)}
          >
            {category.name[language]}
          </button>
        ))}
      </div>
    </nav>
  );
}
