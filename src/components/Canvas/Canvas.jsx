import { useCallback, useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useAppStore } from '../../store/useStore.js';
import { getWidgetDefinition } from '../../widgets/registry.js';
import { createId } from '../../utils/id.js';
import { saveImage } from '../../db/storage.js';
import Toolbar from './Toolbar.jsx';
import WidgetShell from './WidgetShell.jsx';
import WidgetDock from './WidgetDock.jsx';
import styles from './Canvas.module.css';

function usePageSelector() {
  return useAppStore((s) => {
    const subject = s.subjects.find((x) => x.id === s.currentSubjectId);
    const folder = subject?.folders.find((x) => x.id === s.currentFolderId);
    return folder?.pages.find((x) => x.id === s.currentPageId) ?? null;
  });
}

export default function Canvas() {
  const page = usePageSelector();
  const goToDashboard = useAppStore((s) => s.goToDashboard);
  const addWidget = useAppStore((s) => s.addWidget);
  const updateWidgetData = useAppStore((s) => s.updateWidgetData);
  const updateWidgetLayout = useAppStore((s) => s.updateWidgetLayout);
  const removeWidget = useAppStore((s) => s.removeWidget);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // Forlat native fullskjerm når man navigerer bort fra lerretet
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
  }, []);

  useEffect(() => {
    async function handlePaste(e) {
      const items = e.clipboardData?.items ?? [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (!file) continue;
          const imageId = createId();
          await saveImage(imageId, file);
          const rect = canvasRef.current?.getBoundingClientRect();
          const centerX = rect ? rect.width / 2 - 160 : 200;
          const centerY = rect ? rect.height / 2 - 130 : 150;
          addWidget('image', {
            x: Math.max(20, centerX),
            y: Math.max(20, centerY),
            data: { imageId },
          });
          break;
        }
      }
    }
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addWidget]);

  if (!page) {
    return (
      <div className={styles.notFound}>
        <p>Fant ikke siden.</p>
        <button type="button" onClick={goToDashboard}>
          Tilbake til dashbord
        </button>
      </div>
    );
  }

  function handleAddWidget(type) {
    const rect = canvasRef.current?.getBoundingClientRect();
    const def = getWidgetDefinition(type);
    const centerX = rect ? rect.width / 2 - def.defaultSize.width / 2 : 100;
    const centerY = rect ? rect.height / 2 - def.defaultSize.height / 2 : 100;
    addWidget(type, { x: Math.max(20, centerX), y: Math.max(20, centerY) });
  }

  return (
    <div className={styles.canvasPage}>
      <Toolbar
        pageName={page.name}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onBack={goToDashboard}
      />

      <div className={styles.canvasArea} ref={canvasRef}>
        {page.widgets.map((widget) => {
          const def = getWidgetDefinition(widget.type);
          if (!def) return null;
          const Component = def.component;
          return (
            <Rnd
              key={widget.id}
              className={styles.rnd}
              size={{ width: widget.width, height: widget.height }}
              position={{ x: widget.x, y: widget.y }}
              minWidth={180}
              minHeight={140}
              bounds="parent"
              dragHandleClassName="widget-drag-handle"
              onDragStop={(e, d) => updateWidgetLayout(widget.id, { x: d.x, y: d.y })}
              onResizeStop={(e, dir, ref, delta, pos) =>
                updateWidgetLayout(widget.id, {
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  x: pos.x,
                  y: pos.y,
                })
              }
            >
              <WidgetShell
                icon={def.icon}
                title={def.label}
                color={def.color}
                onDelete={() => removeWidget(widget.id)}
              >
                <Component data={widget.data} onChange={(patch) => updateWidgetData(widget.id, patch)} />
              </WidgetShell>
            </Rnd>
          );
        })}

        {page.widgets.length === 0 && (
          <p className={styles.hint}>
            Lerretet er tomt. Velg en widget under, eller lim inn et bilde med Ctrl+V.
          </p>
        )}
      </div>

      <WidgetDock onAdd={handleAddWidget} />
    </div>
  );
}
