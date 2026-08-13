import { create } from 'zustand';
import { createId } from '../utils/id.js';
import { loadSubjects, saveSubjects } from '../db/storage.js';
import { getWidgetDefinition } from '../widgets/registry.js';
import { getTemplate } from '../templates/templates.js';

function persist(set, get) {
  saveSubjects(get().subjects);
}

// Eldre lagrede data hadde et mappe-niv\u00e5 mellom fag og sider - flat ut til bare sider
function migrateSubjects(subjects) {
  return subjects.map((subject) => {
    if (Array.isArray(subject.pages)) return subject;
    const { folders, ...rest } = subject;
    return { ...rest, pages: (folders ?? []).flatMap((folder) => folder.pages ?? []) };
  });
}

export const useAppStore = create((set, get) => ({
  subjects: [],
  currentSubjectId: null,
  currentPageId: null,
  view: 'dashboard',
  hasHydrated: false,

  async hydrate() {
    const subjects = migrateSubjects(await loadSubjects());
    set({ subjects, hasHydrated: true });
  },

  addSubject(name) {
    const subject = { id: createId(), name, pages: [] };
    set((state) => ({ subjects: [...state.subjects, subject] }));
    persist(set, get);
    return subject.id;
  },

  deleteSubject(subjectId) {
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== subjectId),
      currentSubjectId: state.currentSubjectId === subjectId ? null : state.currentSubjectId,
    }));
    persist(set, get);
  },

  selectSubject(subjectId) {
    set({ currentSubjectId: subjectId, currentPageId: null });
  },

  addPage(subjectId, name, templateId) {
    const widgets = getTemplate(templateId).build();
    const page = { id: createId(), name, widgets };
    set((state) => ({
      subjects: state.subjects.map((s) =>
        s.id === subjectId ? { ...s, pages: [...s.pages, page] } : s
      ),
    }));
    persist(set, get);
    return page.id;
  },

  deletePage(subjectId, pageId) {
    set((state) => ({
      subjects: state.subjects.map((s) =>
        s.id === subjectId ? { ...s, pages: s.pages.filter((p) => p.id !== pageId) } : s
      ),
    }));
    persist(set, get);
  },

  openPage(subjectId, pageId) {
    set({ currentSubjectId: subjectId, currentPageId: pageId, view: 'canvas' });
  },

  goToDashboard() {
    set({ view: 'dashboard' });
  },

  updateCurrentPageWidgets(updater) {
    set((state) => ({
      subjects: state.subjects.map((s) =>
        s.id !== state.currentSubjectId
          ? s
          : {
              ...s,
              pages: s.pages.map((p) =>
                p.id !== state.currentPageId ? p : { ...p, widgets: updater(p.widgets) }
              ),
            }
      ),
    }));
    persist(set, get);
  },

  addWidget(type, position) {
    const def = getWidgetDefinition(type);
    const widget = {
      id: createId(),
      type,
      x: position?.x ?? 60,
      y: position?.y ?? 60,
      width: def.defaultSize.width,
      height: def.defaultSize.height,
      data: { ...def.defaultData, ...position?.data },
    };
    get().updateCurrentPageWidgets((widgets) => [...widgets, widget]);
    return widget.id;
  },

  updateWidgetData(widgetId, dataPatch) {
    get().updateCurrentPageWidgets((widgets) =>
      widgets.map((w) => (w.id === widgetId ? { ...w, data: { ...w.data, ...dataPatch } } : w))
    );
  },

  updateWidgetLayout(widgetId, layoutPatch) {
    get().updateCurrentPageWidgets((widgets) =>
      widgets.map((w) => (w.id === widgetId ? { ...w, ...layoutPatch } : w))
    );
  },

  removeWidget(widgetId) {
    get().updateCurrentPageWidgets((widgets) => widgets.filter((w) => w.id !== widgetId));
  },
}));
