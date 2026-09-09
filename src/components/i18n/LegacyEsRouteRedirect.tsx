import { useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Strip legacy `/es` URL prefixes from the previous locale-in-path experiment. */
export function LegacyEsRouteRedirect() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (pathname === "/es") {
      navigate("/", { replace: true });
      return;
    }

    if (pathname.startsWith("/es/")) {
      navigate(pathname.slice(3), { replace: true });
    }
  }, [navigate, pathname]);

  return null;
}
