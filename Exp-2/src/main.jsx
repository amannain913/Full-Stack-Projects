import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import {configureStore, createSlice} from "@reduxjs/toolkit";
import {Provider, useDispatch, useSelector} from "react-redux";
import "./styles.css";

const postsSlice=createSlice({
 name:"posts",
 initialState:{byId:{p1:{id:"p1",text:"Welcome to the campaign!",platforms:["X","LinkedIn"],status:"Draft"}},allIds:["p1"],draft:""},
 reducers:{
  addPost:(s,a)=>{const id="p"+Date.now();s.byId[id]={id,text:a.payload.text,platforms:a.payload.platforms,status:"Draft"};s.allIds.push(id)},
  deletePost:(s,a)=>{delete s.byId[a.payload];s.allIds=s.allIds.filter(id=>id!==a.payload)},
  setDraft:(s,a)=>{s.draft=a.payload}
 }
});
const platformsSlice=createSlice({name:"platforms",initialState:{all:["X","Instagram","LinkedIn"],selected:["X"]},reducers:{toggle:(s,a)=>{s.selected=s.selected.includes(a.payload)?s.selected.filter(x=>x!==a.payload):[...s.selected,a.payload]}}});
const store=configureStore({reducer:{posts:postsSlice.reducer,platforms:platformsSlice.reducer}});
const {addPost,deletePost,setDraft}=postsSlice.actions; const {toggle}=platformsSlice.actions;

function App(){
 const dispatch=useDispatch(), posts=useSelector(s=>s.posts), ps=useSelector(s=>s.platforms); const [notice,setNotice]=useState("");
 const submit=()=>{if(!posts.draft.trim()||!ps.selected.length){setNotice("Enter a post and select at least one platform.");return}dispatch(addPost({text:posts.draft,platforms:ps.selected}));dispatch(setDraft(""));setNotice("Post added to centralized Redux state.")};
 return <main className="page"><header><span>Experiment 1.2.1</span><h1>Redux Content Manager</h1><p>Single source of truth for posts, platforms and drafts.</p></header>
 <section className="layout"><div className="card"><h2>Create draft</h2><textarea value={posts.draft} onChange={e=>dispatch(setDraft(e.target.value))} placeholder="Write a post..." />
 <h3>Platforms</h3><div className="chips">{ps.all.map(p=><button className={ps.selected.includes(p)?"chip on":"chip"} onClick={()=>dispatch(toggle(p))} key={p}>{p}</button>)}</div>
 <button className="primary" onClick={submit}>Add Post</button>{notice&&<p className="notice">{notice}</p>}</div>
 <div className="card"><div className="row"><h2>Normalized Posts</h2><b>{posts.allIds.length} total</b></div>{posts.allIds.map(id=>{const p=posts.byId[id];return <article key={id}><div><b>{p.text}</b><small>{p.platforms.join(" • ")} · {p.status}</small></div><button className="danger" onClick={()=>dispatch(deletePost(id))}>Delete</button></article>})}</div></section>
 <div className="state"><b>Redux state</b><code>{JSON.stringify({posts,platforms:ps},null,2)}</code></div></main>
}
createRoot(document.getElementById("root")).render(<Provider store={store}><App/></Provider>);
