import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const fetchProjects = () => {
    API.get("/projects")
      .then(res => setProjects(res.data))
      .catch(() => toast.error("Error loading projects"));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async () => {
    if (!name.trim()) {
      return toast.warning("Project name cannot be empty");
    }

    try {
      await API.post("/projects", { name });

      toast.success("Project created");
      setName("");
      fetchProjects();
    } catch {
      toast.error("Failed to create project");
    }
  };

  const updateProject = async () => {
    if (!name.trim()) return toast.warning("Enter name");

    try {
      await API.put(`/projects/${editId}`, { name });

      toast.success("Project updated");
      setEditId(null);
      setName("");
      fetchProjects();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`);

      toast.success("Project deleted");
      fetchProjects();
    } catch {
      toast.error("Delete failed");
    }
  };

  const startEdit = (project) => {
    setEditId(project._id);
    setName(project.name);
  };

  return (
    <div style={styles.container}>

      {/* 🔥 TOP NAV */}
      <div style={styles.topbar}>
        <button style={styles.navBtn} onClick={() => navigate(-1)}>
          ⬅ Back
        </button>

        <h2 style={styles.title}>Projects</h2>

        <button style={styles.navBtn} onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
      </div>

      {/* 🔥 CREATE / EDIT */}
      <div style={styles.createBox}>
        <input
          style={styles.input}
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {editId ? (
          <button style={styles.updateBtn} onClick={updateProject}>
            Update
          </button>
        ) : (
          <button style={styles.button} onClick={createProject}>
            Create
          </button>
        )}
      </div>

      {/* 🔥 LIST */}
      {projects.length === 0 ? (
        <p style={styles.empty}>No projects</p>
      ) : (
        projects.map(p => (
          <div key={p._id} style={styles.card}>
            <h3>{p.name}</h3>

            <div style={styles.actions}>
              <button
                style={styles.editBtn}
                onClick={() => startEdit(p)}
              >
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteProject(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "20px"
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },

  title: {
    color: "#ff2e2e"
  },

  navBtn: {
    background: "#222",
    color: "#fff",
    border: "1px solid #333",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "6px"
  },

  createBox: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px"
  },

  input: {
    padding: "10px",
    width: "250px",
    background: "#111",
    border: "1px solid #333",
    color: "#fff"
  },

  button: {
    background: "#ff2e2e",
    color: "#fff",
    border: "none",
    padding: "10px"
  },

  updateBtn: {
    background: "#00aaff",
    color: "#fff",
    border: "none",
    padding: "10px"
  },

  empty: {
    textAlign: "center"
  },

  card: {
    background: "#111",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px"
  },

  actions: {
    marginTop: "10px",
    display: "flex",
    gap: "10px"
  },

  editBtn: {
    background: "#ffaa00",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer"
  },

  deleteBtn: {
    background: "#ff0000",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer"
  }
};