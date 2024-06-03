import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/config";

const CreateFolder = ({ open, setOpen, path, setIsChanged }) => {
  const handleOpen = () => {
    if (open === true) {
      setName("New Folder");
    }
    setOpen(!open);
  };
  const [name, setName] = useState("New Folder");

  const handleSubmit = async () => {
    if (name) {
      const folderRef = ref(storage, `${path}/${name}/placeholder.txt`);
      const emptyFile = new Blob([""], { type: "text/plain" });
      await uploadBytes(folderRef, emptyFile);
      handleOpen();
      setIsChanged(true);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} color="blue" variant="outlined">
        <span class="material-symbols-outlined">create_new_folder</span>
      </Button>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Create New Folder
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Enter a name for your new folder
            </Typography>
            <Input
              label="Folder"
              size="lg"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </CardBody>
          <CardFooter className="flex align-middle justify-center">
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="blue" onClick={handleSubmit}>
              <span>Confirm</span>
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
};

export default CreateFolder;
