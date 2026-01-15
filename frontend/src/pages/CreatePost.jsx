import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { useSelector } from "react-redux";
import { useState } from "react";

function CreatePost() {

  const { currentUser } = useSelector((state) => state.user);

  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "<p>&nbsp;</p>",
    onUpdate: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty);
    },
  });

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

const handleUploadImage = async () => {
  if (!image) {
    setUploadError("Please select an image first");
    return;
  }

  setUploading(true);
  setUploadError(null);

  const formData = new FormData();
  formData.append("image", image);

  try {
    const res = await fetch("/api/post/upload-image", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      setUploadError(data.message || "Image upload failed");
      setUploading(false);
      return;
    }

    setImageUrl(data.imageUrl);
    setUploading(false);
  } catch (error) {
    setUploadError("Image upload failed");
    setUploading(false);
  }
};


  return (
    <>
      {currentUser?.role !== "user" &&
        <div className="p-3 mx-auto max-w-3xl min-h-screen font-sans">

          <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              if (!editor || editor.isEmpty) {
                e.preventDefault();
                alert("Post content is required");
              }
            }}
          >

            <div className="flex flex-col gap-4 sm:flex-row justify-baseline ">
              <input
                type="text"
                className="flex-1 text-black rounded-md font-semibold bg-gray-300"
                placeholder="Title"
                required
                id="title"
              />
              <select className="border rounded-md py-2 px-7 text-black bg-gray-300 font-semibold">
                <option value="uncatogorized">Select a category</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="ai">AI</option>
                <option value="devops">DevOps</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center 
            border-2 border-dotted p-3 rounded-md w-full opacity-90">
              <input
                type="file"
                onChange={(e) => { setImage(e.target.files[0]); }}
                accept="image/*"
                className="w-full sm:flex-1 min-w-0 text-sm cursor-pointer 
                pl-1 file:mr-4 file:py-2 file:px-4 file:rounded-md
                file:bg-blue-600 file:text-white hover:file:bg-blue-700 h-8" />
              <button
                type="button"
                onClick={handleUploadImage}
                disabled={uploading}
                className="w-full sm:w-auto px-4 py-auto bg-blue-600 text-gray-100 font-semibold 
                rounded-md hover:bg-blue-700 whitespace-nowrap h-8 disabled:opacity-50">
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>

            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}

            {imageUrl && (
              <img src={imageUrl} alt="uploaded" className="h-24 rounded-md" />
            )}

            <div>
              <style>
                {`
                  .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                  }
                  .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                  }
                  .ProseMirror li {
                    margin: 0.25rem 0;
                  }
                `}
              </style>

              <div className="flex gap-2 mb-2 border rounded-md p-2 bg-gray-300 ">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`px-2 text-gray-900 font-bold rounded ${
                    editor.isActive("bold") ? "bg-blue-600" : "bg-gray-500"}`}>
                  B
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`px-2 text-gray-900 font-semibold rounded ${
                    editor.isActive("italic") ? "bg-blue-600" : "bg-gray-500"}`}>
                  I
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`px-2 text-gray-900 font-bold rounded ${
                    editor.isActive("bulletList") ? "bg-blue-600" : "bg-gray-500"}`}>
                  • List
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`px-2 text-gray-900 font-bold rounded ${
                    editor.isActive("orderedList") ? "bg-blue-600" : "bg-gray-500"}`}>
                  1. List
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign("left").run()}
                  className={`px-2 text-gray-900 font-bold rounded ${
                    editor.isActive({ textAlign: "left" }) ? "bg-blue-600" : "bg-gray-500"}`}>
                  Start text
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign("center").run()}
                  className={`px-2 text-gray-900 font-bold rounded ${
                    editor.isActive({ textAlign: "center" }) ? "bg-blue-600" : "bg-gray-500"}`}>
                  Center text
                </button>
              </div>

              <div
                className={`h-auto sm:h-16 mb-12 w-full border rounded-md
                bg-gray-300 text-gray-900 p-3 overflow-y-auto focus-within:outline-none
                focus-within:ring-1 ${
                  isEditorEmpty ? "ring-1 ring-red-500" : "focus-within:ring-blue-500"
                }`}
              >
                <EditorContent editor={editor} className="outline-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isEditorEmpty}
              className="w-full sm:w-auto px-6 py-2
              bg-blue-600 text-white font-semibold rounded-md
              hover:bg-blue-700 focus:outline-none disabled:opacity-50">
              Submit Post
            </button>

          </form>
        </div>}
    </>
  );
}

export default CreatePost;
