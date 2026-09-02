"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  List,
  Paragraph,
  Table,
  TableToolbar,
  Underline,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

class UploadAdapter {
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then(async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");
      return { default: data.url };
    });
  }
  abort() {}
}

function UploadAdapterPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) =>
    new UploadAdapter(loader);
}

export default function CKEditorInner({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      config={{
        licenseKey: "GPL",
        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          List,
          Link,
          BlockQuote,
          Image,
          ImageToolbar,
          ImageStyle,
          ImageCaption,
          ImageUpload,
          Table,
          TableToolbar,
          UploadAdapterPlugin,
        ],
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "link",
          "blockQuote",
          "insertTable",
          "|",
          "imageUpload",
        ],
        table: { contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"] },
        image: {
          // No alignment / position controls — images are always full-width blocks.
          toolbar: ["toggleImageCaption", "imageTextAlternative"],
        },
        heading: {
          options: [
            { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
            { model: "heading1", view: "h2", title: "Heading 1", class: "ck-heading_heading1" },
            { model: "heading2", view: "h3", title: "Heading 2", class: "ck-heading_heading2" },
          ],
        },
      }}
      onChange={(_event: any, editor: any) => onChange(editor.getData())}
    />
  );
}
