import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { getImage } from '../db/storage.js';
import styles from './ImageWidget.module.css';

export default function ImageWidget({ data }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let objectUrl;
    let cancelled = false;

    if (data.imageId) {
      getImage(data.imageId).then((blob) => {
        if (blob && !cancelled) {
          objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
        }
      });
    }

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [data.imageId]);

  if (!url) {
    return (
      <div className={styles.empty}>
        <ImageOff size={28} />
        <p>Lim inn et bilde (Ctrl+V) på lerretet for å legge det til her</p>
      </div>
    );
  }

  return (
    <div className={styles.imageWrap}>
      <img className={styles.image} src={url} alt="Innlimt bilde" />
    </div>
  );
}
