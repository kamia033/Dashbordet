import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useAppStore } from '../../store/useStore.js';
import { getWidgetDefinition } from '../../widgets/registry.js';
import { createId } from '../../utils/id.js';
import { saveImage } from '../../db/storage.js';
import Toolbar from './Toolbar.jsx';
import WidgetShell from './WidgetShell.jsx';
import WidgetDock from './WidgetDock.jsx';
import styles from './Canvas.module.css';

// Logisk størrelse på whiteboardet - må matche .canvasSurface i Canvas.module.css
const CANVAS_WIDTH = 2600;
const CANVAS_HEIGHT = 1500;

// Avstand mellom prikkene i bakgrunnen - må matche background-size i .canvasSurface
const GRID_SIZE = 24;

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

function clampZoom(value) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

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
  const [zoom, setZoom] = useState(1);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const scrollRef = useRef(null);
  const zoomAnchorRef = useRef(null);

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

  // Støtter pinch-to-zoom på styreflate (sendes som wheel-event med ctrlKey),
  // og sikter zoomen mot punktet under musepekeren i stedet for hjørnet av lerretet
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    function handleWheel(e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const newZoom = clampZoom(zoom - e.deltaY * 0.01);
      if (newZoom === zoom) return;
      const rect = scrollEl.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      zoomAnchorRef.current = {
        contentX: (scrollEl.scrollLeft + pointerX) / zoom,
        contentY: (scrollEl.scrollTop + pointerY) / zoom,
        pointerX,
        pointerY,
      };
      setZoom(newZoom);
    }
    scrollEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollEl.removeEventListener('wheel', handleWheel);
  }, [zoom]);

  // Justerer scroll-posisjonen etter en zoom-endring slik at punktet under
  // musepekeren blir stående stille (kun satt av pinch/ctrl+scroll-håndteren over)
  useLayoutEffect(() => {
    const anchor = zoomAnchorRef.current;
    const scrollEl = scrollRef.current;
    if (!anchor || !scrollEl) return;
    scrollEl.scrollLeft = anchor.contentX * zoom - anchor.pointerX;
    scrollEl.scrollTop = anchor.contentY * zoom - anchor.pointerY;
    zoomAnchorRef.current = null;
  }, [zoom]);

  // Finner midten av det brukeren ser på nå, uavhengig av scroll og zoom
  function getCenterPosition(width, height) {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return { x: 60, y: 60 };
    const viewCenterX = scrollEl.scrollLeft + scrollEl.clientWidth / 2;
    const viewCenterY = scrollEl.scrollTop + scrollEl.clientHeight / 2;
    const x = viewCenterX / zoom - width / 2;
    const y = viewCenterY / zoom - height / 2;
    return {
      x: Math.min(Math.max(20, x), CANVAS_WIDTH - width - 20),
      y: Math.min(Math.max(20, y), CANVAS_HEIGHT - height - 20),
    };
  }

  useEffect(() => {
    async function handlePaste(e) {
      const items = e.clipboardData?.items ?? [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (!file) continue;
          const imageId = createId();
          await saveImage(imageId, file);
          const { x, y } = getCenterPosition(320, 260);
          addWidget('image', { x, y, data: { imageId } });
          break;
        }
      }
    }
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addWidget, zoom]);

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
    const def = getWidgetDefinition(type);
    const { x, y } = getCenterPosition(def.defaultSize.width, def.defaultSize.height);
    addWidget(type, { x, y });
  }

  return (
    <div className={styles.canvasPage}>
      <Toolbar
        pageName={page.name}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onBack={goToDashboard}
        zoom={zoom}
        onZoomChange={(next) => setZoom(clampZoom(next))}
        snapToGrid={snapToGrid}
        onToggleSnapToGrid={() => setSnapToGrid((v) => !v)}
      />

      <div className={styles.canvasArea} ref={scrollRef}>
        <div className={styles.canvasSurface} style={{ transform: `scale(${zoom})` }}>
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
                scale={zoom}
                dragGrid={snapToGrid ? [GRID_SIZE, GRID_SIZE] : undefined}
                resizeGrid={snapToGrid ? [GRID_SIZE, GRID_SIZE] : undefined}
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
      </div>

      <WidgetDock onAdd={handleAddWidget} />
    </div>
  );
}
