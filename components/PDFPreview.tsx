"use client"

export default function PDFPreview({ file }: { file: string }) {
  return (
    <div className="border rounded-2xl overflow-hidden shadow-lg">
      <iframe
        src={file}
        className="w-full h-[600px]"
      />
    </div>
  )
}