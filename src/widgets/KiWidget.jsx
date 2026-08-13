import { ImageOff } from 'lucide-react';
import { VUKI_IMAGES } from '../assets/vukiImages.js';
import styles from './KiWidget.module.css';

export default function KiWidget({ data, onChange }) {
  const selected = VUKI_IMAGES.find((img) => img.id === data.imageId) ?? null;

  if (VUKI_IMAGES.length === 0) {
    return (
      <div className={styles.empty}>
        <ImageOff size={24} />
        <p>Ingen bilder funnet. Legg bildefiler i src/assets/img/VUKI.</p>
      </div>
    );
  }

  return (
    <div className={styles.ki}>
      <select
        className={`${styles.select} widget-hover-controls`}
        value={data.imageId ?? ''}
        onChange={(e) => onChange({ imageId: e.target.value || null })}
      >
        <option value="">Velg et bilde...</option>
        {VUKI_IMAGES.map((img) => (
          <option key={img.id} value={img.id}>
            {img.name}
          </option>
        ))}
      </select>

      <div className={styles.preview}>
        {selected ? (
          <img className={styles.image} src={selected.url} alt={selected.name} />
        ) : (
          <p className={styles.placeholder}>Velg et bilde over</p>
        )}
      </div>
    </div>
  );
}
