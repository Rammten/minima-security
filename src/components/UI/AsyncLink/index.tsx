import { useEffect, useState } from "react";
import * as fileManager from "../../../__minima__/libs/fileManager";

interface IProps {
  // ref: RefObject<HTMLAnchorElement>;
  file: string;
  children: any;
  onClick: () => void;
  name: string;
}
const AsyncLink = ({ file, name, children, onClick }: IProps) => {
  const [href, setHref] = useState("");

  const createDownloadLink = async (mdsfile: string) => {
    try {
      const hexstring = await fileManager.loadBinaryToHex(mdsfile);
      await fileManager.saveFileAsBinary(mdsfile, hexstring);
      const filedata = hexstring;
      const b64 = (window as any).MDS.util.hexToBase64(filedata);
      const binaryData = (window as any).MDS.util.base64ToArrayBuffer(b64);
      const blob = new Blob([binaryData], {
        type: "application/octet-stream",
      });

      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      return "";
    }
  };

  useEffect(() => {
    createDownloadLink(file).then((url) => {
      setHref(url);
    });
  }, [file]);

  return (
    <a onClick={onClick} download={name} href={href}>
      {children}
    </a>
  );
};

export default AsyncLink;