import { useForm } from "react-hook-form";
import { useEffect } from "react";
import styles from "../../styles/components/form.module.css";
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
      <DialogContent className={styles.addFileModal}>

        <div className={styles.formContainer}>

          <div className={styles.fileToggleBtns}>
            <Button
              variant="ghost"
              onClick={handleClose}
              className={styles.closeModalButton}
            >
              <XCircle className={styles.closeIcon} />
            </Button>
          </div>

          <div className={styles.addFileModalContent}>
            <div className={styles.fileFormHeader}>
              <div className={styles.fileFormIcon}>
                <img src={"/open-folder.png"} />
              </div>
              <h2 className={styles.fileFormTitle}>
                {handleUploadAvatar ? "Upload Avatar" : "Attach a File"}
              </h2>
            </div>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={styles.fileForm}
              autoComplete="off"
            >
              <input
                type="file"
                {...form.register("file")}
                className={styles.fileInput}
                onChange={(e) => {
                  const selected = e.target.files?.[0] || null;
                  setFile(selected);

                  if (selected) {
                    setPreview(URL.createObjectURL(selected));
                  }
                }}
              />

              {preview && (
                <div className={styles.previewImgContainer}>
                  <img
                    src={preview}
                    className={styles.previewImage}
                    alt="preview"
                  />
                </div>
              )}

              <Button type="submit">Upload</Button>
            </form>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}