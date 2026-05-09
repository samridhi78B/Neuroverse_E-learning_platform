import { useState, useEffect, useRef } from "react";
import authService from "../services/authService";

function simulateJavaExecution(javaCode, inputArray) {
  try {
    const methodStart = javaCode.indexOf('public static void sort(int[] arr)');
    if (methodStart === -1) {
      throw new Error("No 'public static void sort(int[] arr)' method found");
    }
    
    const openBrace = javaCode.indexOf('{', methodStart);
    if (openBrace === -1) {
      throw new Error("No opening brace found in sort method");
    }
    
    let braceCount = 1;
    let closeBrace = openBrace + 1;
    
    while (closeBrace < javaCode.length && braceCount > 0) {
      if (javaCode[closeBrace] === '{') {
        braceCount++;
      } else if (javaCode[closeBrace] === '}') {
        braceCount--;
      }
      closeBrace++;
    }
    
    if (braceCount !== 0) {
      throw new Error("Unmatched braces in sort method");
    }
    
    let methodBody = javaCode.substring(openBrace + 1, closeBrace - 1);
    
    methodBody = methodBody
      .replace(/int\s+(\w+)\s*=/g, 'let $1 =')     
      .replace(/int\s+(\w+)\s*;/g, 'let $1;')      
      .replace(/boolean\s+(\w+)\s*=/g, 'let $1 =')   
      .replace(/boolean\s+(\w+)\s*;/g, 'let $1;')    
      .replace(/true/g, 'true')                        
      .replace(/false/g, 'false');                     
    
    if (!methodBody.includes('arr')) {
      throw new Error("Your code must use the 'arr' parameter. Did you mean 'arr' instead of 'ar'?");
    }
    
    const javaFunction = new Function('arr', `
      // Java-like execution environment
      const Arrays = {
        toString: (arr) => '[' + arr.join(', ') + ']'
      };
      
      // Simulate Java array operations
      ${methodBody}
      
      return arr;
    `);
    
    const result = javaFunction([...inputArray]);
    return result;
  } catch (error) {
    throw new Error('Java execution error: ' + error.message);
  }
}

function CodeIDE({ algorithm, onCodeSubmit, testResults }) {
  const [code, setCode] = useState(algorithm.code);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running tests...');
    
    try {
      const testCases = [
        { input: [5, 2, 8, 1, 9, 3], expected: [1, 2, 3, 5, 8, 9] },
        { input: [64, 34, 25, 12, 22, 11, 90], expected: [11, 12, 22, 25, 34, 64, 90] },
        { input: [1, 2, 3, 4, 5], expected: [1, 2, 3, 4, 5] },
        { input: [5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5] }
      ];

      let allPassed = true;
      let results = [];

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        
        try {
          const fullJavaCode = `
import java.util.Arrays;

public class TestSort {
    ${code}
    
    public static int[] testSort(int[] input) {
        sort(input);
        return input;
    }
    
    public static void main(String[] args) {
        // Test with sample data
        int[] test = {5, 2, 8, 1, 9, 3};
        testSort(test);
        System.out.println(Arrays.toString(test));
    }
}`;
          
          const result = simulateJavaExecution(code, testCase.input);
          const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
          
          results.push({
            test: i + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: result,
            passed
          });
          
          if (!passed) allPassed = false;
        } catch (error) {
          results.push({
            test: i + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: 'Error: ' + error.message,
            passed: false
          });
          allPassed = false;
        }
      }

      setOutput(results.map(r => 
        `Test ${r.test}: ${r.passed ? '✅ PASSED' : '❌ FAILED'}\n` +
        `Input: [${r.input.join(', ')}]\n` +
        `Expected: [${r.expected.join(', ')}]\n` +
        `Actual: ${Array.isArray(r.actual) ? `[${r.actual.join(', ')}]` : r.actual}\n`
      ).join('\n'));

      onCodeSubmit(allPassed, results);
    } catch (error) {
      setOutput('Error: ' + error.message);
      onCodeSubmit(false, []);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{marginTop: 20}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10}}>
        <h3 style={{color: algorithm.color, margin: 0}}>Code Implementation</h3>
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          style={{
            padding: "8px 16px",
            backgroundColor: isRunning ? "#999" : algorithm.color,
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: isRunning ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "600"
          }}
        >
          {isRunning ? "Running..." : "Run Tests"}
        </button>
      </div>
      
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20}}>
        {}
        <div>
          <div style={{fontSize: "12px", color: "#8899bb", marginBottom: 5}}>Write your code:</div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: "100%",
              height: "300px",
              fontFamily: "'Courier New', monospace",
              fontSize: "14px",
              padding: "10px",
              border: `1px solid ${algorithm.color}33`,
              borderRadius: "8px",
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "#fff",
              resize: "vertical"
            }}
            placeholder="Write your sorting algorithm implementation here..."
          />
        </div>
        
        {}
        <div>
          <div style={{fontSize: "12px", color: "#8899bb", marginBottom: 5}}>Test Results:</div>
          <pre
            style={{
              width: "100%",
              height: "300px",
              fontFamily: "'Courier New', monospace",
              fontSize: "12px",
              padding: "10px",
              border: `1px solid ${algorithm.color}33`,
              borderRadius: "8px",
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "#fff",
              overflow: "auto",
              margin: 0,
              whiteSpace: "pre-wrap"
            }}
          >
            {output || "Click 'Run Tests' to test your code"}
          </pre>
        </div>
      </div>
      
      {testResults && testResults.length > 0 && (
        <div style={{
          marginTop: 15,
          padding: "15px",
          borderRadius: "8px",
          backgroundColor: testResults.every(r => r.passed) ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
          border: `1px solid ${testResults.every(r => r.passed) ? "#10b981" : "#ef4444"}33`
        }}>
          <div style={{
            fontSize: "16px",
            fontWeight: "600",
            color: testResults.every(r => r.passed) ? "#10b981" : "#ef4444",
            marginBottom: "5px"
          }}>
            {testResults.every(r => r.passed) ? "🎉 All Tests Passed!" : "❌ Some Tests Failed"}
          </div>
          <div style={{fontSize: "12px", color: "#8899bb"}}>
            {testResults.filter(r => r.passed).length}/{testResults.length} tests passed
          </div>
        </div>
      )}
    </div>
  );
}

const algorithms = [
  {
    id:"bubble",level:1,name:"Bubble Sort",tagline:"The patient one",
    complexity:"O(n²)",space:"O(1)",stable:true,color:"#f59e0b",accent:"#fde68a",difficulty:"Beginner",
    description:"Finds minimum element from unsorted portion and places it at the beginning. Fewer swaps than bubble sort — great when writes are expensive.",
    code:`public static void sort(int[] arr) {
    // TODO: Implement Bubble Sort algorithm here
    // Compare adjacent elements and swap if they are in wrong order
}`,
    steps:[
      {arr:[5,3,8,1,2],comparing:[0,1],sorted:[],note:"Compare 5 and 3 → Swap!"},
      {arr:[3,5,8,1,2],comparing:[1,2],sorted:[],note:"Compare 5 and 8 → No swap"},
      {arr:[3,5,8,1,2],comparing:[2,3],sorted:[],note:"Compare 8 and 1 → Swap!"},
      {arr:[3,5,1,8,2],comparing:[3,4],sorted:[],note:"Compare 8 and 2 → Swap!"},
      {arr:[3,5,1,2,8],comparing:[],sorted:[4],note:"8 is in its final place ✓"},
      {arr:[3,1,2,5,8],comparing:[],sorted:[3,4],note:"Pass 2 complete — 5 sorted ✓"},
      {arr:[1,2,3,5,8],comparing:[],sorted:[0,1,2,3,4],note:"Fully sorted! "},
    ],
    questions:[
      {q:"What is the worst-case time complexity?",options:["O(n)","O(n log n)","O(n²)","O(log n)"],answer:2,exp:"Two nested loops each running up to n times gives O(n²)."},
      {q:"Is Bubble Sort stable?",options:["Yes","No","Depends","Only integers"],answer:0,exp:"Equal elements are never swapped, preserving relative order — it's stable."},
      {q:"After the first pass, which element is guaranteed correct?",options:["Smallest","Middle","Largest","First"],answer:2,exp:"The largest element bubbles up to the last position after one full pass."},
    ],
  },
  {
    id:"selection",level:2,name:"Selection Sort",tagline:"The methodical one",
    complexity:"O(n²)",space:"O(1)",stable:false,color:"#10b981",accent:"#a7f3d0",difficulty:"Beginner",
    description:"Finds minimum element from unsorted portion and places it at the beginning. Fewer swaps than bubble sort — great when writes are expensive.",
    code:`public static void sort(int[] arr) {
    // TODO: Implement Selection Sort algorithm here
    // Find the minimum element and place it at the beginning
}`,
    steps:[
      {arr:[64,25,12,22,11],comparing:[0,4],sorted:[],note:"Find minimum in full array → 11"},
      {arr:[11,25,12,22,64],comparing:[1,2],sorted:[0],note:"11 placed. Find min in rest → 12"},
      {arr:[11,12,25,22,64],comparing:[2,3],sorted:[0,1],note:"12 placed. Find min → 22"},
      {arr:[11,12,22,25,64],comparing:[],sorted:[0,1,2,3,4],note:"Sorted! "},
    ],
    questions:[
      {q:"How many swaps does Selection Sort perform at most?",options:["n²","n log n","n−1","n/2"],answer:2,exp:"Each pass selects one element — at most n−1 swaps total."},
      {q:"Is Selection Sort stable?",options:["Yes","No","Sometimes"],answer:1,exp:"Non-adjacent swaps can disrupt equal elements' relative order."},
      {q:"What does each pass find?",options:["Maximum","Minimum","Median","First unsorted"],answer:1,exp:"Each pass scans the unsorted portion to find and place the minimum."},
    ],
  },
  {
    id:"insertion",level:2,name:"Insertion Sort",tagline:"The adaptive one",
    complexity:"O(n²)",space:"O(1)",stable:true,color:"#8b5cf6",accent:"#ddd6fe",difficulty:"Beginner",
    description:"Builds sorted array one item at a time. Extremely efficient for small or nearly-sorted datasets. Adaptive performance.",
    code:`public static void sort(int[] arr) {
    // TODO: Implement Insertion Sort algorithm here
    // Build sorted array one element at a time
}`,
    steps:[
      {arr:[5,2,4,6,1],comparing:[0,1],sorted:[0],note:"Key=2. Compare with 5 → Shift right"},
      {arr:[2,5,4,6,1],comparing:[1,2],sorted:[0,1],note:"Key=4. Insert between 2 and 5"},
      {arr:[2,4,5,6,1],comparing:[2,3],sorted:[0,1,2],note:"Key=6. Already in place ✓"},
      {arr:[2,4,5,6,1],comparing:[3,4],sorted:[0,1,2,3],note:"Key=1. Shift everything right"},
      {arr:[1,2,4,5,6],comparing:[],sorted:[0,1,2,3,4],note:"Sorted! 🎉"},
    ],
    questions:[
      {q:"Best-case time complexity?",options:["O(n)","O(n log n)","O(n²)","O(1)"],answer:0,exp:"With nearly sorted data, insertion sort approaches O(n) time."},
      {q:"Worst-case time complexity?",options:["O(n)","O(n log n)","O(n²)"],answer:2,exp:"With reverse sorted data, insertion sort degrades to O(n²) time."},
      {q:"Is Insertion Sort stable?",options:["Yes","No","Sometimes"],answer:0,exp:"Equal elements are never swapped, preserving relative order — it's stable."},
      {q:"Analogy for Insertion Sort?",options:["Sifting sand","Sorting playing cards","Pouring water","Flipping coins"],answer:1,exp:"Like inserting each card into its correct position in your hand."},
    ],
  },
  {
    id:"merge",level:3,name:"Merge Sort",tagline:"The divide & conquer",
    complexity:"O(n log n)",space:"O(n)",stable:true,color:"#ef4444",accent:"#fecaca",difficulty:"Intermediate",
    description:"Divides array into halves, recursively sorts them, then merges. Guarantees O(n log n) and is widely used in production systems.",
    code:`public static void sort(int[] arr) {
    // TODO: Implement Merge Sort algorithm here
    // Divide and conquer - split array and merge sorted halves
}`,
    steps:[
      {arr:[38,27,43,3],comparing:[],sorted:[],note:"Split: [38,27] | [43,3]"},
      {arr:[38,27,43,3],comparing:[0,1],sorted:[],note:"Split: [38]|[27] — compare & merge"},
      {arr:[27,38,43,3],comparing:[2,3],sorted:[0,1],note:"Left → [27,38]. Now right: [43]|[3]"},
      {arr:[27,38,3,43],comparing:[],sorted:[0,1,2,3],note:"Right → [3,43]. Final merge!"},
      {arr:[3,27,38,43],comparing:[],sorted:[0,1,2,3],note:"Fully sorted! 🎉"},
    ],
    questions:[
      {q:"Time complexity?",options:["O(n)","O(n²)","O(n log n)","O(log n)"],answer:2,exp:"O(log n) levels × O(n) merge per level = O(n log n)."},
      {q:"Extra space required?",options:["O(1)","O(log n)","O(n)","O(n²)"],answer:2,exp:"Needs auxiliary arrays to merge — O(n) extra space."},
      {q:"Algorithmic technique used?",options:["Greedy","Dynamic Programming","Backtracking","Divide and Conquer"],answer:3,exp:"Splits problem into subproblems, solves recursively, then combines — D&C!"},
    ],
  },
  {
    id:"quick",level:3,name:"Quick Sort",tagline:"The fastest in practice",
    complexity:"O(n log n) avg",space:"O(log n)",stable:false,color:"#f97316",accent:"#fed7aa",difficulty:"Intermediate",
    description:"Picks a pivot, partitions elements around it, and recursively sorts each side. The go-to for real-world performance.",
    code:`void quickSort(int[] arr, int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

int partition(int[] arr, int low, int high) {
  int pivot = arr[high];
  int i = low - 1;
  for (int j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, high);
  return i + 1;
}`,
    steps:[
      {arr:[10,7,8,9,1,5],comparing:[5],sorted:[],note:"Pivot = 5 (last element)"},
      {arr:[1,7,8,9,10,5],comparing:[5],sorted:[],note:"Elements ≤ 5 move left"},
      {arr:[1,5,8,9,10,7],comparing:[],sorted:[1],note:"Pivot 5 placed at index 1 ✓"},
      {arr:[1,5,7,8,9,10],comparing:[],sorted:[0,1,2,3,4,5],note:"Recursively sorted! 🎉"},
    ],
    questions:[
      {q:"Worst-case time complexity?",options:["O(n log n)","O(n)","O(n²)","O(log n)"],answer:2,exp:"When pivot is always min/max, partitions are unbalanced — O(n²)."},
      {q:"What is a pivot?",options:["Always middle","Always first","Element chosen to partition","Sorted element"],answer:2,exp:"Any chosen element around which others are partitioned."},
      {q:"Quick Sort is faster in practice because...",options:["Better worst case","Fewer comparisons","Better cache performance","It's stable"],answer:2,exp:"Excellent cache locality and lower constant factors make it faster."},
    ],
  },
];

const KWS = ["void","int","if","while","for","return","new"];
function Highlight({code}) {
  return code.split("\n").map((line,i)=>{
    const ci=line.indexOf("//"); const main=ci>=0?line.slice(0,ci):line; const comment=ci>=0?line.slice(ci):"";
    return (
      <div key={i} style={{lineHeight:"1.8"}}>
        <span style={{color:"#334155",userSelect:"none",marginRight:14,fontSize:11}}>{String(i+1).padStart(2,"0")}</span>
        {main.split(/(\b(?:void|int|if|while|for|return|new)\b)/).map((ch,j)=>
          KWS.includes(ch)?<span key={j} style={{color:"#4A9EFF",fontWeight:600}}>{ch}</span>:<span key={j} style={{color:"#e2e8f0"}}>{ch}</span>
        )}
        {comment&&<span style={{color:"#1a4a9a",fontStyle:"italic"}}>{comment}</span>}
      </div>
    );
  });
}

function Visualizer({steps,color,accent}) {
  const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false); const timer=useRef(null);
  const cur=steps[step]; const max=Math.max(...steps[0].arr);
  useEffect(()=>{ if(playing){ timer.current=setInterval(()=>setStep(s=>{ if(s>=steps.length-1){setPlaying(false);return s;} return s+1; }),900); } return()=>clearInterval(timer.current); },[playing,steps.length]);
  const bb={background:"rgba(74,158,255,0.1)",border:"1px solid rgba(74,158,255,0.2)",borderRadius:8,color:"#4A9EFF",padding:"8px 14px",cursor:"pointer",fontSize:15};
  return (
    <div>
      <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120,marginBottom:14}}>
        {cur.arr.map((val,i)=>{
          const isC=cur.comparing?.includes(i),isS=cur.sorted?.includes(i);
          return (
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:"100%",height:Math.max(16,(val/max)*110),borderRadius:6,background:isS?"linear-gradient(180deg,#4ade80,#16a34a)":isC?`linear-gradient(180deg,${accent},${color})`:"rgba(255,255,255,0.07)",border:isC?`2px solid ${color}`:"2px solid transparent",boxShadow:isC?`0 0 14px ${color}55`:"none",transition:"all 0.35s cubic-bezier(.4,0,.2,1)"}}/>
              <span style={{fontSize:11,color:isS?"#4ade80":isC?color:"#8899bb",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,transition:"color 0.3s"}}>{val}</span>
            </div>
          );
        })}
      </div>
      <div style={{background:"rgba(74,158,255,0.05)",border:"1px solid rgba(74,158,255,0.1)",borderRadius:10,padding:"10px 16px",marginBottom:14,fontSize:13,color:"#cbd5e1",minHeight:40,display:"flex",alignItems:"center"}}>{cur.note}</div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <button onClick={()=>{setStep(0);setPlaying(false);}} style={bb}>↺</button>
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{...bb,opacity:step===0?0.3:1}}>‹</button>
        <button onClick={()=>setPlaying(p=>!p)} style={{...bb,background:`${color}1a`,border:`1px solid ${color}55`,color,flex:1,fontWeight:600}}>{playing?"⏸ Pause":"▶ Play"}</button>
        <button onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))} disabled={step===steps.length-1} style={{...bb,opacity:step===steps.length-1?0.3:1}}>›</button>
        <span style={{fontSize:11,color:"#4A9EFF",fontFamily:"'Rajdhani',sans-serif",minWidth:36,textAlign:"right"}}>{step+1}/{steps.length}</span>
      </div>
    </div>
  );
}

function Quiz({algo,onBack,onLevelComplete}) {
  const [qi,setQi]=useState(0); const [sel,setSel]=useState(null); const [confirmed,setConfirmed]=useState(false);
  const [score,setScore]=useState(0); const [finished,setFinished]=useState(false);
  const t0=useRef(Date.now());
  const q=algo.questions[qi];

  const confirm=()=>{ if(sel===null)return; setConfirmed(true); if(sel===q.answer)setScore(s=>s+1); };
  const next=()=>{ 
    if(qi<algo.questions.length-1){setQi(i=>i+1);setSel(null);setConfirmed(false);} else {
      setFinished(true);
      
      const passThreshold = Math.ceil(algo.questions.length * 0.6);
      const passed = score >= passThreshold;
      
      console.log('Quiz finished - Score:', score, 'Threshold:', passThreshold, 'Passed:', passed);
      console.log('Algorithm level:', algo.level);
      
      if (passed && onLevelComplete) {
        console.log('Calling onLevelComplete for level:', algo.level);
        onLevelComplete(algo.level);
      } else {
        console.log('Not unlocking level - passed:', passed, 'has onLevelComplete:', !!onLevelComplete);
      }

      saveScoreToBackend(score, algo.questions.length);
    }
  };

  const [xpAwarded, setXpAwarded] = useState(null);

  const saveScoreToBackend = async (correctAnswers, totalQuestions) => {
  try {
    // Use a target XP for the entire quiz so server receives a clear intended reward.
    // Desired: perfect quiz -> 30 XP (client intent). Backend may have its own scaling.
    const QUIZ_PERFECT_XP = 30;
    const totalXP = Math.max(0, Math.round((correctAnswers / totalQuestions) * QUIZ_PERFECT_XP));
    
    // Check previous score for this algorithm
    const previousScoreKey = `quiz_score_${algo.id}`;
    const previousScore = localStorage.getItem(previousScoreKey);
    const previousXP = previousScore ? Math.round((parseInt(previousScore) / totalQuestions) * QUIZ_PERFECT_XP) : 0;
    
    console.log(`Previous score for ${algo.id}: ${previousScore} (${previousXP} XP), New score: ${correctAnswers}/${totalQuestions} (${totalXP} XP)`);
    
    // Only save if new XP is greater than previous XP
    if (totalXP > previousXP) {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Save the new score with timestamp
        localStorage.setItem(previousScoreKey, correctAnswers.toString());
        localStorage.setItem(`${previousScoreKey}_timestamp`, Date.now().toString());
        
        // Calculate XP to add (difference between new and previous)
        const xpToAdd = totalXP - previousXP;
        
        // dsa = Data Structures & Algorithms planet ID
        await authService.updatePlanetXP('dsa', xpToAdd);
        console.log(`Added ${xpToAdd} XP to DSA planet (Total: ${totalXP} XP, Previous: ${previousXP} XP)`);
        setXpAwarded(xpToAdd);
      }
    } else {
      console.log(`No XP added - new score (${totalXP} XP) is not better than previous (${previousXP} XP)`);
      setXpAwarded(0);
    }
  } catch (error) {
    console.error('Failed to save score:', error);
    setXpAwarded(null);
  }
};

  const validateSortingCode = (code, algorithm) => {
    try {
      const testArray = [5, 2, 8, 1, 9, 3];
      const expectedSorted = [1, 2, 3, 5, 8, 9];
      
      const sortFunctionMatch = code.match(/public static void sort\(int\[\] arr\)\s*\{([\s\S]*?)\}/);
      if (!sortFunctionMatch) return { valid: false, error: "No sorting function found" };
      
      const functionBody = sortFunctionMatch[1];
      
      const testFunction = new Function(`return ${functionBody}`);
      
      const result = testFunction([...testArray]);
      
      const isValid = JSON.stringify(result) === JSON.stringify(expectedSorted);
      
      return {
        valid: isValid,
        error: isValid ? null : "Code doesn't sort correctly",
        testCase: { input: testArray, expected: expectedSorted, actual: result }
      };
    } catch (error) {
      return { valid: false, error: "Code validation failed: " + error.message };
    }
  };

  const pct=Math.round((score/algo.questions.length)*100);
  const baseXP = Math.round((score/algo.questions.length) * 25);
  const bonusXP = score === algo.questions.length ? 5 : 0;
  const totalXP = Math.min(baseXP + bonusXP, 30);

  if(finished) return (
    <div style={{paddingTop:4}}>
      {}
      <div style={{background:`${algo.color}10`,border:`1px solid ${algo.color}33`,borderRadius:16,padding:"28px 24px",marginBottom:22,textAlign:"center"}}>
        <div style={{fontSize:46,marginBottom:10}}>{pct===100?"🏆":pct>=66?"🎯":"📚"}</div>
        <div style={{fontSize:22,fontWeight:700,color:"#e8f0fe",fontFamily:"'Rajdhani',sans-serif",marginBottom:6}}>{pct===100?"Perfect!":pct>=66?"Well done!":"Keep going!"}</div>
        <div style={{fontSize:14,color:"#8899bb",marginBottom:18}}>{score}/{algo.questions.length} correct · {pct}%</div>
        <div style={{fontSize:16,color:algo.color,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,marginBottom:18}}>
          {xpAwarded === null ? (
            `🎯 ${totalXP} XP Earned! ${bonusXP > 0 ? `(+${bonusXP} Bonus)` : ''}`
          ) : xpAwarded === 0 ? (
            `🎯 Best score already achieved`
          ) : (
            `🎯 +${xpAwarded} XP Added! ${bonusXP > 0 ? `(+${bonusXP} Bonus)` : ''}`
          )}
        </div>
        <div style={{display:"flex",gap:4,justifyContent:"center"}}>
          {algo.questions.map((_,i)=><div key={i} style={{width:38,height:5,borderRadius:3,background:i<score?algo.color:"rgba(255,255,255,0.1)"}}/>)}
        </div>
      </div>

      <div style={{display:"flex",gap:10,marginTop:18}}>
        <button onClick={()=>{setFinished(false);setQi(0);setSel(null);setConfirmed(false);setScore(0);setXpAwarded(null);t0.current=Date.now();}}
          style={{flex:1,background:"rgba(255,255,255,0.05)",color:"#8899bb",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"12px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif"}}>
          ↺ Retry
        </button>
        <button onClick={onBack}
          style={{flex:1,background:algo.color,color:"#000",border:"none",borderRadius:10,padding:"12px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif"}}>
          ← Back to Algorithms
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",gap:4,marginBottom:22}}>
        {algo.questions.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<qi?algo.color:i===qi?`${algo.color}66`:"rgba(74,158,255,0.1)",transition:"background 0.3s"}}/>)}
      </div>
      <div style={{fontSize:11,color:"#4A9EFF",marginBottom:10,fontFamily:"'Rajdhani',sans-serif",textTransform:"uppercase",letterSpacing:1}}>Question {qi+1} of {algo.questions.length}</div>
      <div style={{fontSize:17,fontWeight:600,color:"#e8f0fe",marginBottom:22,lineHeight:1.6,fontFamily:"'Rajdhani',sans-serif"}}>{q.q}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        {q.options.map((opt,i)=>{
          let bg="rgba(255,255,255,0.04)",border="rgba(255,255,255,0.1)",col="#cbd5e1";
          if(sel===i&&!confirmed){bg=`${algo.color}15`;border=`${algo.color}66`;col=algo.color;}
          if(confirmed&&i===q.answer){bg="rgba(74,222,128,0.1)";border="#4ade80";col="#4ade80";}
          if(confirmed&&sel===i&&i!==q.answer){bg="rgba(248,113,113,0.1)";border="#f87171";col="#f87171";}
          return (
            <button key={i} onClick={()=>!confirmed&&setSel(i)} style={{background:bg,border:`1px solid ${border}`,borderRadius:12,padding:"13px 18px",cursor:confirmed?"default":"pointer",textAlign:"left",color:col,fontSize:14,fontFamily:"'Rajdhani',sans-serif",transition:"all 0.2s",display:"flex",alignItems:"center",gap:12}}>
              <span style={{width:24,height:24,borderRadius:6,background:`${border}22`,border:`1px solid ${border}`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>
                {confirmed&&i===q.answer?"✓":confirmed&&sel===i?"✗":String.fromCharCode(65+i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {confirmed&&(
        <div style={{background:"rgba(74,158,255,0.05)",border:"1px solid rgba(74,158,255,0.1)",borderRadius:12,padding:"14px 18px",marginBottom:18,fontSize:13,color:"#8899bb",lineHeight:1.7}}>
          <span style={{color:sel===q.answer?"#4ade80":"#f87171",fontWeight:600}}>{sel===q.answer?"Correct! ":"Not quite. "}</span>{q.exp}
        </div>
      )}
      <div style={{textAlign:"right"}}>
        {!confirmed
          ?<button onClick={confirm} disabled={sel===null} style={{background:sel===null?"rgba(255,255,255,0.05)":algo.color,color:sel===null?"#475569":"#000",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:sel===null?"not-allowed":"pointer",fontFamily:"'Rajdhani',sans-serif",transition:"all 0.2s"}}>Check Answer</button>
          :<button onClick={next} style={{background:algo.color,color:"#000",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif"}}>{qi<algo.questions.length-1?"Next →":"See Results →"}</button>
        }
      </div>
    </div>
  );
}

function AlgoDetail({algo,onClose,onLevelComplete}) {
  const [tab,setTab]=useState("learn");
  const [codeTestResults, setCodeTestResults] = useState(null);
  
  const handleCodeSubmit = (allPassed, results) => {
    setCodeTestResults(results);
  };
  
  const handleLevelComplete = () => {
    if (onLevelComplete) {
      onLevelComplete(algo.level);
    }
  };
  
  return (
    <div style={{position:"fixed",inset:0,zIndex:50,background:"rgba(5,11,26,0.88)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"linear-gradient(135deg,#050b1a,#07101f)",border:"1px solid rgba(74,158,255,0.2)",borderRadius:24,width:"100%",maxWidth:760,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 40px 80px rgba(0,0,0,0.6)"}}>
        {}
        <div style={{padding:"24px 28px 0",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:46,height:46,borderRadius:13,background:`${algo.color}1e`,border:`1px solid ${algo.color}40`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:18,height:18,borderRadius:4,background:algo.color,opacity:0.9}}/>
              </div>
              <div>
                <div style={{fontSize:22,fontWeight:700,color:"#e8f0fe",fontFamily:"'Rajdhani',sans-serif",letterSpacing:-0.4}}>{algo.name}</div>
                <div style={{fontSize:12,color:"#8899bb",marginTop:2}}>{algo.tagline}</div>
              </div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,width:36,height:36,cursor:"pointer",color:"#8899bb",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          {}
          <div style={{display:"flex",gap:8,marginBottom:18}}>
            {[
              ["Time",algo.complexity],
              ["Space",algo.space], 
              ["Stable",algo.stable?"Yes":"No"],
              ["Level",algo.difficulty]
            ].map(([l,v])=>(
              <div key={l} style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:"#334155",fontFamily:"'Rajdhani',sans-serif",textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{l}</div>
                <div style={{fontSize:12,fontWeight:600,color:"#cbd5e1",fontFamily:"'Rajdhani',sans-serif"}}>{v}</div>
              </div>
            ))}
          </div>
          {}
          <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:4}}>
            {["learn","code","quiz"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"9px 14px",borderRadius:9,border:tab===t?`1px solid ${algo.color}44`:"1px solid transparent",background:tab===t?`${algo.color}1e`:"transparent",color:tab===t?algo.color:"#8899bb",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.2s"}}>
                {t==="learn"?"📊 Visualize":t==="code"?"💻 Code":"🎯 Quiz"}
              </button>
            ))}
          </div>
        </div>
        {}
        <div style={{flex:1,overflowY:"auto",padding:"22px 28px 28px"}}>
          {tab==="learn"&&<div><p style={{fontSize:14,color:"#8899bb",lineHeight:1.7,marginBottom:22}}>{algo.description}</p><Visualizer steps={algo.steps} color={algo.color} accent={algo.accent}/></div>}
          {tab==="code"&&(
            <div>
              <p style={{fontSize:14,color:"#8899bb",lineHeight:1.7,marginBottom:18}}>Write your Java implementation and test it against multiple test cases. Your code must pass all tests to proceed!</p>
              <CodeIDE 
                algorithm={algo} 
                onCodeSubmit={handleCodeSubmit}
                testResults={codeTestResults}
              />
            </div>
          )}
          {tab==="quiz"&&<Quiz algo={algo} onBack={onClose} onLevelComplete={handleLevelComplete}/>}
        </div>
      </div>
    </div>
  );
}

function AlgoCard({algo,index,onSelect,unlockedLevels}) {
  const [hovered,setHovered]=useState(false);
  
  const isUnlocked = algo.level <= unlockedLevels;
  const isLocked = !isUnlocked;
  
  const handleClick = () => {
    if (isUnlocked) {
      onSelect(algo);
    }
  };
  
  return (
    <div onClick={handleClick} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{
        background:isLocked ? "rgba(30,30,30,0.6)" : (hovered?`linear-gradient(135deg,${algo.color}0d 0%,rgba(5,11,26,0.9) 100%)`:"rgba(5,11,26,0.6)"),
        border:isLocked ? "1px solid rgba(255,255,255,0.1)" : (hovered?`${algo.color}44`:"rgba(74,158,255,0.07)"),
        borderRadius:20,padding:"24px",
        cursor:isLocked ? "not-allowed" : "pointer",
        transition:"all 0.3s cubic-bezier(.4,0,.2,1)",
        transform:hovered&&!isLocked?"translateY(-4px)":"none",
        boxShadow:hovered&&!isLocked?`0 20px 40px rgba(0,0,0,0.4),0 0 0 1px ${algo.color}22`:"0 4px 16px rgba(0,0,0,0.2)",
        animation:`slideUp 0.4s ease ${index*0.07}s both`,
        backdropFilter:"blur(12px)",
        position:"relative",
        overflow:"hidden",
        opacity:isLocked ? 0.7 : 1
      }}>
      
      {}
      {isLocked && (
        <div style={{
          position:"absolute",
          inset:0,
          background:"rgba(0,0,0,0.5)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          borderRadius:20,
          zIndex:10
        }}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:8}}>🔒</div>
            <div style={{fontSize:12,color:"#8899bb",fontWeight:600}}>Complete Level {algo.level - 1} to unlock</div>
          </div>
        </div>
      )}
      
      <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,borderRadius:"50%",background:`${algo.color}08`,filter:"blur(20px)",pointerEvents:"none",opacity:hovered?1:0,transition:"opacity 0.3s"}}/>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:16}}>
        <div style={{width:42,height:42,borderRadius:12,background:isLocked ? "rgba(255,255,255,0.1)" : `${algo.color}18`,border:isLocked ? "1px solid rgba(255,255,255,0.2)" : `1px solid ${algo.color}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:16,height:16,borderRadius:3,background:isLocked ? "rgba(255,255,255,0.3)" : algo.color,opacity:isLocked ? 0.5 : 0.85}}/>
        </div>
        <div style={{display:"flex",gap:6}}>
          <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"rgba(255,255,255,0.06)",color:isLocked ? "#666" : "#8899bb",fontFamily:"'Rajdhani',sans-serif"}}>{algo.complexity}</span>
          <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:isLocked ? "rgba(255,255,255,0.1)" : `${algo.color}15`,color:isLocked ? "#666" : algo.color,fontFamily:"'Rajdhani',sans-serif",border:isLocked ? "1px solid rgba(255,255,255,0.2)" : `1px solid ${algo.color}33`}}>Lv.{algo.level}</span>
        </div>
      </div>
      <div style={{fontSize:20,fontWeight:700,color:isLocked ? "#666" : "#e8f0fe",marginBottom:4,fontFamily:"'Rajdhani',sans-serif",letterSpacing:-0.3}}>{algo.name}</div>
      <div style={{fontSize:12,color:isLocked ? "#666" : "#8899bb",marginBottom:12}}>{algo.tagline}</div>
      <div style={{fontSize:13,color:isLocked ? "#666" : "#8899bb",lineHeight:1.6,marginBottom:18}}>{algo.description.slice(0,100)}…</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:8}}>
          {[algo.stable?"Stable":"Unstable",algo.difficulty].map(t=><span key={t} style={{fontSize:11,padding:"3px 9px",borderRadius:6,background:"rgba(255,255,255,0.04)",color:isLocked ? "#666" : "#8899bb"}}>{t}</span>)}
        </div>
        <span style={{fontSize:13,color:(hovered&&!isLocked)?algo.color:(isLocked?"#666":"#334155"),fontWeight:600,transition:"color 0.2s"}}>
          {isLocked ? "🔒 Locked" : "Explore →"}
        </span>
      </div>
    </div>
  );
}

export default function SortingGame({ onBackToIsland }) {
  const [selected,setSelected]=useState(null); const [filter,setFilter]=useState("all");
  
  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const saved = localStorage.getItem('sortingGameUnlockedLevels');
    const savedLevel = saved ? parseInt(saved) : 1;
    
    const currentUser = authService.getCurrentUser();
    const xpLevel = (currentUser && currentUser.xp !== undefined) ? Math.floor(currentUser.xp / 1000) + 1 : 1;
    
    // Always use the max of localStorage and XP-based level
    return Math.max(savedLevel, xpLevel);
  });
  
  const filtered=filter==="all"?algorithms:algorithms.filter(a=>String(a.level)===filter);
  
  useEffect(() => {
    const updateLevelsFromXP = () => {
      const currentUser = authService.getCurrentUser();
      const saved = localStorage.getItem('sortingGameUnlockedLevels');
      const savedLevel = saved ? parseInt(saved) : 1;
      
      if (currentUser && currentUser.xp !== undefined) {
        const xpLevel = Math.floor(currentUser.xp / 1000) + 1;
        // Only update if XP level is HIGHER than saved level (never allow re-locking)
        const newUnlockedLevel = xpLevel > savedLevel ? xpLevel : savedLevel;
        
        console.log('Updating sorting game levels from XP:', currentUser.xp, '→ Level', newUnlockedLevel, 'Saved:', savedLevel);
        setUnlockedLevels(newUnlockedLevel);
        localStorage.setItem('sortingGameUnlockedLevels', newUnlockedLevel.toString());
      }
    };
    
    updateLevelsFromXP();
    
    const interval = setInterval(updateLevelsFromXP, 2000);
    
    const onReset = () => {
      try {
        const saved = localStorage.getItem('sortingGameUnlockedLevels');
        const savedLevel = saved ? parseInt(saved) : 1;
        const currentUser = authService.getCurrentUser();
        const xpLevel = (currentUser && currentUser.xp !== undefined) ? Math.floor(currentUser.xp / 1000) + 1 : 1;
        // Always keep the higher level to prevent re-locking
        const newLevel = Math.max(savedLevel, xpLevel);
        console.log('Received sortingGameReset event — maintaining unlockedLevels at', newLevel);
        setUnlockedLevels(newLevel);
        localStorage.setItem('sortingGameUnlockedLevels', newLevel.toString());
      } catch (err) {
        console.warn('Error handling sortingGameReset:', err);
      }
    };
    window.addEventListener('sortingGameReset', onReset);
    return () => { clearInterval(interval); window.removeEventListener('sortingGameReset', onReset); };
  }, []);
  
  const unlockNextLevel = (completedLevel) => {
    console.log('Level completed:', completedLevel);
    console.log('Previous unlocked levels:', unlockedLevels);
    setUnlockedLevels(prev => {
      const newLevel = Math.max(prev, completedLevel + 1);
      console.log('New unlocked levels:', newLevel);
      // Always persist to localStorage to prevent re-locking
      localStorage.setItem('sortingGameUnlockedLevels', newLevel.toString());
      return newLevel;
    });
  };
  
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg, #050b1a 0%, #07101f 50%, #05080f 100%)",fontFamily:"'Rajdhani',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono&display=swap" rel="stylesheet"/>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
          *{box-sizing:border-box;margin:0;padding:0}
          ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0f172a}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:3px}
          input::placeholder{color:#334155}
        `
      }} />

      {}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"10%",left:"12%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,#4A9EFF07 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",top:"50%",right:"8%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,#1a4a9a07 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"28%",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,#0d2a5e07 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.013) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.013) 1px,transparent 1px)",backgroundSize:"60px 60px"}}/>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"52px 24px 80px"}}>
        {}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:50,animation:"slideUp 0.5s ease",flexWrap:"wrap",gap:20}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(74,158,255,0.1)",border:"1px solid rgba(74,158,255,0.2)",borderRadius:20,padding:"6px 14px",marginBottom:18}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#4A9EFF"}}/>
              <span style={{fontSize:12,color:"#4A9EFF",fontWeight:600,letterSpacing:0.5}}>NEUROVERSE · LEVEL 3 MODULE</span>
            </div>
            <h1 style={{fontSize:"clamp(32px,6vw,56px)",fontWeight:800,color:"#f8fafc",fontFamily:"'Rajdhani',sans-serif",letterSpacing:-1.5,lineHeight:1.1,marginBottom:14}}>
              Sorting<br/>
              <span style={{background:"linear-gradient(135deg,#4A9EFF,#1a4a9a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Algorithms</span>
            </h1>
            <p style={{fontSize:15,color:"#8899bb",maxWidth:480,lineHeight:1.7}}>Visualize, study the code, take the quiz — master the art of sorting algorithms.</p>
          </div>
          <button onClick={onBackToIsland} style={{display:"flex",alignItems:"center",gap:10,background:"rgba(74,158,255,0.08)",border:"1px solid rgba(74,158,255,0.25)",borderRadius:14,padding:"14px 22px",cursor:"pointer",color:"#4A9EFF",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,transition:"all 0.2s",flexShrink:0}}>
            ← Back to Island
          </button>
        </div>

        {}
        <div style={{display:"flex",gap:8,marginBottom:32,animation:"slideUp 0.5s ease 0.1s both"}}>
          {[{id:"all",label:"All Algorithms"},{id:"1",label:"Level 1"},{id:"2",label:"Level 2"},{id:"3",label:"Level 3"}].map(l=>(
            <button key={l.id} onClick={()=>setFilter(l.id)} style={{background:filter===l.id?"rgba(74,158,255,0.15)":"rgba(255,255,255,0.04)",border:`1px solid ${filter===l.id?"rgba(74,158,255,0.4)":"rgba(255,255,255,0.08)"}`,color:filter===l.id?"#4A9EFF":"#475569",borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",transition:"all 0.2s"}}>
              {l.label}
            </button>
          ))}
        </div>

        {}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:20}}>
          {filtered.map((algo,i)=><AlgoCard key={algo.id} algo={algo} index={i} onSelect={setSelected} unlockedLevels={unlockedLevels}/>)}
        </div>

        {}
        <div style={{marginTop:56,padding:"18px 22px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,display:"flex",gap:14,alignItems:"center",animation:"slideUp 0.5s ease 0.4s both"}}>
          <div style={{fontSize:20}}>💡</div>
          <div style={{fontSize:13,color:"#334155",lineHeight:1.6}}>Choose an algorithm to visualize its steps, study the implementation, and test your knowledge with interactive quizzes.</div>
        </div>
      </div>

      {selected&&<AlgoDetail algo={selected} onClose={()=>setSelected(null)} onLevelComplete={unlockNextLevel}/>}
    </div>
  );
}
