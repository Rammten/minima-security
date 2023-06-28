import styles from "./Dialog.module.css";
import Button from "../../../UI/Button";
import { useAuth } from "../../../../providers/authProvider";
import PERMISSIONS from "../../../../permissions";
import { useContext } from "react";
import { appContext } from "../../../../AppContext";

interface IProps {
  host: string;
  cancel: () => void;
}
const ConfirmationDialog = ({ host, cancel }: IProps) => {
  const { authNavigate } = useAuth();
  const { setBackgroundProcess } = useContext(appContext);

  const handleResync = () => {
    try {
      (window as any).MDS.cmd(
        `archive action:resync host:${host.length ? host : "auto"}`,
        (response: any) => {
          // console.log(response);
          if (!response.status) {
            throw new Error(
              response.error
                ? response.error
                : "Something went wrong, please try again."
            );
          }
          setBackgroundProcess("Resyncing");
          return authNavigate("/dashboard/resyncing", [
            PERMISSIONS.CAN_VIEW_RESYNCING,
          ]);
        }
      );
    } catch (error: any) {
      console.error(error);
      return authNavigate("/dashboard/resyncing", [
        PERMISSIONS.CAN_VIEW_RESYNCING,
        {
          state: { error: error.message },
        },
      ]);
    }
  };

  return (
    <div className="grid">
      <div className={styles["dialog"]}>
        <div className="flex flex-col align-center">
          <h1 className="text-2xl mb-8">Re-sync your node?</h1>

          <p className="mb-8">
            The full chain will be downloaded from your chosen archive node.
            <br /> <br />
            This action irreversible, consider taking a backup before starting
            re-sync.
            <br /> <br />
            This process should take up to 2 hours to complete but could take
            longer. <br />
            Please connect your device to a power source before continuing.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className={`${styles.primaryActions}`}>
            <Button onClick={handleResync}>Start re-sync</Button>
          </div>
          <div className={`${styles.desktop_only} ${styles.secondaryActions}`}>
            <Button onClick={cancel}>Cancel</Button>
          </div>
        </div>
      </div>

      <div
        className={`${styles.actions} ${styles.mobile_only} ${styles.secondaryActions}`}
      >
        <Button onClick={cancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default ConfirmationDialog;