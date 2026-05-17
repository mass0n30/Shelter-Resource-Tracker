import { useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { set } from "date-fns";

function FileForm({ authRouterForm, fetchUpdatedData, setOpenForm }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadResult, setUploadResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setOpenForm("csv");
    setUploadResult(null);
    const selectedFile = e.target.files[0];

    setError("");
    setUploadResult(null);

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setFile(null);
      setError("Please upload a CSV file.");
      return;
    }

    setFile(selectedFile);
  };

  const handleReset = () => {
    setFile(null);
    setError("");
    setUploadResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Select a CSV file before uploading.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("csv_file", file);

      const response = await authRouterForm.post(
        "/upload-csv",
        formData
      );

      setUploadResult(response.data);
      fetchUpdatedData(true);
    } catch (err) {
      console.error(err);
      setError("CSV upload failed. Please check the file and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent rounded-lg w-full max-w-md">
      <DialogHeader>
        <DialogTitle>Upload CSV</DialogTitle>

        <DialogDescription className="mt-2 flex items-center gap-2 text-sm text-muted">
          <Upload className="w-4 h-4" />
          Manually upload a client CSV file to update overnight stay data.
        </DialogDescription>
      </DialogHeader>

      {error && <span className="text-red-500 text-sm">{error}</span>}

      {uploadResult && (
        <div className="mt-3 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          CSV uploaded successfully.
        </div>
      )}


      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-white px-4 py-8 text-center transition hover:bg-primaryLight/40">
          <Upload className="h-8 w-8 text-primary" />

          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium text-foreground">
              Choose CSV file
            </p>
            <p className="mt-1 text-xs text-muted">
              Upload the nightly client sheet manually.
            </p>
          </div>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {file && (
          <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-backgroundAlt px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate text-sm text-foreground">
                {file.name}
              </span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="bg-transparent rounded-md p-1 text-muted transition hover:bg-red-50 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-white hover:bg-primaryDark"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={loading || !file}
            className="inline-flex items-center gap-2 rounded-md bg-primary text-white px-4 py-2 text-sm font-medium transition hover:bg-primaryDark disabled:pointer-events-none disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FileForm;