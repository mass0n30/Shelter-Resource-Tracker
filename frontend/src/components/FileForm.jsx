import { useState } from 'react';
import styles from '../../styles/components/form.module.css';
import { XCircle } from 'lucide-react';

export default function FileForm({ file, setFile, fileToggle, setFileToggle, handleUploadFile, preview, setPreview, handleUploadAvatar }) {


  const handleClose = () => {
    setFileToggle(false);
    setFile(null);
  }

  const handleAttachFile = (e) => {
    if (handleUploadAvatar) {
      handleUploadFile(e);
    }
    e.preventDefault();
    setFileToggle(false);
  }

  return (
    <div className={styles.addFileModal}> 
      <div className={styles.formContainerOuter}>
        <div className={styles.formContainer}>
          <div className={styles.fileToggleBtns}>
            {fileToggle && <div><button className={styles.closeModalButton} onClick={handleClose}><XCircle className={styles.closeIcon} /></button></div>}
          </div>
            {fileToggle && (
            <div className={styles.addFileModalContent}>
                <div className={styles.fileFormHeader}>
                  <div className={styles.fileFormIcon}>
                    <img src={'/open-folder.png'} />
                  </div>
                  <h2 className={styles.fileFormTitle}>{handleUploadAvatar ? "Upload Avatar" : "Attach a File"}</h2>
                </div>

              <form onSubmit={handleUploadAvatar} method="POST" className={styles.fileForm} autoComplete="off">
                <input type="file" name="avatar" className={styles.fileInput} onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }} />
                {preview && 
                  <div className={styles.previewImgContainer}>
                    <img src={preview} className={styles.previewImage} alt="preview" />
                  </div>
                }
                <button type="submit">Upload</button>
              </form>
            
            </div>
            )}
        </div>
      </div>
    </div>
  );

}