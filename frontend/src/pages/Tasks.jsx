import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [project, setProject] = useState("");

  const navigate = useNavigate();

  // ================= FETCH DATA =================
  const fetchTasks = () => {
    API.get("/tasks")
      .then((res) => setTasks(res.data))
      .catch(() => toast.error("Error loading tasks"));
  };

  const fetchUsers = () => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  };

  const fetchProjects = () => {
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .catch(() => toast.error("Failed to load projects"));
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchProjects();
  }, []);

  // ================= CREATE TASK =================
  const createTask = async () => {
    if (!title.trim()) {
      return toast.warning("Task title cannot be empty");
    }

    try {
      await API.post("/tasks", {
        title: title,
        assignedTo: assignedTo || null,
        project: project || null,
      });

      toast.success("Task created successfully");

      setTitle("");
      setAssignedTo("");
      setProject("");

      fetchTasks();
    } catch (err) {
      console.log("CREATE ERROR:", err);
      toast.error("Failed to create task");
    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status: status });

      toast.info(`Task marked as ${status}`);
      fetchTasks();
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      toast.error("Failed to update task");
    }
  };

  // ================= UI =================
  return (
    <div style={styles.container}>
      {/* TOP NAV */}
      <div style={styles.topbar}>
        <button style={styles.navBtn} onClick={() => navigate(-1)}>
          ⬅ Back
        </button>

        <h2 style={styles.title}>Tasks</h2>

        <button style={styles.navBtn} onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
      </div>

      {/* CREATE TASK */}
      <div style={styles.createBox}>
        <input
          style={styles.input}
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          style={styles.input}
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          value={project}
          onChange={(e) => setProject(e.target.value)}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <button style={styles.button} onClick={createTask}>
          Add
        </button>
      </div>

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <p style={styles.empty}>No tasks available</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} style={styles.card}>
            <h4>{task.title}</h4>
            <p>Status: {task.status}</p>

            <p>Assigned To: {task.assignedTo?.name || "None"}</p>
            <p>Project: {task.project?.name || "None"}</p>

            <div style={styles.actions}>
              <button
                style={styles.pendingBtn}
                onClick={() => updateStatus(task._id, "Pending")}
              >
                Pending
              </button>

              <button
                style={styles.progressBtn}
                onClick={() => updateStatus(task._id, "In Progress")}
              >
                In Progress
              </button>

              <button
                style={styles.doneBtn}
                onClick={() => updateStatus(task._id, "Completed")}
              >
                Done
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "20px",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    color: "#ff2e2e",
  },

  navBtn: {
    background: "#222",
    color: "#fff",
    border: "1px solid #333",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "6px",
  },

  createBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  input: {
    padding: "10px",
    width: "200px",
    background: "#111",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "6px",
  },

  button: {
    background: "linear-gradient(45deg, #ff0000, #990000)",
    color: "#fff",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "6px",
  },

  empty: {
    textAlign: "center",
    color: "#aaa",
  },

  card: {
    background: "#111",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(255,0,0,0.2)",
  },

  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  pendingBtn: {
    background: "#ffaa00",
    color: "#000",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "6px",
  },

  progressBtn: {
    background: "#00aaff",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "6px",
  },

  doneBtn: {
    background: "#00ff99",
    color: "#000",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "6px",
  },
};