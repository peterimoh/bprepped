'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extensions';
import MenuBar, { MenuOption } from './menu-bar';

interface EditorProps {
  content?: string;
  placeholder?: string;
  immediatelyRender?: boolean;
  onChange: (content: string) => void;
  options?: MenuOption[];
}

export function Editor({
  onChange,
  content,
  immediatelyRender = false,
  options,
  placeholder = 'Write something …',
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
        emptyNodeClass: 'is-empty',
      }),
    ],
    content,
    immediatelyRender,
    editorProps: {
      attributes: {
        class:
          'w-full min-w-full min-h-[80px] rounded-sm px-4 py-3 border-1 bg-background text-base backdrop-blur-sm transition-all duration-300 focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div
      className={`flex w-full flex-col gap-2 rounded-xl bg-transparent ${options && options.length > 0 ? 'p-2' : ''}`}
    >
      <MenuBar editor={editor} options={options} />
      <EditorContent editor={editor} />
      <style jsx>{`
        :global(.ProseMirror p.is-editor-empty:first-child::before) {
          content: attr(data-placeholder);
          float: left;
          color: hsl(var(--muted-foreground) / 0.7);
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
