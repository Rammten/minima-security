import styles from "./Dialog.module.css";
import Button from "../../UI/Button";
import { useLocation, useNavigate } from "react-router-dom";

import Lottie from "lottie-react";
import Loading from "../../../assets/loading.json";
import Logs from "../../Logs";
import { useEffect, useState } from "react";
import { useArchiveContext } from "../../../providers/archiveProvider";

const ResyncDialog = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState<false | string>(false);

  const { userWantsToArchiveReset, setContext } = useArchiveContext();

  useEffect(() => {
    if (!userWantsToArchiveReset) {
      setContext("resync");
    }

    if (location.state && "error" in location.state) {
      setError(location.state.error);
    }
  }, [location]);

  return (
    <div className="grid">
      <div className={styles["dialog"]}>
        <div className="flex flex-col align-center">
          {!error && (
            <>
              <Lottie
                className="mb-4"
                style={{ width: 40, height: 40, alignSelf: "center" }}
                animationData={Loading}
              />
              <h1 className="text-2xl mb-8">Re-syncing</h1>

              <p className="mb-8">
                Please don’t leave this screen whilst the chain is re-syncing.
                <br /> <br />
                Your node will reboot once it is complete.
              </p>

              <Logs />
            </>
          )}

          {!!error && (
            <>
              <svg
                className="mb-4 inline self-center"
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_594_13339"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="64"
                  height="64"
                >
                  <rect width="64" height="64" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_594_13339)">
                  <path
                    d="M31.9998 44.6151C32.61 44.6151 33.1216 44.4087 33.5344 43.9959C33.9472 43.5831 34.1536 43.0715 34.1536 42.4613C34.1536 41.851 33.9472 41.3395 33.5344 40.9267C33.1216 40.5139 32.61 40.3075 31.9998 40.3075C31.3895 40.3075 30.878 40.5139 30.4652 40.9267C30.0524 41.3395 29.846 41.851 29.846 42.4613C29.846 43.0715 30.0524 43.5831 30.4652 43.9959C30.878 44.4087 31.3895 44.6151 31.9998 44.6151ZM29.9998 34.8716H33.9997V18.8716H29.9998V34.8716ZM32.0042 57.333C28.5004 57.333 25.207 56.6682 22.124 55.3384C19.0409 54.0086 16.3591 52.2039 14.0785 49.9244C11.7979 47.6448 9.99239 44.9641 8.66204 41.8824C7.33168 38.8008 6.6665 35.5081 6.6665 32.0042C6.6665 28.5004 7.33139 25.207 8.66117 22.124C9.99095 19.0409 11.7956 16.3591 14.0752 14.0785C16.3548 11.7979 19.0354 9.9924 22.1171 8.66204C25.1987 7.33168 28.4915 6.6665 31.9953 6.6665C35.4991 6.6665 38.7926 7.3314 41.8756 8.66117C44.9586 9.99095 47.6405 11.7956 49.921 14.0752C52.2017 16.3548 54.0072 19.0354 55.3375 22.1171C56.6679 25.1988 57.333 28.4915 57.333 31.9953C57.333 35.4991 56.6682 38.7925 55.3384 41.8756C54.0086 44.9586 52.2039 47.6405 49.9244 49.921C47.6448 52.2017 44.9641 54.0072 41.8824 55.3375C38.8008 56.6679 35.5081 57.333 32.0042 57.333Z"
                    fill="#F4F4F5"
                  />
                </g>
              </svg>

              <h1 className="text-2xl mb-8">Re-syncing failed.</h1>

              <p className="mb-8">{error}</p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className={`${styles.desktop_only} ${styles.secondaryActions}`}>
            {error && (
              <Button
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        className={`${styles.actions} ${styles.mobile_only} ${styles.secondaryActions}`}
      >
        {error && (
          <Button
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResyncDialog;
