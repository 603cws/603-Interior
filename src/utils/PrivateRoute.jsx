import { useApp } from "../Context/Context";
import PageNotFound from "../common-components/PageNotFound";

function PrivateRoute({ children }) {
  const { isAuthenticated, accountHolder } = useApp();

  //if not authenticated
  if (!isAuthenticated) return <PageNotFound />;

  //   return the children
  return isAuthenticated && children;
}

export default PrivateRoute;
