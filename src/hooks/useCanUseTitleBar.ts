import { useState, useEffect } from "react";

const useCanUseTitleBar = () => {
  const [isMinimaBrowser, setAndroidInternalBrowser] = useState(false);

  const openTitleBar = () => {
    if (!isMinimaBrowser) return;
    // @ts-ignore
    Android.showTitleBar();
  };

  useEffect(() => {
    if ((window as any).navigator?.userAgent?.includes("Minima Browser")) {
      setAndroidInternalBrowser(true);
    }
  }, []);

  return openTitleBar;
};

export default useCanUseTitleBar;
