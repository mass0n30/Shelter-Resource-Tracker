import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { XCircle } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function FileForm({
  file,
  setFile,
  fileToggle,
  setFileToggle,
  handleUploadFile,
  preview,
  setPreview,
  handleUploadAvatar,
}) {

  const form = useForm();

  const handleClose = () => {
    setFileToggle(false);
    setFile(null);
    setPreview(null);
  };

  const onSubmit = (data) => {
    if (handleUploadAvatar) {
      handleUploadAvatar(data);
    } else {
      handleUploadFile(data);
    }
    handleClose();
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
  <Dialog open={fileToggle} onOpenChange={setFileToggle}>
    <DialogContent className="max-w-md w-full p-6 rounded-xl shadow-lg">

      <div className="flex flex-col gap-6">

        {/* Close Button */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="p-2"
          >
            <XCircle className="w-5 h-5" />
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
            <img src="/open-folder.png" className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-semibold">
            {handleUploadAvatar ? "Upload Avatar" : "Attach a File"}
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          autoComplete="off"
        >

          {/* File Input */}
          <input
            type="file"
            {...form.register("file")}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:bg-gray-50 file:text-sm file:font-medium hover:file:bg-gray-100"
            onChange={(e) => {
              const selected = e.target.files?.[0] || null;
              setFile(selected);

              if (selected) {
                setPreview(URL.createObjectURL(selected));
              }
            }}
          />

          {/* Preview */}
          {preview && (
            <div className="w-full flex justify-center">
              <img
                src={preview}
                alt="preview"
                className="max-h-40 rounded-md object-contain border"
              />
            </div>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full">
            Upload
          </Button>

        </form>

      </div>

    </DialogContent>
  </Dialog>
  );
}