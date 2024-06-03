import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import image from "../../assets/image.png";
import { storage } from "../../firebase/config";
import { ref, uploadBytes } from "firebase/storage";

const UploadFile = ({ open, setOpen, setIsChanged, path }) => {
  const handleOpen = () => {
    setOpen(!open);
    setFile(null)
  };
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onSubmit = async () => {
    if (file) {
      const folderRef = ref(storage, `${path}/${file.name}`);
      await uploadBytes(folderRef, file);
      handleOpen();
      setIsChanged(true);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" color="blue">
        <span className="material-symbols-outlined">upload_file</span>
      </Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Upload File</DialogHeader>
        <DialogBody>
          <form className="cursor-pointer p-2">
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="border-4 border-black p-2 h-28 rounded-lg">
                  <Typography>Drop the file here ...</Typography>
                  <img src={image} alt="" className="w-9" />
                </div>
              ) : (
                <div className="border-2 p-2 h-28">
                  <Typography>
                    Drag 'n' drop file here, or click to select file
                  </Typography>
                </div>
              )}
            </div>
          </form>
          {file && <h1>{file.name}</h1>}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="blue" onClick={onSubmit}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default UploadFile;
