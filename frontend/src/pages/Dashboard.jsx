import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login first");
      navigate("/");
      return;
    }

    API.get("/dashboard")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);

        if (err.response?.status === 401) {
          toast.error("Session expired, please login again");
          localStorage.clear();
          navigate("/");
        } else {
          toast.error("Failed to load dashboard");
        }
      });
  }, []);

  const goToProjects = () => {
    navigate("/projects");
  };

  const goToTasks = () => {
    navigate("/tasks");
  };

  const logout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* 🔥 TOP BAR */}
      <div style={styles.topbar}>
        <h2 style={styles.title}>Dashboard</h2>

        <div>
          {user?.role === "Admin" && (
            <button style={styles.navBtn} onClick={goToProjects}>
              Projects
            </button>
          )}

          <button style={styles.navBtn} onClick={goToTasks}>
            Tasks
          </button>

          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 STATS */}
      <div style={styles.grid}>

        <div style={styles.card}>
          <h3>Total Tasks</h3>
          <p style={styles.value}>{data.totalTasks || 0}</p>
        </div>

        <div style={styles.card}>
          <h3>Completed</h3>
          <p style={{ ...styles.value, color: "#00ff99" }}>
            {data.completedTasks || 0}
          </p>
        </div>

        <div style={styles.card}>
          <h3>Pending</h3>
          <p style={{ ...styles.value, color: "#ffaa00" }}>
            {data.pendingTasks || 0}
          </p>
        </div>

        <div style={styles.card}>
          <h3>Overdue</h3>
          <p style={{ ...styles.value, color: "#ff2e2e" }}>
            {data.overdueTasks || 0}
          </p>
        </div>

      </div>

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #000, #1a1a1a)",
    padding: "20px",
    color: "#fff"
  },

  loading: {
    color: "#fff",
    textAlign: "center",
    marginTop: "100px"
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },

  title: {
    color: "#ff2e2e"
  },

  navBtn: {
    marginRight: "10px",
    padding: "8px 12px",
    background: "#222",
    color: "#fff",
    border: "1px solid #333",
    cursor: "pointer"
  },

  logoutBtn: {
    padding: "8px 12px",
    background: "#ff2e2e",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#111",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 0 15px rgba(255,0,0,0.2)"
  },

  value: {
    fontSize: "28px",
    marginTop: "10px",
    fontWeight: "bold"
  }
};