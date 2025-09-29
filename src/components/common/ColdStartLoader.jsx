import { useEffect, useState } from "react";

export default function ColdStartLoader() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("正在喚醒伺服器");

  useEffect(() => {
    // 模擬進度條效果
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        // 進度越高，增長越慢
        const increment = prev < 40 ? 2 : 1;
        return Math.min(prev + increment, 95);
      });
    }, 200);

    // 更新提示訊息
    const messageTimer = setTimeout(() => {
      setMessage("伺服器啟動中");
    }, 8000);

    const messageTimer2 = setTimeout(() => {
      setMessage("即將完成");
    }, 18000);

    return () => {
      clearInterval(interval);
      clearTimeout(messageTimer);
      clearTimeout(messageTimer2);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Logo 動畫 */}
        <div style={styles.logoWrapper}>
          <svg
            width="150px"
            height="75px"
            viewBox="0 0 187.3 93.7"
            preserveAspectRatio="xMidYMid meet"
            style={styles.logo}
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#d0a2f7", stopOpacity: 1 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#f1eaff", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#645caa", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <path
              id="outline"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 -8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
              style={styles.path}
            />
          </svg>

          {/* 光暈效果 */}
          <div style={styles.glow} />
        </div>

        {/* 文字訊息 */}
        <div style={styles.textWrapper}>
          <h1 style={styles.title}>{message}</h1>
          <p style={styles.subtitle}>首次啟動需要一些時間</p>
        </div>

        {/* 進度條 */}
        <div style={styles.progressWrapper}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            >
              {/* 光澤效果 */}
              <div style={styles.shimmer} />
            </div>
          </div>

          {/* 進度百分比 */}
          <div style={styles.progressInfo}>
            <span>載入中</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* 跳動點點 */}
        <div style={styles.dotsWrapper}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                ...styles.dot,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes dash {
          0% {
            stroke-dashoffset: 300;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -300;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(135deg, #f5f3ff 0%, #ffffff 50%, #eef2ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
    padding: "0 1.5rem",
  },
  logoWrapper: {
    position: "relative",
  },
  logo: {
    animation: "pulse 2s ease-in-out infinite",
  },
  path: {
    strokeDasharray: "300",
    strokeDashoffset: "300",
    animation: "dash 2s ease-in-out infinite",
  },
  glow: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    background: "rgba(168, 85, 247, 0.2)",
    borderRadius: "50%",
    filter: "blur(30px)",
    animation: "glowPulse 2s ease-in-out infinite",
    pointerEvents: "none",
  },
  textWrapper: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: 500,
    color: "#581c87",
    margin: 0,
    transition: "all 0.5s ease",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "rgba(147, 51, 234, 0.7)",
    margin: 0,
  },
  progressWrapper: {
    width: "320px",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  progressBar: {
    height: "8px",
    background: "#e9d5ff",
    borderRadius: "9999px",
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #c084fc 0%, #a855f7 50%, #6366f1 100%)",
    borderRadius: "9999px",
    transition: "width 0.3s ease-out",
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
    animation: "shimmer 2s infinite",
  },
  progressInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.75rem",
    color: "rgba(147, 51, 234, 0.6)",
  },
  dotsWrapper: {
    display: "flex",
    gap: "0.5rem",
  },
  dot: {
    width: "8px",
    height: "8px",
    background: "#c084fc",
    borderRadius: "50%",
    animation: "bounce 0.6s ease-in-out infinite",
  },
};
