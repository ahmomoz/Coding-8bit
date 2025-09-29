import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes";
import { Suspense } from "react";

import Loader from "./components/common/Loader";
import ColdStartLoader from "./components/common/ColdStartLoader";

function App() {
  const [serverReady, setServerReady] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // 檢查是否是第一次訪問
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
      // 不是第一次，直接設定為準備好
      setIsFirstVisit(false);
      setServerReady(true);
    } else {
      setServerReady(false);
      
      // 第一次訪問，執行暖機 API
      fetch(`${import.meta.env.VITE_API_BASE}/hearts/`)
        .then(() => {
          setServerReady(true);
          sessionStorage.setItem('hasVisited', 'true');
        })
        .catch(() => {
          setServerReady(true);
          sessionStorage.setItem('hasVisited', 'true');
        });
    }
  }, []);

  // 只在第一次訪問且伺服器未準備好時顯示暖機畫面
  if (isFirstVisit && !serverReady) {
    return <ColdStartLoader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;