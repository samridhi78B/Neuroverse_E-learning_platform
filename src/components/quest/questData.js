export const INTRO_DATA = {
  beginner: {
     id: 1,
    unlocked: true, 
    color:"green", icon:"", label:"Beginner — Level 01",
    title:"What You'll Learn",
    sub:"This module takes you from zero to understanding the core building blocks of MySQL. No prior knowledge needed!",
    topics:[
      {title:"What is a Database & DBMS?",desc:"Understand why databases exist and how DBMS software manages them with real-world analogies."},
      {title:"Tables, Rows & Columns",desc:"Learn the structure of database tables — the primary building block of every MySQL database."},
      {title:"SELECT & WHERE",desc:"Master the most-used SQL command to read and filter data from tables."},
      {title:"INSERT, UPDATE & DELETE",desc:"Learn the full CRUD cycle — creating, modifying, and removing records."},
      {title:"Knowledge Quiz",desc:"Test everything you've learned with 4 MCQs and earn XP points!"},
    ],
    btnClass:"green", btnText:"START BEGINNER MODULE →",
  },
  medium: {
    id: 2,
    unlocked: false, 
    color:"cyan", icon:"", label:"Intermediate — Level 02",
    title:"What You'll Learn",
    sub:"Take your MySQL skills further by learning how to connect tables, summarize data, and write complex queries.",
    topics:[
      {title:"JOINs — Connecting Tables",desc:"Learn INNER JOIN, LEFT JOIN and more to combine data from multiple related tables."},
      {title:"GROUP BY & Aggregate Functions",desc:"Use COUNT, SUM, AVG, MAX, MIN with GROUP BY to summarize and analyze data."},
      {title:"Subqueries & Nested SELECT",desc:"Write queries inside queries to solve complex data retrieval problems."},
      {title:"Practice Editor",desc:"Write real SQL in an interactive editor with instant feedback and test cases."},
      {title:"Intermediate Quiz",desc:"Prove your intermediate skills with a targeted MCQ challenge."},
    ],
    btnClass:"cyan", btnText:"START INTERMEDIATE MODULE →",
  },
  advanced: {
    id: 3,
    unlocked : false,
    color:"purple", icon:"", label:"Advanced — Level 03",
    title:"What You'll Learn",
    sub:"Go deep into professional-level database design and management — concepts used daily by engineers worldwide.",
    topics:[
      {title:"Normalization (1NF → BCNF)",desc:"Learn how to design clean, efficient databases by eliminating redundancy and dependency issues."},
      {title:"Transactions & ACID Properties",desc:"Understand how MySQL guarantees data integrity during concurrent and multi-step operations."},
      {title:"Stored Procedures & Indexes",desc:"Write reusable SQL programs and speed up queries using proper indexing strategies."},
      {title:"Advanced Editor Challenge",desc:"Solve real-world SQL problems in a full editor with test case evaluation."},
      {title:"Advanced Quiz",desc:"A challenging final quiz covering all advanced DBMS concepts."},
    ],
    btnClass:"purple", btnText:"START ADVANCED MODULE →",
  },
};

export const BEG_STAGES = [
  {
    id: 1,
    unlocked: true,
    questions: [
      {q:"What does DBMS stand for?",opts:["Data Base Management System","Database Management Software","Digital Binary Management System","Data Byte Memory System"],ans:0,exp:"DBMS = Database Management System — software that manages databases."},
      {q:"In a MySQL table, what is a ROW?",opts:["A column definition","A complete single record of data","A table name","A database connection"],ans:1,exp:"A row is one complete record. In a students table, one row = one student's entire info."},
      {q:"Which SQL command retrieves data from a table?",opts:["INSERT","UPDATE","SELECT","DELETE"],ans:2,exp:"SELECT is used to READ data from tables — the most-used SQL command."},
      {q:"What does PRIMARY KEY ensure?",opts:["Each column has a name","Each row has a unique identifier","Only numbers can be stored","The table is sorted automatically"],ans:1,exp:"A Primary Key uniquely identifies every row. No two rows share the same Primary Key."},
    ]
  },
  {
    id: 2,
    unlocked: false,
    questions: []   
  },
  {
    id: 3,
    unlocked: false,
    questions: []   
  }
];


export const MED_STAGES = [
  {
    id: 1,
    unlocked: true,
    questions: [
      {q:"Which JOIN returns only rows with matches in BOTH tables?",opts:["LEFT JOIN","RIGHT JOIN","INNER JOIN","FULL JOIN"],ans:2,exp:"INNER JOIN returns only rows that have matching values in both tables."},
      {q:"Which clause filters results AFTER GROUP BY?",opts:["WHERE","FILTER","HAVING","ORDER BY"],ans:2,exp:"HAVING filters grouped results. WHERE filters individual rows before grouping."},
      {q:"What does COUNT(*) return?",opts:["Sum of a column","Number of rows","Average value","Largest value"],ans:1,exp:"COUNT(*) returns the total number of rows in the result set."},
      {q:"A subquery runs in what order?",opts:["Outer first, then inner","Both at the same time","Inner first, result used by outer","Random order"],ans:2,exp:"The inner (nested) query runs first, and its result is passed to the outer query."},
    ]
  },
  {
    id: 2,
    unlocked: false,
    questions: []
  },
  {
    id: 3,
    unlocked: false,
    questions: []
  }
];



export const ADV_STAGES = [
  {
    id: 1,
    unlocked: true,
    questions: [
      {q:"Which normal form removes transitive dependencies?",opts:["1NF","2NF","3NF","BCNF"],ans:2,exp:"3NF removes transitive dependencies — where non-key columns depend on other non-key columns."},
      {q:"What does ROLLBACK do?",opts:["Saves changes permanently","Undoes all changes since START TRANSACTION","Deletes the current table","Restarts the MySQL server"],ans:1,exp:"ROLLBACK undoes all changes made during the current transaction."},
      {q:"The 'D' in ACID stands for:",opts:["Distribution","Durability","Data integrity","Determinism"],ans:1,exp:"Durability — committed transactions are permanently saved, even after a system crash."},
      {q:"Adding too many indexes will:",opts:["Speed up all queries","Use no extra storage","Slow down INSERT/UPDATE/DELETE","Have no side effects"],ans:2,exp:"Indexes speed up reads but add overhead to write operations and use extra disk space."},
    ]
  },
  {
    id: 2,
    unlocked: false,
    questions: []
  },
  {
    id: 3,
    unlocked: false,
    questions: []
  }
];

export const QUERY_CHIPS = [
  {label:"SELECT",cls:"kw-chip"},{label:"*",cls:"col-chip"},
  {label:"FROM",cls:"kw-chip"},{label:"students",cls:"tbl-chip"},
  {label:"WHERE",cls:"kw-chip"},{label:"city = 'Ludhiana'",cls:"col-chip"},
  {label:"ORDER BY",cls:"kw-chip"},{label:"name",cls:"col-chip"},
];

/* ─────────────── SMALL SHARED COMPONENTS ─────────────── */
const S = {
  card:{background:"#1e2130",border:"2px solid #2e3347",borderRadius:16,padding:"20px",boxShadow:"0 2px 8px rgba(0,0,0,.3)"},
  card2:{background:"#161926",border:"2px solid #2e3347",borderRadius:12,padding:"14px"},
};

/* ── Level SVG Icons ── */
export const LEVELS = Object.values(INTRO_DATA);

