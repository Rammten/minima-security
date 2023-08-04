import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import * as fM from "../__minima__/libs/fileManager";

export interface Archive {
  first: string;
  last: string;
  size: number;
}
interface IArchiveContext {
  context?: "restore" | "seedresync" | "chainresync" | "resync";
  setContext: Dispatch<
    SetStateAction<
      "restore" | "seedresync" | "chainresync" | "resync" | undefined
    >
  >;
  lastUploadPath?: string;
  resetArchiveContext: () => void;
  deleteLastUploadedArchive: (archivefile: string) => Promise<void>;
  userWantsToArchiveReset: boolean;
  archiveFileToUpload?: File;
  setArchiveFileToUpload: Dispatch<SetStateAction<File | undefined>>;
  archive?: Archive;
  setArchive: Dispatch<SetStateAction<Archive | undefined>>;
  checkArchiveIntegrity: (path: string) => Promise<Archive>;
}

const ArchiveContext = createContext<IArchiveContext | undefined>(undefined);

export const ArchiveProvider = ({ children }) => {
  const [archiveFileToUpload, setArchiveFileToUpload] = useState<
    undefined | File
  >(undefined);
  const [lastUploadPath, setLastUploadPath] = useState<string | undefined>("");
  const [archive, setArchive] = useState<Archive | undefined>(undefined);
  const [context, setContext] = useState<
    "restore" | "seedresync" | "chainresync" | "resync" | undefined
  >(undefined);

  /**
   * Reset the context back to default vals
   */
  const resetArchiveContext = () => {
    setArchive(undefined);
    setContext(undefined);
    setLastUploadPath(undefined);
    setArchiveFileToUpload(undefined);
  };

  /**
   *
   * @param archivefile
   */
  const deleteLastUploadedArchive = async (archivefile: string) => {
    await fM.deleteFile(archivefile);
  };

  /**
   *
   * @param path (relative path of minima folder)
   * @returns an Archive object
   */
  const checkArchiveIntegrity = async (path: string): Promise<Archive> => {
    const fullPath = await fM.getPath(path);

    return new Promise((resolve, reject) => {
      (window as any).MDS.cmd(
        `archive action:inspect file:"${fullPath}"`,
        async function (resp) {
          if (!resp.status) {
            // no good.. get rid of it
            deleteLastUploadedArchive(path);
            reject(resp.error ? resp.error : "Checking integrity RPC failed.");
          }
          if (resp.status) {
            // set the last successful archive file path to use down the line
            setLastUploadPath(fullPath);

            resolve(resp.response.archive);
          }
        }
      );
    });
  };
  return (
    <ArchiveContext.Provider
      value={{
        userWantsToArchiveReset: archiveFileToUpload !== undefined,
        context,
        setContext,
        resetArchiveContext,
        deleteLastUploadedArchive,
        lastUploadPath,
        archiveFileToUpload,
        setArchiveFileToUpload,
        archive,
        setArchive,
        checkArchiveIntegrity,
      }}
    >
      {" "}
      {children}
    </ArchiveContext.Provider>
  );
};

export const useArchiveContext = () => {
  const archiveContext = useContext(ArchiveContext);

  if (archiveContext === undefined) {
    throw new Error("useArchiveContext must be inside a provider");
  }

  return archiveContext;
};