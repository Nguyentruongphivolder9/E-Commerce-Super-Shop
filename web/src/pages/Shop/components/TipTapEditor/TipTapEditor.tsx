import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import TipTapMenuBar from './TipTapMenuBar'
import { Control, Controller } from 'react-hook-form'
import { useEffect } from 'react'

interface Props {
  control: Control<any, any>
  className: string
  contentEdit?: string
}
const extensions = [StarterKit, Underline]

export default function TipTapEditor({
  control,
  className = 'rounded-md overflow-hidden flex flex-col border',
  contentEdit = ``
}: Props) {
  const editor = useEditor({
    extensions,
    content: contentEdit,
    editorProps: {
      attributes: {
        class:
          'min-h-72 p-2 text-[#333333] text-sm prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
      }
    }
  })

  useEffect(() => {
    if (editor && contentEdit !== editor.getHTML()) {
      editor.commands.setContent(contentEdit)
    }
  }, [contentEdit, editor])

  if (!editor) {
    return null
  }

  return (
    <Controller
      name='description'
      control={control}
      defaultValue=''
      render={({ field }) => {
        editor.on('update', () => {
          field.onChange(editor.getHTML())
        })

        return (
          <div className={className}>
            <TipTapMenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        )
      }}
    />
  )
}
