import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TiptapEditorProps {
  content: string;
  onUpdate: (content: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.view) {
      const editorDom = editor.view.dom;
      const observer = new MutationObserver(() => {
        if (editorDom.scrollHeight > editorDom.clientHeight) {
          onUpdate(editor.getHTML());
        }
      });

      observer.observe(editorDom, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, [editor, onUpdate]);

  return (
    <EditorContent
      editor={editor}
      className="no-focus-outline overflow-hidden"
    />
  );
};

export default TiptapEditor;
