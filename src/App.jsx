import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes";
import { Suspense } from "react";

import Loader from "./components/common/Loader";
import ColdStartLoader from "./components/common/ColdStartLoader";

function App() {
  const [isFirstVisit, setIsFirstVisit] = useState(() =>
    !sessionStorage.getItem('hasVisited')
  );
  const [serverReady, setServerReady] = useState(() =>
    sessionStorage.getItem('hasVisited') ? true : false
  );

  useEffect(() => {
    // 只在第一次訪問時執行暖機 API
    if (isFirstVisit) {
      fetch(`${import.meta.env.VITE_API_BASE}/hearts/`)
        .then(() => {
          setServerReady(true);
          setIsFirstVisit(false);
          sessionStorage.setItem('hasVisited', 'true');
        })
        .catch(() => {
          setServerReady(true);
          setIsFirstVisit(false);
          sessionStorage.setItem('hasVisited', 'true');
        });
    }
  }, [isFirstVisit]);

  // 只在第一次訪問且伺服器未準備好時顯示暖機畫面
  if (isFirstVisit && !serverReady) {
    return <ColdStartLoader />;
  }

  return (
    <Suspense fallback={isFirstVisit ? <ColdStartLoader /> : null}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;