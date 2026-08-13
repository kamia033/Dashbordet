import { useState } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useStore.js';
import { TEMPLATES } from '../../templates/templates.js';
import styles from './NewPageModal.module.css';

export default function NewPageModal({ subjectId, folderId, onClose }) {
  const addPage = useAppStore((s) => s.addPage);
  const openPage = useAppStore((s) => s.openPage);
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);

  function handleSubmit(e) {
    e.preventDefault();
    const pageName = name.trim() || 'Ny side';
    const pageId = addPage(subjectId, folderId, pageName, templateId);
    openPage(subjectId, folderId, pageId);
    onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Opprett ny side</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Lukk">
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="page-name">
            Navn på side
          </label>
          <input
            id="page-name"
            className={styles.input}
            type="text"
            placeholder="F.eks. Mandag time 3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <p className={styles.label}>Velg mal</p>
          <div className={styles.templateGrid}>
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                className={`${styles.templateCard} ${
                  template.id === templateId ? styles.templateCardActive : ''
                }`}
                onClick={() => setTemplateId(template.id)}
              >
                <span className={styles.templateName}>{template.name}</span>
                <span className={styles.templateDesc}>{template.description}</span>
              </button>
            ))}
          </div>

          <button type="submit" className={styles.submitBtn}>
            Opprett side
          </button>
        </form>
      </div>
    </div>
  );
}
