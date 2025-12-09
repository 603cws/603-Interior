import { useApp } from "../Context/Context";
import PageNotFound from "../common-components/PageNotFound";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) return <PageNotFound />;

  return isAuthenticated && children;
}

export default PrivateRoute;
