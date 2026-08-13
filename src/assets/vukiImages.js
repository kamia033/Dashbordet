// Legg bildefiler (png/jpg/jpeg/gif/webp/svg) i denne mappen for at de skal dukke opp i KI-widgeten.
const modules = import.meta.glob('/src/assets/img/VUKI/*.{png,jpg,jpeg,gif,webp,svg}', {
  eager: true,
  import: 'default',
});

export const VUKI_IMAGES = Object.entries(modules)
  .map(([path, url]) => ({ id: path, name: path.split('/').pop(), url }))
  .sort((a, b) => a.name.localeCompare(b.name, 'nb'));
