import { Clock, ListTodo, Target, Heart, ImageIcon } from 'lucide-react';
import ClockWidget from './ClockWidget.jsx';
import ScheduleWidget from './ScheduleWidget.jsx';
import GoalWidget from './GoalWidget.jsx';
import ImageWidget from './ImageWidget.jsx';

/**
 * Sentralt register for alle widget-typer.
 * For å legge til en ny widget: lag komponenten og legg til ett objekt her.
 * Selve lerretet (Canvas) trenger ikke endres.
 */
export const WIDGET_REGISTRY = [
  {
    type: 'clock',
    label: 'Klokke',
    icon: Clock,
    color: '#DCEEFB', // pastellfarge for widgeten - bytt denne for å endre fargen
    defaultSize: { width: 260, height: 260 },
    defaultData: {},
    component: ClockWidget,
  },
  {
    type: 'schedule',
    label: 'Tidsplan',
    icon: ListTodo,
    color: '#FFF3D6', // pastellfarge for widgeten - bytt denne for å endre fargen
    defaultSize: { width: 360, height: 320 },
    defaultData: { items: [{ id: 'rad-1', tid: '', tekst: '' }] },
    component: ScheduleWidget,
  },
  {
    type: 'fagligMal',
    label: 'Faglig mål',
    icon: Target,
    color: '#E4F7E9', // pastellfarge for widgeten - bytt denne for å endre fargen
    defaultSize: { width: 340, height: 220 },
    defaultData: { title: 'Faglig mål', lines: [{ id: 'linje-1', text: '' }] },
    component: GoalWidget,
  },
  {
    type: 'sosialtMal',
    label: 'Sosialt mål',
    icon: Heart,
    color: '#FDE2E4', // pastellfarge for widgeten - bytt denne for å endre fargen
    defaultSize: { width: 340, height: 220 },
    defaultData: { title: 'Sosialt mål', lines: [{ id: 'linje-1', text: '' }] },
    component: GoalWidget,
  },
  {
    type: 'image',
    label: 'Bilde',
    icon: ImageIcon,
    color: '#EDE7F9', // pastellfarge for widgeten - bytt denne for å endre fargen
    defaultSize: { width: 320, height: 260 },
    defaultData: { imageId: null },
    component: ImageWidget,
  },
];

export function getWidgetDefinition(type) {
  return WIDGET_REGISTRY.find((w) => w.type === type);
}
