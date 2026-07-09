const cyrillicToLatinMap = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  ѓ: 'gj',
  е: 'e',
  ж: 'zh',
  з: 'z',
  ѕ: 'dz',
  и: 'i',
  ј: 'j',
  к: 'k',
  л: 'l',
  љ: 'lj',
  м: 'm',
  н: 'n',
  њ: 'nj',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  ќ: 'kj',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'ch',
  џ: 'dj',
  ш: 'sh',
};

const latinAliases = [
  ['đ', 'dj'],
  ['ќ', 'kj'],
  ['ḱ', 'kj'],
  ['č', 'ch'],
  ['ć', 'kj'],
  ['š', 'sh'],
  ['ž', 'zh'],
  ['аj', 'aj'],
];

export function transliterateToLatin(value = '') {
  return value
    .toString()
    .toLowerCase()
    .split('')
    .map((char) => cyrillicToLatinMap[char] || char)
    .join('');
}

export function normalizeForSearch(value = '') {
  let normalized = transliterateToLatin(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  latinAliases.forEach(([from, to]) => {
    normalized = normalized.replaceAll(from, to);
  });

  return normalized;
}

export function itemSearchText(item, categoryName = '') {
  return normalizeForSearch(
    [
      ...Object.values(item.name || {}),
      ...Object.values(item.description || {}),
      ...Object.values(categoryName || {}),
      ...(item.tags || []),
    ].join(' '),
  );
}
