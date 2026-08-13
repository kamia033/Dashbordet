import { create } from 'zustand';
import { createId } from '../utils/id.js';
import { loadSubjects, saveSubjects } from '../db/storage.js';
import { getWidgetDefinition } from '../widgets/registry.js';
import { getTemplate } from '../templates/templates.js';

function persist(set, get) {
  saveSubjects(get().subjects);
}

export const useAppStore = create((set, get) => ({
  subjects: [],
  currentSubjectId: null,
  currentFolderId: null,
  currentPageId: null,
  view: 'dashboard',
  hasHydrated: false,

  async hydrate() {
    const subjects = await loadSubjects();
    set({ subjects, hasHydrated: true });
  },

  addSubject(name) {
    const subject = { id: createId(), name, folders: [] };
    set((state) => ({ subjects: [...state.subjects, subject] }));
    persist(set, get);
    return subject.id;
  },

  deleteSubject(subjectId) {
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== subjectId),
      currentSubjectId: state.currentSubjectId === subjectId ? null : state.currentSubjectId,
      currentFolderId: state.currentSubjectId === subjectId ? null : state.currentFolderId,
    }));
    persist(set, get);
  },

  selectSubject(subjectId) {
    set({ currentSubjectId: subjectId, currentFolderId: null, currentPageId: null });
  },

  addFolder(subjectId, name) {
    const folder = { id: createId(), name, pages: [] };
    set((state) => ({
      subjects: state.subjects.map((s) =>
        s.id === subjectId ? { ...s, folders: [...s.folders, folder] } : s
      ),
    }));
    persist(set, get);
    return folder.id;
  },

  deleteFolder(subjectId, folderId) {
    set((state) => ({
      subjects: state.subjects.map((s) =>
        s.id === subjectId ? { ...s, folders: s.folders.filter((f) => f.id !== folderId) } : s
      ),
      currentFolderId: state.currentFolderId === folderId ? null : state.currentFolderId,
    }));
    persist(set, get);
  },

  selectFolder(folderId) {
    set({ currentFolderId: folderId, currentPageId: null });
  },

  addPage(subjectId, folderId, name, templateId) {
    const widgets = getTemplate(templateId).build();
    const page = { id: createId(), name, widgets };
    set((state) => ({
      subjects: state.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              folders: s.folders.map((f) =>
                f.id === folderId ? { ...f, pages: [...f.pages, page] } : f
              ),
            }
          : s
      ),
    }));
    persist(set, get);
    return page.id;
  },

  deletePage(subjectId, folderId, pageId) {
    set((state) => ({
      subjects: state.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              folders: s.folders.map((f) =>
                f.id === folderId ? { ...f, pages: f.pages.filter((p) => p.id !== pageId) } : f
              ),
            }
          : s
      ),
    }));
    persist(set, get);
  },

  openPage(subjectId, folderId, pageId) {
    set({
      currentSubjectId: subjectId,
      currentFolderId: folderId,
      currentPageId: pageId,
      view: 'canvas',
    });
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
              folders: s.folders.map((f) =>
                f.id !== state.currentFolderId
                  ? f
                  : {
                      ...f,
                      pages: f.pages.map((p) =>
                        p.id !== state.currentPageId ? p : { ...p, widgets: updater(p.widgets) }
                      ),
                    }
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
