import { useMemo, useState } from 'react';
import {
  ognishteImageInventory,
  ognishteImageInventorySummary,
} from '../data/ognishteImageInventory.js';
import './OgnishteImageReview.css';

const filters = [
  { id: 'all', label: 'Сите' },
  { id: 'selected', label: 'Избрани' },
  { id: 'rejected', label: 'Дупликати / неизбрани' },
];

function originalImageUrl(originalPath) {
  return encodeURI(`/${originalPath}`);
}

export default function OgnishteImageReview() {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const visibleImages = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('mk');

    return ognishteImageInventory.filter((image) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'selected' && image.shouldUse) ||
        (filter === 'rejected' && !image.shouldUse);
      const searchableText = [
        image.file,
        image.guessedProductName,
        image.duplicateGroup,
        image.reason,
        image.notes,
      ]
        .join(' ')
        .toLocaleLowerCase('mk');

      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [filter, query]);

  return (
    <main className="image-review">
      <header className="image-review__header">
        <div>
          <p className="image-review__eyebrow">Внатрешна развојна алатка</p>
          <h1>Преглед на фотографии</h1>
          <p>
            {ognishteImageInventorySummary.total} скенирани ·{' '}
            {ognishteImageInventorySummary.selected} избрани ·{' '}
            {ognishteImageInventorySummary.exactDuplicateGroups} идентични групи
          </p>
        </div>

        <a href="/">Назад кон празното мени</a>
      </header>

      <section className="image-review__controls" aria-label="Филтри за фотографии">
        <div className="image-review__filters">
          {filters.map((option) => (
            <button
              className={filter === option.id ? 'is-active' : ''}
              key={option.id}
              type="button"
              onClick={() => setFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label>
          <span>Пребарај</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Име, група или производ..."
          />
        </label>

        <strong>{visibleImages.length} прикажани</strong>
      </section>

      <section className="image-review__grid" aria-live="polite">
        {visibleImages.map((image) => (
          <article
            className={`image-review-card ${image.shouldUse ? 'is-selected' : 'is-rejected'}`}
            key={image.originalPath}
          >
            <div className="image-review-card__media">
              <img
                src={image.optimizedPath || originalImageUrl(image.originalPath)}
                alt={`${image.file} — ${image.guessedProductName}`}
                loading="lazy"
                decoding="async"
              />
              <span className="image-review-card__source">
                {image.optimizedPath ? 'Optimized WebP' : 'Original'}
              </span>
              <span className="image-review-card__decision">
                {image.shouldUse ? 'Избрана' : 'Неизбрана'}
              </span>
            </div>

            <div className="image-review-card__body">
              <h2>{image.file}</h2>
              <p className="image-review-card__product">{image.guessedProductName}</p>

              <dl>
                <div>
                  <dt>Доверба</dt>
                  <dd data-confidence={image.confidence}>{image.confidence}</dd>
                </div>
                <div>
                  <dt>Група</dt>
                  <dd>{image.duplicateGroup || '—'}</dd>
                </div>
                <div>
                  <dt>Димензии</dt>
                  <dd>
                    {image.width} × {image.height}
                  </dd>
                </div>
              </dl>

              <p className="image-review-card__reason">{image.reason}</p>
              <p className="image-review-card__notes">{image.notes}</p>
              <code title={image.originalPath}>{image.originalPath}</code>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
