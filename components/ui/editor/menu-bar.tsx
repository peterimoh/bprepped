import { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Type,
} from 'lucide-react';
import { Toggle } from '../toggle';

export type Option = {
  icon: React.JSX.Element;
  onClick: () => void;
  pressed: boolean;
};

export type MenuOption =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'paragraph'
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'bulletList'
  | 'orderedList'
  | 'highlight';

interface MenuBarProps {
  editor?: Editor;
  options?: MenuOption[];
}

const DEFAULT_OPTIONS: MenuOption[] = [
  'heading1',
  'heading2',
  'heading3',
  'bold',
  'italic',
  'strikethrough',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'bulletList',
  'orderedList',
  'highlight',
];

export default function MenuBar({
  editor,
  options = DEFAULT_OPTIONS,
}: MenuBarProps) {
  if (!editor) return null;

  const optionMap: Record<MenuOption, Option> = {
    heading1: {
      icon: <Heading1 className="h-5 w-5" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive('heading', { level: 1 }),
    },
    heading2: {
      icon: <Heading2 className="h-5 w-5" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive('heading', { level: 2 }),
    },
    paragraph: {
      icon: <Type className="h-5 w-5" />,
      onClick: () => editor.chain().focus().setParagraph().run(),
      pressed: editor.isActive('paragraph'),
    },
    heading3: {
      icon: <Heading3 className="h-5 w-5" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive('heading', { level: 3 }),
    },
    bold: {
      icon: <Bold className="h-5 w-5" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive('bold'),
    },
    italic: {
      icon: <Italic className="h-5 w-5" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive('italic'),
    },
    strikethrough: {
      icon: <Strikethrough className="h-5 w-5" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive('strike'),
    },
    alignLeft: {
      icon: <AlignLeft className="h-5 w-5" />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      pressed: editor.isActive({ textAlign: 'left' }),
    },
    alignCenter: {
      icon: <AlignCenter className="h-5 w-5" />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      pressed: editor.isActive({ textAlign: 'center' }),
    },
    alignRight: {
      icon: <AlignRight className="h-5 w-5" />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      pressed: editor.isActive({ textAlign: 'right' }),
    },
    bulletList: {
      icon: <List className="h-5 w-5" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive('bulletList'),
    },
    orderedList: {
      icon: <ListOrdered className="h-5 w-5" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive('orderedList'),
    },
    highlight: {
      icon: <Highlighter className="h-5 w-5" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive('highlight'),
    },
  };

  if (options.length === 0) return null;

  const visibleOptions = options.map((option) => optionMap[option]);

  return (
    <div className="scrollbar-hide border-1 z-50 overflow-x-auto rounded-sm border-gray-500 bg-background p-1 shadow-sm">
      <div className="flex items-center gap-2 whitespace-nowrap">
        {visibleOptions.map((option, index) => (
          <Toggle
            key={index}
            pressed={option.pressed}
            onPressedChange={option.onClick}
            size="sm"
            className="px-3 py-1"
          >
            {option.icon}
          </Toggle>
        ))}
      </div>
    </div>
  );
}
