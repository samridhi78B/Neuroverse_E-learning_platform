import { useState } from 'react';
import { Btn, CodeBlock, StepCompleteBanner } from './UIComponents';
import { QUERY_CHIPS } from './questData';

function StudentTable() {
  const [selRow,setSelRow]=useState(null);
  const rows=[["001","Arjun Sharma","16","10th","Delhi"],["002","Priya Singh","15","9th","Mumbai"],["003","Rahul Gupta","17","11th","Ludhiana"],["004","Neha Patel","16","10th","Ahmedabad"]];
  return (
    <div style={{border:"2px solid #2e3347",borderRadius:16,overflow:"hidden",margin:"20px 0",boxShadow:"0 3px 10px rgba(0,0,0,.3)"}}>
      <div style={{background:"#0f1a2e",borderBottom:"2px solid #2e3347",padding:"12px 20px",fontFamily:"'Nunito',sans-serif",fontSize:13,color:"#60a5fa",fontWeight:800}}> students — click any row to highlight it!</div>
      <table className="tbl-hover" style={{width:"100%",borderCollapse:"collapse",background:"#1e2130"}}>
        <thead><tr>{[" student_id","name","age","grade","city"].map(h=><th key={h} style={{background:"#161926",padding:"10px 16px",fontFamily:"'Nunito',sans-serif",fontSize:11,color:"#7c8499",textTransform:"uppercase",letterSpacing:.5,borderBottom:"2px solid #2e3347",textAlign:"left",fontWeight:800}}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} onClick={()=>setSelRow(i)} style={{cursor:"pointer"}}>
              {r.map((cell,j)=><td key={j} style={{padding:"11px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:selRow===i?"#60a5fa":j===0?"#3b82f6":"#c4bdb4",background:selRow===i?"#0f1a2e":"transparent",borderBottom:"1px solid #252a3a",transition:"all .15s",fontWeight:selRow===i?700:400}}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────── QUERY BUILDER GAME ─────────────── */
function QueryBuilderGame() {
  const [pool,setPool]=useState(QUERY_CHIPS.map((_,i)=>i));
  const [zone,setZone]=useState([]);
  const [result,setResult]=useState(null);
  const [dragOver,setDragOver]=useState(false);
  const move = (id) => {
    if (zone.includes(id)){setZone(z=>z.filter(x=>x!==id));setPool(p=>[...p,id]);}
    else{setPool(p=>p.filter(x=>x!==id));setZone(z=>[...z,id]);}
  };
  const check = () => {
    const labels = zone.map(i=>QUERY_CHIPS[i].label);
    const correct = ["SELECT","*","FROM","students","WHERE","city = 'Ludhiana'"];
    const ok = JSON.stringify(labels.slice(0,6))===JSON.stringify(correct);
    setResult(ok);
  };
  const reset = () => {setPool(QUERY_CHIPS.map((_,i)=>i));setZone([]);setResult(null);};
  return (
    <div style={{border:"2px solid #2e3347",borderRadius:20,background:"#1e2130",padding:28,margin:"28px 0",boxShadow:"0 4px 16px rgba(0,0,0,.35)"}}>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:"#60a5fa",marginBottom:12,display:"flex",alignItems:"center",gap:8}}> Query Builder Game</div>
      <p style={{color:"#9ba3b8",fontSize:14,marginBottom:14,fontWeight:600}}>Click chips to move them. Build: <strong style={{color:"#e8e0d5"}}>SELECT * FROM students WHERE city = 'Ludhiana'</strong></p>
      <div style={{fontSize:11,color:"#7c8499",fontWeight:600,marginBottom:8,fontFamily:"'JetBrains Mono',monospace"}}>AVAILABLE PIECES:</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,padding:12,background:"#0f1117",border:"2px dashed #3d4460",borderRadius:12,minHeight:52,marginBottom:12}}>
        {pool.map(i=><div key={i} className={`drag-chip ${QUERY_CHIPS[i].cls}`} onClick={()=>move(i)}>{QUERY_CHIPS[i].label}</div>)}
      </div>
      <div style={{fontSize:11,color:"#7c8499",fontWeight:600,marginBottom:6,fontFamily:"'JetBrains Mono',monospace"}}>BUILD YOUR QUERY:</div>
      <div className={`drag-zone ${dragOver?"over":""}`} onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);}}>
        {zone.map(i=><div key={i} className={`drag-chip ${QUERY_CHIPS[i].cls}`} onClick={()=>move(i)}>{QUERY_CHIPS[i].label}</div>)}
        {zone.length===0&&<span style={{color:"#7c8499",fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>Click pieces above to add them here...</span>}
      </div>
      <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
        <Btn variant="primary" onClick={check}>▶ Check Query</Btn>
        <Btn variant="secondary" onClick={reset}>↺ Reset</Btn>
      </div>
      {result!==null && (
        <div style={{marginTop:12,padding:12,borderRadius:8,fontSize:14,border:`1px solid ${result?"rgba(34,197,94,.4)":"rgba(248,113,113,.3)"}`,background:result?"rgba(34,197,94,.08)":"rgba(248,113,113,.08)",color:result?"#4ade80":"#f87171"}}>
          {result?"Correct! SELECT * FROM students WHERE city = 'Ludhiana' — returns all students from Ludhiana!":"Not quite! Try: SELECT → * → FROM → students → WHERE → city = 'Ludhiana'"}
        </div>
      )}
    </div>
  );
}

/* ─────────────── SQL SANDBOX ─────────────── */
function SQLSandbox({onSuccess}) {
  const [val,setVal]=useState("INSERT INTO students (student_id, name, age, grade, city)\nVALUES (006, 'Your Name', 17, '11th', 'Ludhiana');");
  const [result,setResult]=useState(null);
  const run = () => {
    const q=val.trim().toLowerCase();
    if(q.includes("insert into")&&q.includes("students")&&q.includes("values")){setResult({ok:true,msg:"Query OK, 1 row affected. (0.02 sec)"});onSuccess&&onSuccess();}
    else setResult({ok:false,msg:"Syntax error. Use: INSERT INTO students (...) VALUES (...)"});
  };
  return (
    <div style={{border:"2px solid #2e3347",borderRadius:16,background:"#1e2130",padding:28,margin:"28px 0"}}>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:"#60a5fa",marginBottom:12,display:"flex",alignItems:"center",gap:8}}> SQL Sandbox — Try INSERT</div>
      <p style={{color:"#7c8499",fontSize:14,marginBottom:12,fontWeight:600}}>Type an INSERT command and press Run:</p>
      <div style={{border:"2px solid #2e3347",borderRadius:14,overflow:"hidden",background:"#0a0c12"}}>
        <div style={{background:"#161926",borderBottom:"2px solid #2e3347",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:6}}>{["#ff5f56","#ffbd2e","#27c93f"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#7c8499",fontWeight:600}}>mysql&gt; school_db</span>
        </div>
        <textarea className="sql-textarea" value={val} onChange={e=>setVal(e.target.value)}/>
        {result&&<div style={{background:"#0a0c12",borderTop:"1px solid #2e3347",padding:"12px 20px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:result.ok?"#4ade80":"#f87171"}}>{result.msg}</div>}
      </div>
      <Btn variant="primary" onClick={run} style={{marginTop:8}}>▶ Run Query</Btn>
    </div>
  );
}

/* ─────────────── PRACTICE EDITOR ─────────────── */
function PracticeEditor({placeholder,check,hintText,btnVariant="primary"}) {
  const [val,setVal]=useState("");
  const [result,setResult]=useState(null);
  const [hint,setHint]=useState(false);
  const run=()=>setResult(check(val));
  return (
    <div style={{border:"2px solid #2e3347",borderRadius:16,background:"#1e2130",padding:28,margin:"28px 0"}}>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:"#60a5fa",marginBottom:12,display:"flex",alignItems:"center",gap:8}}> Practice Editor</div>
      <div style={{border:"2px solid #2e3347",borderRadius:14,overflow:"hidden",background:"#0a0c12"}}>
        <div style={{background:"#1e2130",borderBottom:"1px solid #1a3060",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:6}}>{["#ff5f56","#ffbd2e","#27c93f"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#7c8499",fontWeight:600}}>mysql&gt; school_db</span>
        </div>
        <textarea className="sql-textarea" style={{minHeight:120}} value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder}/>
        {result&&<div style={{background:"#161926",borderTop:"1px solid #2e3347",padding:"12px 20px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:result.ok?"#4ade80":"#f87171"}}>{result.msg}</div>}
      </div>
      <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
        <Btn variant={btnVariant} onClick={run}>▶ Run & Check</Btn>
        <Btn variant="secondary" onClick={()=>setVal("")}>Clear</Btn>
        {hintText&&<Btn variant="secondary" onClick={()=>setHint(h=>!h)}> Hint</Btn>}
      </div>
      {hint&&hintText&&<HBox type="purple" style={{marginTop:10}}><strong>Hint:</strong> {hintText}</HBox>}
    </div>
  );
}

/* ─────────────── GROUP BY VISUALIZER ─────────────── */
function GroupByVisualizer() {
  const [view,setView]=useState(null);
  const data={
    grade:[{grade:"9th",count:1},{grade:"10th",count:2},{grade:"11th",count:1}],
    city:[{city:"Delhi",count:1},{city:"Mumbai",count:1},{city:"Ludhiana",count:1},{city:"Ahmedabad",count:1}],
    max:[{subject:"Math",max:95},{subject:"Science",max:88},{subject:"English",max:92}],
  };
  const headers={grade:["grade","COUNT(*)"],city:["city","COUNT(*)"],max:["subject","MAX(score)"]};
  return (
    <div style={{border:"2px solid #2e3347",borderRadius:16,background:"#1e2130",padding:28,margin:"28px 0"}}>
      <div style={{fontFamily:"'Fredoka One',cursive",fontSize:18,color:"#60a5fa",marginBottom:12,display:"flex",alignItems:"center",gap:8}}> Result Visualizer</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
        {[["grade","GROUP BY grade"],["city","GROUP BY city"],["max","MAX score per subject"]].map(([k,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{padding:"8px 16px",borderRadius:8,border:`2px solid ${view===k?"#3b82f6":"#2e3347"}`,background:view===k?"#0f1a2e":"#161926",color:view===k?"#60a5fa":"#7c8499",boxShadow:view===k?"0 3px 0 #1d4ed8":"0 2px 0 #0a0c14",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:700,transition:"all .2s"}}>{l}</button>
        ))}
      </div>
      {view&&(
        <div style={{border:"2px solid #2e3347",borderRadius:12,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{headers[view].map(h=><th key={h} style={{background:"#161926",padding:"10px 16px",fontFamily:"'Nunito',sans-serif",fontSize:11,color:"#7c8499",textTransform:"uppercase",letterSpacing:.5,borderBottom:"2px solid #2e3347",textAlign:"left",fontWeight:800}}>{h}</th>)}</tr></thead>
            <tbody>{data[view].map((r,i)=><tr key={i}>{Object.values(r).map((v,j)=><td key={j} style={{padding:"10px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:j===0?"#3b82f6":"#c4bdb4",borderBottom:"1px solid #252a3a",fontWeight:j===0?700:400}}>{v}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
      {!view&&<div style={{color:"#7c8499",fontSize:13,fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>← Click a button above to see results</div>}
    </div>
  );
}

/* ─────────────── SCHEMA DIAGRAM ─────────────── */
function SchemaDiagram() {
  return (
    <div style={{background:"#0f1117",border:"2px solid #2e3347",borderRadius:16,padding:22,margin:"20px 0",overflowX:"auto"}}>
      <div style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:"#7c8499",letterSpacing:1,textTransform:"uppercase",marginBottom:16,fontWeight:800}}>Database Schema</div>
      <div style={{display:"flex",alignItems:"flex-start",gap:20,flexWrap:"wrap"}}>
        <SchemaEntity title=" students" fields={[{tag:"PK",name:"student_id INT"},{tag:"NN",name:"name VARCHAR"},{tag:"",name:"grade VARCHAR"},{tag:"",name:"city VARCHAR"}]} color="#00e5ff"/>
        <div style={{fontSize:22,color:"#c4a882",paddingTop:38}}>→</div>
        <SchemaEntity title=" marks" fields={[{tag:"PK",name:"mark_id INT"},{tag:"FK",name:"student_id INT"},{tag:"",name:"subject VARCHAR"},{tag:"",name:"score INT"}]} color="#7c3aed"/>
      </div>
      <div style={{marginTop:12,fontSize:12,color:"#7c8499",fontFamily:"'JetBrains Mono',monospace",fontWeight:600}}>
        <span style={{color:"#3b82f6"}}>PK</span> = Primary Key &nbsp;&nbsp; <span style={{color:"#6366f1"}}>FK</span> = Foreign Key
      </div>
    </div>
  );
}
function SchemaEntity({title,fields,color}) {
  return (
    <div style={{border:`1px solid ${color}55`,borderRadius:10,minWidth:160,overflow:"hidden"}}>
      <div style={{background:`${color}22`,padding:"10px 14px",fontFamily:"'Nunito',sans-serif",fontSize:13,color,fontWeight:800,textAlign:"center",borderBottom:`2px solid ${color}44`}}>{title}</div>
      {fields.map((f,i)=>(
        <div key={i} style={{padding:"7px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#c4bdb4",borderBottom:"1px solid #252a3a",display:"flex",alignItems:"center",gap:8}}>
          {f.tag&&<span style={{fontSize:9,background:f.tag==="PK"?"rgba(255,214,0,.15)":f.tag==="FK"?"rgba(124,58,237,.15)":"rgba(255,255,255,.05)",color:f.tag==="PK"?"#ffd600":f.tag==="FK"?"#7c3aed":"#6b8cba",padding:"1px 5px",borderRadius:3}}>{f.tag}</span>}
          {f.name}
        </div>
      ))}
    </div>
  );
}

/* ─────────────── NORMALIZATION VISUAL ─────────────── */
function NormalizationVisual() {
  return (
    <div style={{background:"#0f1117",border:"2px solid #2e3347",borderRadius:16,padding:22,margin:"20px 0",overflowX:"auto"}}>
      <div style={{fontFamily:"'Nunito',sans-serif",fontSize:11,color:"#7c8499",letterSpacing:1,textTransform:"uppercase",marginBottom:16,fontWeight:800}}>Before vs After Normalization</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:14,alignItems:"start"}}>
        <div>
          <div style={{color:"#f87171",fontFamily:"'Fredoka One',cursive",fontSize:14,marginBottom:10}}>Unnormalized</div>
          <div style={{border:"2px solid #2e3347",borderRadius:10,overflow:"hidden",background:"#1e2130"}}>
            <div style={{background:"#0f1a2e",padding:"10px 14px",fontFamily:"'Nunito',sans-serif",fontSize:12,color:"#60a5fa",fontWeight:800}}>orders</div>
            {[["1","Arjun","987..","Laptop"],["2","Arjun","987..","Mouse"],["3","Priya","876..","KB"]].map((r,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",padding:"7px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#c4bdb4",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                <span style={{color:"#3b82f6"}}>{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span><span>{r[3]}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:"#ff4444",marginTop:7}}>Arjun's phone stored twice! </div>
        </div>
        <div style={{fontSize:22,color:"#7c8499",paddingTop:55}}>→</div>
        <div>
          <div style={{color:"#22c55e",fontFamily:"'Fredoka One',cursive",fontSize:14,marginBottom:10}}>Normalized (3NF)</div>
          {[{title:"customers",rows:[["1","Arjun","987.."],["2","Priya","876.."]]},{title:"orders",rows:[["1","1","Laptop"],["2","1","Mouse"],["3","2","KB"]]}].map((tbl,ti)=>(
            <div key={ti} style={{border:"2px solid #2e3347",borderRadius:10,overflow:"hidden",background:"#1e2130",marginBottom:8}}>
              <div style={{background:"rgba(34,197,94,.12)",padding:"8px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#4ade80",fontWeight:600}}>{tbl.title}</div>
              {tbl.rows.map((r,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:`repeat(${r.length},1fr)`,padding:"6px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#c4bdb4",borderBottom:"1px solid #252a3a"}}>
                  <span style={{color:"#3b82f6"}}>{r[0]}</span>
                  {r.slice(1).map((c,j)=><span key={j} style={{color:ti===1&&j===0?"#a78bfa":"#9ba3b8"}}>{c}</span>)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── STEP CONTENT COMPONENTS ─────────────── */
// Beginner steps

export { StudentTable, QueryBuilderGame, SQLSandbox, PracticeEditor, GroupByVisualizer, SchemaDiagram, SchemaEntity, NormalizationVisual };
