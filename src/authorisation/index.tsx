import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../providers/authProvider";

interface IProps {
  permissions: string[];
}
const Authorisation = ({ permissions }: IProps) => {
  const { permissions: userPermissions } = useAuth();

  const isAllowed = permissions.some((allowed: string) =>
    userPermissions.includes(allowed)
  );

  return isAllowed ? <Outlet /> : <Navigate to="/dashboard" replace={true} />;
};

export default Authorisation;
