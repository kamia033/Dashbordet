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
    id: 'vikaoppstart',
    name: 'Vikaoppstart',
    description: 'Klokke, tidsplan, faglig og sosiale læringsmål. Lim inn klassekart hvis du trenger.',
    build: () => [
      makeWidget('clock', 300, 40),
      makeWidget('schedule', 300, 340),
      makeWidget('fagligMal', 700, 40),
      makeWidget('sosialtMal', 700, 300),
      
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
