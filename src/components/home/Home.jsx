import React, { useEffect, useState } from "react";
import NavbarPanel from "../navbar/Navbar";
import CreateFolder from "./CreateFolder";
import UploadFile from "./UploadFile";
import { auth, storage } from "../../firebase/config";
import { deleteObject, getDownloadURL, listAll, ref } from "firebase/storage";
import { Button, Typography } from "@material-tailwind/react";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [openFile, setOpenFile] = useState(false);
  const root = `users/${auth.currentUser.email}`;
  const [currentPath, setCurrentPath] = useState(root);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleCreateFolder = () => {
    if (!openFile) setOpen((prev) => !prev);
  };

  const toggleUploadFile = () => {
    if (!open) setOpenFile((prev) => !prev);
  };

  const fetchFolderData = async (path) => {
    const folderRef = ref(storage, path);
    const res = await listAll(folderRef);
    const fetchedFolders = res.prefixes.map((folderRef) => folderRef.name);
    const fetchedFiles = await Promise.all(
      res.items.map(async (fileRef) => {
        if (fileRef.name !== "placeholder.txt") {
          const url = await getDownloadURL(fileRef);
          return { name: fileRef.name, url };
        }
      })
    );
    setFolders(fetchedFolders);
    setFiles(fetchedFiles.filter((file) => file));
  };

  const navigateToFolder = (path) => {
    const newPath = `${currentPath}/${path}`;
    setCurrentPath(newPath);
  };

  const navigateToParentFolder = () => {
    if (currentPath === root) {
      return;
    }
    const newPath = currentPath.split("/").slice(0, -1).join("/");
    setCurrentPath(newPath || root);
  };

  useEffect(() => {
    fetchFolderData(currentPath);
    setIsChanged(false);
  }, [currentPath, isChanged]);

  useEffect(() => {
    const detectKey = (e) => {
      if (e.code === "KeyN" && e.ctrlKey && e.altKey) {
        toggleCreateFolder();
      } else if (e.code === "KeyU" && e.ctrlKey && e.altKey) {
        toggleUploadFile();
      }
    };

    window.addEventListener("keydown", detectKey);
    return () => {
      window.removeEventListener("keydown", detectKey);
    };
  }, [open, openFile]);

  const copyToClipboard = async (file) => {
    try {
      const textToCopy = file.url;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handelDelte = (e) => {
    const fileRef = ref(storage, `${currentPath}/${e.name}`);
    deleteObject(fileRef).then(() => {
      setIsChanged(true);
    });
  };

  return (
    <div>
      <NavbarPanel />
      <div className="flex justify-end px-0 sm:px-72 py-2 gap-2">
        <button
          onClick={()=> setCurrentPath(root)}
          disabled={currentPath === "root"}
          className="ml-4 mb-2 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          <span class="material-symbols-outlined">home</span>
        </button>
        <button
          onClick={navigateToParentFolder}
          disabled={currentPath === "root"}
          className="ml-4 mb-2 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          <span class="material-symbols-outlined">arrow_upward</span>
        </button>
        <Typography className="sm:block hidden text-center w-full text-blue-gray-700">
          press Ctrl + Alt + U for upload file <br />
          press Ctrl + Alt + N for create folder
        </Typography>
        <CreateFolder
          open={open}
          setOpen={setOpen}
          path={currentPath}
          setIsChanged={setIsChanged}
        />
        <UploadFile
          open={openFile}
          setOpen={setOpenFile}
          setIsChanged={setIsChanged}
          path={currentPath}
        />
      </div>

      <div className="container mx-auto grid grid-cols-4 gap-4 p-4">
        {folders.map((folderName) => (
          <div
            key={folderName}
            className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => navigateToFolder(folderName)}
          >
            <div className="text-center">
              <span class="material-symbols-outlined text-5xl">folder</span>
            </div>
            <div className="text-center">{folderName}</div>
          </div>
        ))}
        {files.map((file) => (
          <div
            key={file.name}
            className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
          >
            <div className="text-center">
              <span class="material-symbols-outlined">description</span>
            </div>
            <div className="text-center hover:underline">
              <a href={file.url} target="_blank">
                {file.name}
              </a>
            </div>
            <Button
              variant="text"
              color="red"
              onClick={() => handelDelte(file)}
            >
              <span class="material-symbols-outlined">delete</span>
            </Button>
            <Button variant="text" onClick={() => copyToClipboard(file)}>
              {copied ? (
                <span class="material-symbols-outlined">check</span>
              ) : (
                <span class="material-symbols-outlined">content_copy</span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
