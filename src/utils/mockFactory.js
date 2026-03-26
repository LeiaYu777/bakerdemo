const seedRandom = (seed) => {
  let current = seed;
  return () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };
};

const random = seedRandom(20260326);

export const randomInt = (min, max) => {
  const value = random();
  return Math.floor(value * (max - min + 1)) + min;
};

export const randomFloat = (min, max, precision = 1) => {
  const value = min + random() * (max - min);
  return Number(value.toFixed(precision));
};

export const pickOne = (arr) => arr[randomInt(0, arr.length - 1)];

export const pickMany = (arr, count) => {
  const list = [...arr];
  const result = [];
  while (result.length < count && list.length > 0) {
    const idx = randomInt(0, list.length - 1);
    result.push(list[idx]);
    list.splice(idx, 1);
  }
  return result;
};

export const createPlaceholder = (label, status) => {
  const bg = status === '异常' ? '#ffe8e6' : '#e8f7eb';
  const fg = status === '异常' ? '#c4382d' : '#1f7a45';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="280" viewBox="0 0 480 280">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fff8ef"/>
        <stop offset="100%" stop-color="#f7efe2"/>
      </linearGradient>
    </defs>
    <rect width="480" height="280" fill="url(#g)"/>
    <rect x="20" y="20" width="440" height="240" rx="16" fill="${bg}" stroke="#e5d3bf" stroke-width="2"/>
    <text x="240" y="130" text-anchor="middle" font-size="26" font-family="Avenir Next, PingFang SC, sans-serif" fill="#7a5a3a">${label}</text>
    <rect x="170" y="150" width="140" height="42" rx="21" fill="${fg}"/>
    <text x="240" y="178" text-anchor="middle" font-size="20" font-family="Avenir Next, PingFang SC, sans-serif" fill="#ffffff">${status}</text>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
