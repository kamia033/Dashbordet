import { useState } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useStore.js';
import { TEMPLATES } from '../../templates/templates.js';
import styles from './NewPageModal.module.css';

function getDefaultPageName() {
  return new Date().toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function NewPageModal({ subjectId, onClose }) {
  const addPage = useAppStore((s) => s.addPage);
  const openPage = useAppStore((s) => s.openPage);
  const [name, setName] = useState(getDefaultPageName);
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);

  function handleSubmit(e) {
    e.preventDefault();
    const pageName = name.trim() || getDefaultPageName();
    const pageId = addPage(subjectId, pageName, templateId);
    openPage(subjectId, pageId);
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
            onFocus={(e) => e.target.select()}
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
