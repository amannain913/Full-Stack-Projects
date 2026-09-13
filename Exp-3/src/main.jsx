import React,{useState,useEffect} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter,useNavigate,useLocation,Routes,Route,Link,Navigate} from "react-router-dom";
import "./styles.css";

const users={admin:{password:"admin123",role:"Admin"},editor:{password:"editor123",role:"Editor"},viewer:{password:"viewer123",role:"Viewer"}};
const encode=(obj)=>btoa(JSON.stringify(obj));
const decode=(token)=>{try{return JSON.parse(atob(token))}catch{return null}};
function Protected({roles,children}){const token=localStorage.getItem("demo_jwt"),u=decode(token);if(!u)return <Navigate to="/login" replace/>;if(roles&&!roles.includes(u.role))return <Navigate to="/forbidden" replace/>;return children}
function Nav(){const u=decode(localStorage.getItem("demo_jwt"));const nav=useNavigate();return <nav><b>SecureHub</b><div>{u&&<><span className="role">{u.role}</span><Link to="/">Dashboard</Link><Link to="/admin">Admin</Link><button onClick={()=>{localStorage.removeItem("demo_jwt");nav("/login")}}>Logout</button></>}</div></nav>}
function Login() {
  const nav = useNavigate();

  const loginAs = (name) => {
    const u = users[name];

    const token = encode({
      sub: name,
      role: u.role,
      iat: Date.now(),
      exp: Date.now() + 3600000
    });

    localStorage.setItem("demo_jwt", token);
    nav("/");
  };

  return (
    <div className="center">
      <div className="login">
        <span className="badge">Experiment 1.3.1</span>

        <h1>Choose Login</h1>

        <p>
          Select a demo role to continue.
          No username or password required.
        </p>

        <div className="login-options">

          <button
            className="role-login admin"
            onClick={() => loginAs("admin")}
          >
            <strong>👑 Login as Admin</strong>
            <small>Full access</small>
          </button>

          <button
            className="role-login editor"
            onClick={() => loginAs("editor")}
          >
            <strong>✏️ Login as Editor</strong>
            <small>Content management access</small>
          </button>

          <button
            className="role-login viewer"
            onClick={() => loginAs("viewer")}
          >
            <strong>👁️ Login as Viewer</strong>
            <small>View-only access</small>
          </button>

        </div>

        <div className="demo-note">
          JWT authentication and role-based access are demonstrated
          automatically after selecting a role.
        </div>
      </div>
    </div>
  );
}
function Dashboard(){const u=decode(localStorage.getItem("demo_jwt"));return <main className="page"><span className="badge">Authenticated</span><h1>Dashboard</h1><p>Welcome, <b>{u.sub}</b>. Your role is <b>{u.role}</b>.</p><section className="cards"><div><h3>JWT</h3><p>Stateless client-side token demo with claims and expiry.</p></div><div><h3>Authorization</h3><p>Route access is evaluated from the role claim.</p></div><div><h3>Session</h3><p>Refresh the page: the token persists in localStorage.</p></div></section><div className="token"><b>Decoded claims</b><pre>{JSON.stringify(u,null,2)}</pre></div></main>}
function Admin(){const u=decode(localStorage.getItem("demo_jwt"));return <main className="page"><span className="badge">RBAC</span><h1>Admin Console</h1><p>Only Admin and Editor users can access this route.</p><div className="cards"><div><h3>Users</h3><p>Admin can manage users.</p></div><div><h3>Publishing</h3><p>Editor can create and update content.</p></div></div><p className="rolebox">Current permission level: {u.role}</p></main>}
function Forbidden(){return <main className="page"><h1>403 — Access denied</h1><p>Your role does not have permission to open this resource.</p><Link to="/">Return to dashboard</Link></main>}
function App(){return <><Nav/><Routes><Route path="/login" element={<Login/>}/><Route path="/" element={<Protected><Dashboard/></Protected>}/><Route path="/admin" element={<Protected roles={["Admin","Editor"]}><Admin/></Protected>}/><Route path="/forbidden" element={<Forbidden/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></>}
createRoot(document.getElementById("root")).render(<BrowserRouter><App/></BrowserRouter>);
