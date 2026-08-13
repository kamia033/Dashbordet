import { createId } from '../utils/id.js';
import { getWidgetDefinition } from '../widgets/registry.js';

function makeWidget(type, x, y, dataOverride) {
  const def = getWidgetDefinition(type);
  return {
    id: createId(),
    type,
    x,
    y,
    width: def.defaultSize.width,
    height: def.defaultSize.height,
    data: { ...def.defaultData, ...dataOverride },
  };
}

export const TEMPLATES = [
  {
    id: 'morgenstart',
    name: 'Morgenstart',
    description: 'Klokke, tidsplan for dagen og et sosialt læringsmål.',
    build: () => [
      makeWidget('clock', 40, 40),
      makeWidget('schedule', 340, 40),
      makeWidget('sosialtMal', 740, 40),
    ],
  },
  {
    id: 'konsentrert',
    name: 'Konsentrert arbeid',
    description: 'Klokke, faglig læringsmål og en bilde-widget.',
    build: () => [
      makeWidget('clock', 40, 40),
      makeWidget('fagligMal', 340, 40),
      makeWidget('image', 720, 40),
    ],
  },
  {
    id: 'gruppearbeid',
    name: 'Gruppearbeid',
    description: 'Sosialt læringsmål, faglig læringsmål og tidsplan.',
    build: () => [
      makeWidget('sosialtMal', 40, 40),
      makeWidget('fagligMal', 420, 40),
      makeWidget('schedule', 800, 40),
    ],
  },
  {
    id: 'blank',
    name: 'Tom side',
    description: 'Start med et helt tomt lerret.',
    build: () => [],
  },
];

export function getTemplate(templateId) {
  return TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[TEMPLATES.length - 1];
}
