import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (isSignup && !name)) {
      return toast.warning("Please fill all fields");
    }

    try {
      setLoading(true);

      if (isSignup) {
        await API.post("/auth/signup", {
          name,
          email,
          password,
          role: "Member"
        });

        toast.success("Signup successful! Please login.");
        setIsSignup(false);

      } else {
        const res = await API.post("/auth/login", {
          email,
          password
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Login successful 🚀");

        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      }

    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>

      {/* LEFT SIDE */}
      <div style={styles.left}>
        <h1 style={styles.logo}>Task Manager</h1>
        <p style={styles.tagline}>
          Manage projects, assign tasks & track progress efficiently 🚀
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.card}>

        <h2 style={styles.title}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <p style={styles.subtitle}>
          {isSignup ? "Signup to continue" : "Login to your account"}
        </p>

        {isSignup && (
          <input
            style={styles.input}
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          style={styles.input}
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleAuth}>
          {loading ? "Please wait..." : isSignup ? "Signup" : "Login"}
        </button>

        <p style={styles.toggle}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span style={styles.link} onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Login" : " Signup"}
          </span>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    background: "linear-gradient(135deg, #000, #1a1a1a)",
    color: "#fff"
  },

  left: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    textAlign: "center",

    // 🔥 subtle divider (no white line)
    boxShadow: "inset -1px 0 0 rgba(255,255,255,0.05)"
  },

  logo: {
    fontSize: "42px",
    color: "#ff2e2e",
    marginBottom: "10px"
  },

  tagline: {
    color: "#aaa",
    maxWidth: "300px"
  },

  card: {
    width: "400px",
    margin: "auto",
    padding: "40px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 30px rgba(255,0,0,0.2)",
    textAlign: "center"
  },

  title: {
    color: "#ff2e2e",
    marginBottom: "10px"
  },

  subtitle: {
    color: "#aaa",
    marginBottom: "25px"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#000",
    color: "#fff",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(45deg, #ff0000, #990000)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s"
  },

  toggle: {
    marginTop: "15px",
    color: "#aaa"
  },

  link: {
    color: "#ff2e2e",
    cursor: "pointer",
    marginLeft: "5px",
    fontWeight: "bold"
  }
};