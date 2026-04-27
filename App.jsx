cat > /home/claude/App_fixed.jsx << 'ENDOFFILE'
import{useState,useEffect,useMemo}from"react";
import{PieChart,Pie,Cell,BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,Legend,AreaChart,Area,LineChart,Line}from"recharts";
import{Home,TrendingUp,TrendingDown,CreditCard,Target,Calculator,BarChart2,Plus,Trash2,ChevronDown,Activity,Wallet,ArrowUp,ArrowDown}from"lucide-react";

const injectFonts=()=>{
  if(document.getElementById("fp-fonts"))return;
  const l=document.createElement("link");
  l.id="fp-fonts";l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;600&display=swap";
  document.head.appendChild(l);
  const s=document.createElement("style");
  s.textContent="*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}input,select{outline:none}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#3D4466;border-radius:4px}@keyframes sd{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}@keyframes fi{from{opacity:0}to{opacity:1}}.sd{animation:sd .18s ease}.fi{animation:fi .25s ease}body{margin:0;background:#0F1523}";
  document.head.appendChild(s);
};

const C={bg:"#0F1523",bg2:"#151B2A",card:"#1E2640",card2:"#252D47",border:"#2D3554",blue:"#4FC3F7",blue2:"#1976D2",green:"#4CAF82",red:"#F05365",orange:"#FF9A3C",purple:"#9B7FEA",yellow:"#FFD166",teal:"#26C6DA",white:"#EEF2FF",gray:"#8892B0"};
const PCOLS=["#4FC3F7","#4CAF82","#F05365","#FF9A3C","#9B7FEA","#FFD166","#26C6DA","#EC407A","#42A5F5"];
const FB="'Manrope',sans-serif",FH="'Syne',sans-serif",FN="'JetBrains Mono',monospace";
const MONTHS=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const getYM=d=>{const dt=new Date(d+"T12:00:00");return{y:dt.getFullYear(),m:dt.getMonth()}};
const dStr=(y,m,d)=>`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
const fmtK=n=>{const v=n||0;if(Math.abs(v)>=1e6)return`$${(v/1e6).toFixed(1)}M`;if(Math.abs(v)>=1e3)return`$${(v/1e3).toFixed(0)}K`;return`$${Math.round(v).toLocaleString()}`};
const pct=v=>`${((v||0)*100).toFixed(1)}%`;
const now=new Date(),cy=now.getFullYear(),cm=now.getMonth();

const calcNPER=(r,pmt,pv)=>{const rm=r/12;if(!rm||pmt<=0||pv<=0)return 0;if(pmt<=rm*pv)return 999;try{return Math.max(0,Math.ceil(Math.log(pmt/(pmt-rm*pv))/Math.log(1+rm)))}catch{return 999}};
const calcPMT=(goal,current,months,r)=>{if(months<=0)return 0;const rm=r/12;if(!rm)return Math.max(0,(goal-current)/months);const f=Math.pow(1+rm,months);return Math.max(0,(goal-current*f)*rm/(f-1))};

const INIT={
  ingresos:[
    {id:1,fecha:dStr(cy,cm-2,15),fuente:"Salario Empresa",tipo:"Activo",monto:35000},
    {id:2,fecha:dStr(cy,cm-2,25),fuente:"Freelance",tipo:"Activo",monto:8000},
    {id:3,fecha:dStr(cy,cm-1,15),fuente:"Salario Empresa",tipo:"Activo",monto:35000},
    {id:4,fecha:dStr(cy,cm-1,20),fuente:"Renta Depto",tipo:"Pasivo",monto:5000},
    {id:5,fecha:dStr(cy,cm,15),fuente:"Salario Empresa",tipo:"Activo",monto:37000},
    {id:6,fecha:dStr(cy,cm,18),fuente:"Dividendos ETFs",tipo:"Pasivo",monto:2400},
  ],
  gastos:[
    {id:1,fecha:dStr(cy,cm-2,1),categoria:"Vivienda",desc:"Renta mensual",monto:12000},
    {id:2,fecha:dStr(cy,cm-2,5),categoria:"Alimentación",desc:"Supermercado",monto:3200},
    {id:3,fecha:dStr(cy,cm-2,10),categoria:"Transporte",desc:"Gasolina",monto:1800},
    {id:4,fecha:dStr(cy,cm-1,1),categoria:"Vivienda",desc:"Renta mensual",monto:12000},
    {id:5,fecha:dStr(cy,cm-1,5),categoria:"Alimentación",desc:"Supermercado",monto:2900},
    {id:6,fecha:dStr(cy,cm-1,12),categoria:"Ocio",desc:"Restaurantes",monto:2500},
    {id:7,fecha:dStr(cy,cm,1),categoria:"Vivienda",desc:"Renta mensual",monto:12000},
    {id:8,fecha:dStr(cy,cm,5),categoria:"Alimentación",desc:"Supermercado",monto:3500},
    {id:9,fecha:dStr(cy,cm,10),categoria:"Transporte",desc:"Gasolina",monto:1700},
    {id:10,fecha:dStr(cy,cm,14),categoria:"Salud",desc:"Médico",monto:1200},
  ],
  inversiones:[
    {id:1,tipo:"ETF",nombre:"VOO – S&P 500",capital:85000,valorActual:102500,riesgo:"Bajo"},
    {id:2,tipo:"ETF",nombre:"QQQ – Nasdaq 100",capital:42000,valorActual:51800,riesgo:"Medio"},
    {id:3,tipo:"Acción",nombre:"AAPL – Apple",capital:18000,valorActual:21500,riesgo:"Medio"},
    {id:4,tipo:"Acción",nombre:"MSFT – Microsoft",capital:15000,valorActual:19200,riesgo:"Medio"},
    {id:5,tipo:"Crypto",nombre:"Bitcoin (BTC)",capital:10000,valorActual:14300,riesgo:"Muy Alto"},
    {id:6,tipo:"Crypto",nombre:"Ethereum (ETH)",capital:5000,valorActual:6100,riesgo:"Muy Alto"},
    {id:7,tipo:"CETES",nombre:"CETES 28 días",capital:50000,valorActual:52500,riesgo:"Bajo"},
    {id:8,tipo:"Inmueble",nombre:"FIBRA Uno",capital:30000,valorActual:28500,riesgo:"Medio"},
  ],
  tarjetas:[
    {id:1,banco:"Banamex VISA Oro",limite:60000,saldo:18500,tasaAnual:24,diaCorte:20,diaPago:5},
    {id:2,banco:"BBVA MC Azul",limite:40000,saldo:32000,tasaAnual:28.8,diaCorte:10,diaPago:25},
    {id:3,banco:"Santander VISA",limite:80000,saldo:5200,tasaAnual:21.6,diaCorte:15,diaPago:30},
  ],
  deudas:[
    {id:1,tipo:"Auto",acreedor:"Nissan Financial",montoOrig:250000,saldo:185000,tasaAnual:9.5,pagoMens:4200},
    {id:2,tipo:"Personal",acreedor:"HSBC",montoOrig:80000,saldo:62000,tasaAnual:18,pagoMens:3500},
    {id:3,tipo:"Estudiantil",acreedor:"BBVA",montoOrig:120000,saldo:95000,tasaAnual:7,pagoMens:2800},
  ],
  metas:[
    {id:1,nombre:"🏥 Fondo Emergencia",objetivo:150000,actual:45000,fechaObj:`${cy}-12-31`,prioridad:"Alta"},
    {id:2,nombre:"✈️ Viaje a Europa",objetivo:80000,actual:15000,fechaObj:`${cy+1}-06-30`,prioridad:"Media"},
    {id:3,nombre:"🚗 Auto Nuevo",objetivo:300000,actual:80000,fechaObj:`${cy+2}-01-31`,prioridad:"Media"},
    {id:4,nombre:"🏠 Enganche Casa",objetivo:600000,actual:50000,fechaObj:`${cy+3}-12-31`,prioridad:"Alta"},
  ],
};

// ── UI Components ─────────────────────────────────────────────────────────────
const Card=({children,style={}})=><div style={{background:C.card,borderRadius:16,padding:16,marginBottom:12,border:`1px solid ${C.border}`,...style}}>{children}</div>;
const Num=({children,color=C.white,size=18})=><span style={{fontFamily:FN,fontSize:size,fontWeight:600,color}}>{children}</span>;
const Badge=({text,color})=><span style={{background:color+"20",color,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700,fontFamily:FB}}>{text}</span>;
const BP=({value,max=1,color=C.green,height=6})=><div style={{background:C.card2,borderRadius:999,height,overflow:"hidden"}}><div style={{width:`${Math.min(100,(value/(max||1))*100)}%`,background:color,height:"100%",borderRadius:999,transition:"width .6s"}}/></div>;
const DelBtn=({onClick})=><button onClick={onClick} style={{background:"none",border:"none",cursor:"pointer",padding:4,opacity:.6}}><Trash2 size={15} color={C.red}/></button>;
const AddBtn=({onClick,color=C.blue,label="Agregar"})=><button onClick={onClick} style={{display:"flex",alignItems:"center",gap:6,background:color+"22",border:`1px solid ${color}44`,borderRadius:24,padding:"7px 14px",cursor:"pointer",color,fontSize:13,fontFamily:FB,fontWeight:600}}><Plus size={14}/>{label}</button>;
const SaveBtn=({onClick,color=C.blue,label="Guardar"})=><button onClick={onClick} style={{width:"100%",background:`linear-gradient(135deg,${color},${color}CC)`,border:"none",borderRadius:14,padding:14,color:"#fff",fontSize:15,fontWeight:700,fontFamily:FB,cursor:"pointer",marginTop:8,boxShadow:`0 4px 20px ${color}44`}}>{label}</button>;
const TTS={contentStyle:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,fontSize:12,fontFamily:FB},cursor:{fill:C.card2}};
const AXS={fill:C.gray,fontSize:11,fontFamily:FB};

const Field=({label,value,onChange,type="text",options,placeholder=""})=>(
  <div style={{marginBottom:12}}>
    {label&&<div style={{fontSize:11,color:C.gray,marginBottom:5,fontFamily:FB,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>}
    {options
      ?<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 12px",background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,color:C.white,fontSize:14,fontFamily:FB}}>{options.map(o=><option key={o} value={o} style={{background:C.card2}}>{o}</option>)}</select>
      :<input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(type==="number"?(parseFloat(e.target.value)||0):e.target.value)} style={{width:"100%",padding:"10px 12px",background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,color:C.white,fontSize:14,fontFamily:FB}}/>
    }
  </div>
);

const Sheet=({title,onClose,children})=>(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} className="fi">
    <div style={{background:C.bg2,borderRadius:"24px 24px 0 0",padding:"20px 20px 36px",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto",border:`1px solid ${C.border}`}} className="sd">
      <div style={{width:40,height:4,background:C.border,borderRadius:999,margin:"0 auto 20px"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <span style={{fontFamily:FH,fontSize:17,fontWeight:700,color:C.white}}>{title}</span>
        <button onClick={onClose} style={{background:C.card2,border:"none",borderRadius:10,padding:"6px 8px",cursor:"pointer",color:C.gray}}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const KPI=({label,value,sub,color=C.blue,Icon,trend})=>(
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px 16px",flex:1,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-10,right:-10,width:60,height:60,borderRadius:"50%",background:color+"12"}}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
      <span style={{fontSize:10,color:C.gray,textTransform:"uppercase",letterSpacing:1,fontFamily:FB,fontWeight:600}}>{label}</span>
      {Icon&&<Icon size={15} color={color} style={{opacity:.8}}/>}
    </div>
    <Num color={color} size={17}>{value}</Num>
    {sub&&<div style={{fontSize:11,color:C.gray,marginTop:4,fontFamily:FB}}>{sub}</div>}
    {trend!==undefined&&<div style={{display:"flex",alignItems:"center",gap:3,marginTop:4}}>{trend>=0?<ArrowUp size={11} color={C.green}/>:<ArrowDown size={11} color={C.red}/>}<span style={{fontSize:11,color:trend>=0?C.green:C.red,fontFamily:FB}}>{Math.abs(trend).toFixed(1)}%</span></div>}
  </div>
);

const Sem=({value,low,high,inv=false,labels=["Riesgo","Cuidado","Saludable"]})=>{
  let color,label;
  if(!inv){if(value>=high){color=C.green;label=labels[2]}else if(value>=low){color=C.orange;label=labels[1]}else{color=C.red;label=labels[0]}}
  else{if(value<=low){color=C.green;label=labels[2]}else if(value<=high){color=C.orange;label=labels[1]}else{color=C.red;label=labels[0]}}
  return<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`}}/><span style={{fontSize:12,color,fontFamily:FB,fontWeight:600}}>{label}</span></div>
};

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function Dashboard({data}){
  const y=cy,m=cm;
  const ingMes=useMemo(()=>data.ingresos.filter(i=>{const d=getYM(i.fecha);return d.y===y&&d.m===m}).reduce((s,i)=>s+i.monto,0),[data.ingresos]);
  const gasMes=useMemo(()=>data.gastos.filter(g=>{const d=getYM(g.fecha);return d.y===y&&d.m===m}).reduce((s,g)=>s+g.monto,0),[data.gastos]);
  const totalP=useMemo(()=>data.inversiones.reduce((s,i)=>s+i.valorActual,0),[data.inversiones]);
  const capT=useMemo(()=>data.inversiones.reduce((s,i)=>s+i.capital,0),[data.inversiones]);
  const rend=totalP-capT;
  const totD=useMemo(()=>data.deudas.reduce((s,d)=>s+d.saldo,0)+data.tarjetas.reduce((s,t)=>s+t.saldo,0),[data.deudas,data.tarjetas]);
  const flujo=ingMes-gasMes;
  const ratioAh=ingMes>0?flujo/ingMes:0;
  const pagoD=data.deudas.reduce((s,d)=>s+d.pagoMens,0)+data.tarjetas.reduce((s,t)=>s+Math.max(t.saldo*.05,200),0);
  const ratioD=ingMes>0?pagoD/ingMes:0;
  const score=useMemo(()=>{let s=0;s+=Math.min(40,Math.max(0,ratioAh*200));s+=ratioD<.3?30:ratioD<.5?15:0;s+=totalP>0?20:0;const mp=data.metas.reduce((a,m2)=>a+Math.min(1,m2.actual/m2.objetivo),0)/Math.max(1,data.metas.length);s+=mp*10;return Math.round(Math.min(100,s))},[ratioAh,ratioD,totalP,data.metas]);
  const scoreC=score>=70?C.green:score>=40?C.orange:C.red;
  const barData=useMemo(()=>Array.from({length:5},(_,i)=>{const mi=((m-4+i)+12)%12,yi=y+Math.floor((m-4+i)/12);const ing=data.ingresos.filter(x=>{const d=getYM(x.fecha);return d.y===yi&&d.m===mi}).reduce((s,x)=>s+x.monto,0);const gas=data.gastos.filter(x=>{const d=getYM(x.fecha);return d.y===yi&&d.m===mi}).reduce((s,x)=>s+x.monto,0);return{name:MONTHS[mi],Ingresos:ing,Gastos:gas}}),[data]);
  const pieData=useMemo(()=>{const g={};data.inversiones.forEach(i=>{g[i.tipo]=(g[i.tipo]||0)+i.valorActual});return Object.entries(g).map(([name,value])=>({name,value}))},[data.inversiones]);

  return(
    <div className="fi">
      <div style={{background:`linear-gradient(135deg,${C.card},${C.card2})`,border:`1px solid ${C.border}`,borderRadius:20,padding:20,marginBottom:12,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:C.blue+"0A"}}/>
        <div style={{fontSize:10,color:C.gray,textTransform:"uppercase",letterSpacing:1.5,fontFamily:FB,fontWeight:700,marginBottom:6}}>{MONTHS[m].toUpperCase()} {y} — FLUJO NETO</div>
        <div style={{fontFamily:FN,fontSize:36,fontWeight:600,color:flujo>=0?C.green:C.red}}>{fmtK(flujo)}</div>
        <div style={{fontSize:12,color:C.gray,fontFamily:FB,marginTop:4}}>Tasa de ahorro: <span style={{color:ratioAh>=.2?C.green:ratioAh>=.1?C.orange:C.red,fontWeight:600}}>{pct(ratioAh)}</span></div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:10}}>
        <KPI label="Ingresos" value={fmtK(ingMes)} color={C.green} Icon={TrendingUp} sub={`${data.ingresos.filter(i=>{const d=getYM(i.fecha);return d.y===y&&d.m===m}).length} fuentes`}/>
        <KPI label="Gastos" value={fmtK(gasMes)} color={C.red} Icon={TrendingDown} sub={`${data.gastos.filter(g=>{const d=getYM(g.fecha);return d.y===y&&d.m===m}).length} mov.`}/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:12}}>
        <KPI label="Portafolio" value={fmtK(totalP)} color={C.blue} Icon={BarChart2} sub={`${rend>=0?"+":""}${fmtK(rend)}`} trend={capT>0?(rend/capT)*100:0}/>
        <KPI label="Deuda Total" value={fmtK(totD)} color={C.orange} Icon={CreditCard}/>
      </div>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:C.white}}>Score Financiero</div><div style={{fontSize:11,color:C.gray,fontFamily:FB,marginTop:2}}>Salud financiera general</div></div>
          <div style={{textAlign:"right"}}><div style={{fontFamily:FN,fontSize:30,fontWeight:600,color:scoreC}}>{score}</div><div style={{fontSize:10,color:C.gray,fontFamily:FB}}>/100</div></div>
        </div>
        <BP value={score} max={100} color={scoreC} height={8}/>
        <div style={{display:"flex",gap:12,marginTop:14}}>
          {[{l:"Ahorro",v:pct(ratioAh),c:ratioAh>=.2?C.green:ratioAh>=.1?C.orange:C.red},{l:"Deuda/Ing.",v:pct(ratioD),c:ratioD<=.3?C.green:ratioD<=.5?C.orange:C.red},{l:"Activos",v:data.inversiones.length,c:C.blue},{l:"Metas",v:data.metas.length,c:C.purple}].map(({l,v,c})=>(
            <div key={l} style={{flex:1,textAlign:"center"}}><div style={{fontFamily:FN,fontSize:14,fontWeight:600,color:c}}>{v}</div><div style={{fontSize:10,color:C.gray,fontFamily:FB,marginTop:2}}>{l}</div></div>
          ))}
        </div>
      </Card>
      {pieData.length>0&&(
        <Card>
          <div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:C.white,marginBottom:14}}>Distribución del Portafolio</div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:130,height:130,flexShrink:0}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={4} startAngle={90} endAngle={-270}>{pieData.map((_,i)=><Cell key={i} fill={PCOLS[i%PCOLS.length]}/>)}</Pie><Tooltip formatter={v=>fmtK(v)} contentStyle={TTS.contentStyle}/></PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{flex:1}}>
              {pieData.map((d,i)=>(
                <div key={d.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:9,height:9,borderRadius:3,background:PCOLS[i%PCOLS.length],flexShrink:0}}/><span style={{fontSize:12,color:C.white,fontFamily:FB}}>{d.name}</span></div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:FN,fontSize:12,fontWeight:600,color:PCOLS[i%PCOLS.length]}}>{pct(d.value/totalP)}</div><div style={{fontSize:10,color:C.gray}}>{fmtK(d.value)}</div></div>
                </div>
              ))}
              <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.gray,fontFamily:FB}}>Total portafolio</div><div style={{fontFamily:FN,fontSize:16,fontWeight:600,color:C.blue}}>{fmtK(totalP)}</div></div>
            </div>
          </div>
        </Card>
      )}
      <Card>
        <div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:C.white,marginBottom:14}}>Ingresos vs Gastos — 5 meses</div>
        <ResponsiveContainer width="100%" height={165}>
          <BarChart data={barData} barCategoryGap="25%" barGap={3}>
            <XAxis dataKey="name" tick={AXS} axisLine={false} tickLine={false}/><YAxis tick={{...AXS,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/><Tooltip formatter={v=>fmtK(v)} contentStyle={TTS.contentStyle} cursor={TTS.cursor}/><Legend wrapperStyle={{fontSize:12,fontFamily:FB}}/><Bar dataKey="Ingresos" fill={C.green} radius={[5,5,0,0]}/><Bar dataKey="Gastos" fill={C.red} radius={[5,5,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {data.metas.length>0&&(
        <Card>
          <div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:C.white,marginBottom:14}}>🎯 Metas Financieras</div>
          {data.metas.map(meta=>{const p=Math.min(1,meta.actual/meta.objetivo);const col=p>=1?C.blue:p>=.75?C.green:p>=.4?C.orange:C.red;return(<div key={meta.id} style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:C.white,fontFamily:FB}}>{meta.nombre}</span><span style={{fontFamily:FN,fontSize:13,fontWeight:600,color:col}}>{pct(p)}</span></div><BP value={p} max={1} color={col} height={7}/><div style={{display:"flex",justifyContent:"space-between",marginTop:3}}><span style={{fontSize:10,color:C.gray,fontFamily:FB}}>{fmtK(meta.actual)}</span><span style={{fontSize:10,color:C.gray,fontFamily:FB}}>{fmtK(meta.objetivo)}</span></div></div>)})}
        </Card>
      )}
      <Card>
        <div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:C.white,marginBottom:14}}>🚦 Indicadores Clave</div>
        {[{l:"Ratio de Ahorro",c:<Sem value={ratioAh} low={.1} high={.2} labels={["Bajo","Cuidado","Saludable"]}/>},{l:"Ratio Deuda/Ingreso",c:<Sem value={ratioD} low={.3} high={.5} inv labels={["Saludable","Cuidado","Riesgo"]}/>},{l:"Flujo Mensual",c:<Sem value={flujo} low={0} high={5000} labels={["Negativo","Ajustado","Positivo"]}/>},{l:"Score Financiero",c:<Sem value={score} low={40} high={70} labels={["Bajo","Regular","Bueno"]}/>}].map(({l,c})=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:13,color:C.gray,fontFamily:FB}}>{l}</span>{c}</div>
        ))}
        <div style={{background:C.card2,borderRadius:12,padding:12,marginTop:4}}>
          <div style={{fontSize:10,color:C.gray,fontFamily:FB,marginBottom:5,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>💡 Sugerencia</div>
          <div style={{fontSize:12,color:C.white,fontFamily:FB,lineHeight:1.6}}>{score>=70?"¡Excelente! Considera aumentar aportaciones a inversiones de largo plazo.":ratioD>.5?"Tu ratio de deuda es alto. Prioriza pagar las de mayor tasa.":ratioAh<.1?"Tu tasa de ahorro es baja. Reduce gastos discrecionales para llegar al 20%+.":"Vas por buen camino. Mantén consistencia para mejorar tu score."}</div>
        </div>
      </Card>
    </div>
  );
}

// ── INGRESOS ──────────────────────────────────────────────────────────────────
function Ingresos({data,setData}){
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({fecha:dStr(cy,cm,now.getDate()),fuente:"",tipo:"Activo",monto:""});
  const mesI=data.ingresos.filter(i=>{const d=getYM(i.fecha);return d.y===cy&&d.m===cm});
  const mesMonto=mesI.reduce((s,i)=>s+i.monto,0);
  const totalAnio=data.ingresos.filter(i=>getYM(i.fecha).y===cy).reduce((s,i)=>s+i.monto,0);
  const add=()=>{if(!form.fuente||!form.monto)return;setData(d=>({...d,ingresos:[...d.ingresos,{...form,monto:parseFloat(form.monto)||0,id:Date.now()}]}));setForm({fecha:dStr(cy,cm,now.getDate()),fuente:"",tipo:"Activo",monto:""});setShow(false)};
  const del=id=>setData(d=>({...d,ingresos:d.ingresos.filter(i=>i.id!==id)}));
  const TC={Activo:C.green,Pasivo:C.blue,"Semi-Pasivo":C.teal,Extra:C.yellow};
  const monthly=useMemo(()=>{const g={};data.ingresos.forEach(i=>{const k=getYM(i.fecha);const key=`${k.y}-${k.m}`;g[key]=(g[key]||0)+i.monto});return Object.entries(g).slice(-6).map(([k,v])=>{const[yr,mo]=k.split("-");return{name:MONTHS[parseInt(mo)],v}})},[data.ingresos]);
  return(
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontFamily:FN,fontSize:28,fontWeight:600,color:C.green}}>{fmtK(mesMonto)}</div><div style={{fontSize:12,color:C.gray,fontFamily:FB,marginTop:3}}>Este mes · Año: {fmtK(totalAnio)}</div></div>
        <AddBtn onClick={()=>setShow(true)} color={C.green}/>
      </div>
      {monthly.length>1&&<Card><div style={{fontSize:12,color:C.gray,fontFamily:FB,marginBottom:10,fontWeight:600}}>Evolución mensual</div><ResponsiveContainer width="100%" height={120}><AreaChart data={monthly}><defs><linearGradient id="ingG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={.3}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" tick={AXS} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip formatter={v=>fmtK(v)} contentStyle={TTS.contentStyle}/><Area type="monotone" dataKey="v" stroke={C.green} fill="url(#ingG)" strokeWidth={2} dot={{fill:C.green,r:3}} name="Ingresos"/></AreaChart></ResponsiveContainer></Card>}
      {data.ingresos.slice().reverse().map(ing=>(
        <div key={ing.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:FB,fontSize:14,fontWeight:700,color:C.white}}>{ing.fuente}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><span style={{fontSize:11,color:C.gray}}>{ing.fecha}</span><Badge text={ing.tipo} color={TC[ing.tipo]||C.gray}/></div></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><Num color={C.green} size={15}>{fmtK(ing.monto)}</Num><DelBtn onClick={()=>del(ing.id)}/></div>
        </div>
      ))}
      {show&&<Sheet title="Registrar Ingreso" onClose={()=>setShow(false)}><Field label="Fecha" type="date" value={form.fecha} onChange={v=>setForm({...form,fecha:v})}/><Field label="Fuente / Descripción" value={form.fuente} onChange={v=>setForm({...form,fuente:v})} placeholder="Ej: Salario, Freelance..."/><Field label="Tipo" value={form.tipo} onChange={v=>setForm({...form,tipo:v})} options={["Activo","Pasivo","Semi-Pasivo","Extra"]}/><Field label="Monto ($)" type="number" value={form.monto} onChange={v=>setForm({...form,monto:v})} placeholder="0"/><SaveBtn onClick={add} color={C.green} label="✓  Guardar Ingreso"/></Sheet>}
    </div>
  );
}

// ── GASTOS ────────────────────────────────────────────────────────────────────
const CATS=["Vivienda","Alimentación","Transporte","Salud","Educación","Ocio","Ropa","Tecnología","Servicios","Otros"];
const CC={Vivienda:C.blue,Alimentación:C.green,Transporte:C.orange,Salud:C.purple,Educación:C.teal,Ocio:C.yellow,Ropa:"#EC407A",Tecnología:"#42A5F5",Servicios:C.gray};
function Gastos({data,setData}){
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({fecha:dStr(cy,cm,now.getDate()),categoria:"Alimentación",desc:"",monto:""});
  const mesG=data.gastos.filter(g=>{const d=getYM(g.fecha);return d.y===cy&&d.m===cm});
  const mesMonto=mesG.reduce((s,g)=>s+g.monto,0);
  const byCat=useMemo(()=>{const mp={};mesG.forEach(g=>{mp[g.categoria]=(mp[g.categoria]||0)+g.monto});return Object.entries(mp).sort((a,b)=>b[1]-a[1]).map(([cat,v])=>({cat,v}))},[mesG]);
  const add=()=>{if(!form.desc||!form.monto)return;setData(d=>({...d,gastos:[...d.gastos,{...form,monto:parseFloat(form.monto)||0,id:Date.now()}]}));setForm({fecha:dStr(cy,cm,now.getDate()),categoria:"Alimentación",desc:"",monto:""});setShow(false)};
  const del=id=>setData(d=>({...d,gastos:d.gastos.filter(g=>g.id!==id)}));
  return(
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontFamily:FN,fontSize:28,fontWeight:600,color:C.red}}>{fmtK(mesMonto)}</div><div style={{fontSize:12,color:C.gray,fontFamily:FB,marginTop:3}}>{mesG.length} transacciones este mes</div></div>
        <AddBtn onClick={()=>setShow(true)} color={C.red}/>
      </div>
      {byCat.length>0&&<Card><div style={{fontSize:12,color:C.gray,fontFamily:FB,marginBottom:12,fontWeight:600}}>Por categoría — este mes</div>{byCat.map(({cat,v})=>{const col=CC[cat]||C.gray;return(<div key={cat} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:C.white,fontFamily:FB}}>{cat}</span><span style={{fontFamily:FN,fontSize:12,fontWeight:600,color:col}}>{fmtK(v)}</span></div><BP value={v} max={mesMonto} color={col} height={5}/></div>)})}</Card>}
      {data.gastos.slice().reverse().map(g=>(
        <div key={g.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:FB,fontSize:14,fontWeight:700,color:C.white}}>{g.desc}</div><div style={{display:"flex",gap:6,alignItems:"center",marginTop:4}}><span style={{fontSize:11,color:C.gray}}>{g.fecha}</span><Badge text={g.categoria} color={CC[g.categoria]||C.gray}/></div></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><Num color={C.red} size={15}>{fmtK(g.monto)}</Num><DelBtn onClick={()=>del(g.id)}/></div>
        </div>
      ))}
      {show&&<Sheet title="Registrar Gasto" onClose={()=>setShow(false)}><Field label="Fecha" type="date" value={form.fecha} onChange={v=>setForm({...form,fecha:v})}/><Field label="Descripción" value={form.desc} onChange={v=>setForm({...form,desc:v})} placeholder="¿En qué gastaste?"/><Field label="Categoría" value={form.categoria} onChange={v=>setForm({...form,categoria:v})} options={CATS}/><Field label="Monto ($)" type="number" value={form.monto} onChange={v=>setForm({...form,monto:v})} placeholder="0"/><SaveBtn onClick={add} color={C.red} label="✓  Guardar Gasto"/></Sheet>}
    </div>
  );
}

// ── INVERSIONES ───────────────────────────────────────────────────────────────
function Inversiones({data,setData}){
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({tipo:"ETF",nombre:"",capital:"",valorActual:"",riesgo:"Bajo"});
  const total=data.inversiones.reduce((s,i)=>s+i.valorActual,0);
  const capT=data.inversiones.reduce((s,i)=>s+i.capital,0);
  const rend=total-capT;
  const pieData=useMemo(()=>{const g={};data.inversiones.forEach(i=>{g[i.tipo]=(g[i.tipo]||0)+i.valorActual});return Object.entries(g).map(([name,value])=>({name,value}))},[data.inversiones]);
  const add=()=>{if(!form.nombre||!form.capital)return;const cap=parseFloat(form.capital)||0;const val=parseFloat(form.valorActual)||cap;setData(d=>({...d,inversiones:[...d.inversiones,{...form,capital:cap,valorActual:val,id:Date.now()}]}));setForm({tipo:"ETF",nombre:"",capital:"",valorActual:"",riesgo:"Bajo"});setShow(false)};
  const del=id=>setData(d=>({...d,inversiones:d.inversiones.filter(i=>i.id!==id)}));
  const RC={Bajo:C.green,Medio:C.orange,Alto:C.red,"Muy Alto":C.red};
  return(
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontFamily:FN,fontSize:28,fontWeight:600,color:C.blue}}>{fmtK(total)}</div><div style={{fontSize:12,color:rend>=0?C.green:C.red,fontFamily:FB,marginTop:3,fontWeight:600}}>{rend>=0?"+":""}{fmtK(rend)} · {capT>0?pct(rend/capT):"0%"}</div></div>
        <AddBtn onClick={()=>setShow(true)} color={C.blue}/>
      </div>
      {pieData.length>0&&<Card><div style={{fontFamily:FH,fontSize:13,fontWeight:700,color:C.white,marginBottom:14}}>Distribución por tipo</div><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:130,height:130,flexShrink:0}}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" paddingAngle={4} startAngle={90} endAngle={-270}>{pieData.map((_,i)=><Cell key={i} fill={PCOLS[i%PCOLS.length]}/>)}</Pie><Tooltip formatter={v=>fmtK(v)} contentStyle={TTS.contentStyle}/></PieChart></ResponsiveContainer></div><div style={{flex:1}}>{pieData.map((d,i)=><div key={d.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:9,height:9,borderRadius:3,background:PCOLS[i%PCOLS.length],flexShrink:0}}/><span style={{fontSize:12,color:C.white,fontFamily:FB}}>{d.name}</span></div><div style={{textAlign:"right"}}><div style={{fontFamily:FN,fontSize:12,fontWeight:600,color:PCOLS[i%PCOLS.length]}}>{pct(d.value/total)}</div><div style={{fontSize:10,color:C.gray}}>{fmtK(d.value)}</div></div></div>)}</div></div></Card>}
      {data.inversiones.map(inv=>{const r=inv.valorActual-inv.capital;const rp=inv.capital>0?r/inv.capital:0;return(<div key={inv.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:14,marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{fontFamily:FB,fontSize:14,fontWeight:700,color:C.white}}>{inv.nombre}</div><div style={{display:"flex",gap:6,marginTop:5}}><Badge text={inv.tipo} color={C.blue}/><Badge text={inv.riesgo} color={RC[inv.riesgo]||C.gray}/></div><div style={{display:"flex",gap:16,marginTop:10}}>{[{l:"Invertido",v:fmtK(inv.capital),c:C.gray},{l:"Actual",v:fmtK(inv.valorActual),c:C.blue},{l:"Rend.",v:`${r>=0?"+":""}${pct(rp)}`,c:r>=0?C.green:C.red}].map(({l,v,c})=><div key={l}><div style={{fontSize:10,color:C.gray,fontFamily:FB}}>{l}</div><Num size={13} color={c}>{v}</Num></div>)}</div></div><DelBtn onClick={()=>del(inv.id)}/></div></div>)})}
      {show&&<Sheet title="Nueva Inversión" onClose={()=>setShow(false)}><Field label="Tipo de activo" value={form.tipo} onChange={v=>setForm({...form,tipo:v})} options={["Acción","ETF","Crypto","Bono","Inmueble","CETES","Fondo Mutuo","Commodity","Otro"]}/><Field label="Nombre / Ticker" value={form.nombre} onChange={v=>setForm({...form,nombre:v})} placeholder="Ej: VOO, BTC, CETES..."/><Field label="Capital invertido ($)" type="number" value={form.capital} onChange={v=>setForm({...form,capital:v})} placeholder="0"/><Field label="Valor actual ($)" type="number" value={form.valorActual} onChange={v=>setForm({...form,valorActual:v})} placeholder="Igual al capital si es nuevo"/><Field label="Nivel de riesgo" value={form.riesgo} onChange={v=>setForm({...form,riesgo:v})} options={["Bajo","Medio","Alto","Muy Alto"]}/><SaveBtn onClick={add} color={C.blue} label="✓  Agregar al Portafolio"/></Sheet>}
    </div>
  );
}

// ── TARJETAS ──────────────────────────────────────────────────────────────────
function Tarjetas({data,setData}){
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({banco:"",limite:"",saldo:"",tasaAnual:"24",diaCorte:"1",diaPago:"15"});
  const totL=data.tarjetas.reduce((s,t)=>s+t.limite,0);
  const totS=data.tarjetas.reduce((s,t)=>s+t.saldo,0);
  const ut=totL>0?totS/totL:0;
  const add=()=>{if(!form.banco||!form.limite)return;setData(d=>({...d,tarjetas:[...d.tarjetas,{...form,limite:parseFloat(form.limite)||0,saldo:parseFloat(form.saldo)||0,tasaAnual:parseFloat(form.tasaAnual)||24,diaCorte:parseInt(form.diaCorte)||1,diaPago:parseInt(form.diaPago)||15,id:Date.now()}]}));setForm({banco:"",limite:"",saldo:"",tasaAnual:"24",diaCorte:"1",diaPago:"15"});setShow(false)};
  const del=id=>setData(d=>({...d,tarjetas:d.tarjetas.filter(t=>t.id!==id)}));
  return(
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontFamily:FN,fontSize:28,fontWeight:600,color:C.orange}}>{fmtK(totS)}</div><div style={{fontSize:12,color:C.gray,fontFamily:FB,marginTop:3}}>Saldo total · Límite: {fmtK(totL)}</div></div>
        <AddBtn onClick={()=>setShow(true)} color={C.orange}/>
      </div>
      <Card><div style={{fontSize:12,color:C.gray,fontFamily:FB,marginBottom:8,fontWeight:600}}>Utilización total del crédito</div><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><Num size={22} color={ut>.9?C.red:ut>.7?C.orange:C.green}>{pct(ut)}</Num><span style={{fontSize:11,color:C.gray,fontFamily:FB}}>Meta: &lt;30%</span></div><BP value={ut} max={1} color={ut>.9?C.red:ut>.7?C.orange:C.green} height={8}/></Card>
      {data.tarjetas.map(t=>{const u=t.saldo/t.limite;const uc=u>.9?C.red:u>.7?C.orange:u>.5?C.yellow:C.green;const pMin=Math.max(t.saldo*.05,Math.min(500,t.saldo));return(<div key={t.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontFamily:FB,fontSize:15,fontWeight:700,color:C.white}}>{t.banco}</div><div style={{fontSize:11,color:C.gray,fontFamily:FB,marginTop:2}}>Tasa: <span style={{color:C.red}}>{t.tasaAnual}% anual</span> · Corte día {t.diaCorte} · Pago día {t.diaPago}</div></div><DelBtn onClick={()=>del(t.id)}/></div><div style={{margin:"12px 0"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,color:C.gray,fontFamily:FB}}>Utilización</span><span style={{fontFamily:FN,fontSize:13,fontWeight:600,color:uc}}>{pct(u)}</span></div><BP value={u} max={1} color={uc} height={7}/></div><div style={{display:"flex",gap:8}}><div style={{flex:1,background:C.green+"15",border:`1px solid ${C.green}33`,borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:C.gray,fontFamily:FB,marginBottom:2}}>Sin intereses</div><Num size={13} color={C.green}>{fmtK(t.saldo)}</Num></div><div style={{flex:1,background:C.red+"15",border:`1px solid ${C.red}33`,borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:C.gray,fontFamily:FB,marginBottom:2}}>Pago mínimo</div><Num size={13} color={C.red}>{fmtK(pMin)}</Num></div><div style={{flex:1,background:C.card2,borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:C.gray,fontFamily:FB,marginBottom:2}}>Saldo</div><Num size={13} color={C.orange}>{fmtK(t.saldo)}</Num></div></div></div>)})}
      {show&&<Sheet title="Nueva Tarjeta" onClose={()=>setShow(false)}><Field label="Banco / Nombre" value={form.banco} onChange={v=>setForm({...form,banco:v})} placeholder="Ej: BBVA Azul..."/><Field label="Límite de crédito ($)" type="number" value={form.limite} onChange={v=>setForm({...form,limite:v})} placeholder="0"/><Field label="Saldo actual ($)" type="number" value={form.saldo} onChange={v=>setForm({...form,saldo:v})} placeholder="0"/><Field label="Tasa anual (%)" type="number" value={form.tasaAnual} onChange={v=>setForm({...form,tasaAnual:v})} placeholder="24"/><div style={{display:"flex",gap:10}}><div style={{flex:1}}><Field label="Día corte" type="number" value={form.diaCorte} onChange={v=>setForm({...form,diaCorte:v})}/></div><div style={{flex:1}}><Field label="Día pago" type="number" value={form.diaPago} onChange={v=>setForm({...form,diaPago:v})}/></div></div><SaveBtn onClick={add} color={C.orange} label="✓  Guardar Tarjeta"/></Sheet>}
    </div>
  );
}

// ── DEUDAS ────────────────────────────────────────────────────────────────────
function Deudas({data,setData}){
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({tipo:"Personal",acreedor:"",montoOrig:"",saldo:"",tasaAnual:"15",pagoMens:""});
  const totS=data.deudas.reduce((s,d)=>s+d.saldo,0);
  const add=()=>{if(!form.acreedor||!form.saldo)return;setData(d=>({...d,deudas:[...d.deudas,{...form,montoOrig:parseFloat(form.montoOrig)||parseFloat(form.saldo)||0,saldo:parseFloat(form.saldo)||0,tasaAnual:parseFloat(form.tasaAnual)||0,pagoMens:parseFloat(form.pagoMens)||0,id:Date.now()}]}));setForm({tipo:"Personal",acreedor:"",montoOrig:"",saldo:"",tasaAnual:"15",pagoMens:""});setShow(false)};
  const del=id=>setData(d=>({...d,deudas:d.deudas.filter(x=>x.id!==id)}));
  return(
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontFamily:FN,fontSize:28,fontWeight:600,color:C.red}}>{fmtK(totS)}</div><div style={{fontSize:12,color:C.gray,fontFamily:FB,marginTop:3}}>{data.deudas.length} deudas activas</div></div>
        <AddBtn onClick={()=>setShow(true)} color={C.red}/>
      </div>
      {data.deudas.map(d=>{const meses=calcNPER(d.tasaAnual/100,d.pagoMens,d.saldo);const intT=Math.max(0,meses*d.pagoMens-d.saldo);const prog=d.montoOrig>0?1-(d.saldo/d.montoOrig):0;const anos=Math.floor(meses/12),mR=meses%12;return(<div key={d.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div><div style={{fontFamily:FB,fontSize:15,fontWeight:700,color:C.white}}>{d.acreedor}</div><div style={{display:"flex",gap:6,marginTop:4}}><Badge text={d.tipo} color={C.orange}/><span style={{fontSize:11,color:C.red,fontFamily:FB}}>{d.tasaAnual}% anual</span></div></div><DelBtn onClick={()=>del(d.id)}/></div>{d.montoOrig>0&&<div style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:C.gray,fontFamily:FB}}>Progreso pagado</span><span style={{fontFamily:FN,fontSize:11,fontWeight:600,color:C.green}}>{pct(prog)}</span></div><BP value={prog} max={1} color={C.green} height={6}/></div>}<div style={{display:"flex",gap:8}}><div style={{flex:1,background:C.card2,borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:C.gray,fontFamily:FB,marginBottom:2}}>Saldo</div><Num size={14} color={C.red}>{fmtK(d.saldo)}</Num></div><div style={{flex:1,background:C.card2,borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:C.gray,fontFamily:FB,marginBottom:2}}>Tiempo rest.</div><Num size={14} color={C.blue}>{meses>=999?"∞":anos>0?`${anos}a ${mR}m`:`${meses}m`}</Num></div><div style={{flex:1,background:C.card2,borderRadius:10,padding:"8px 10px",textAlign:"center"}}><div style={{fontSize:10,color:C.gray,fontFamily:FB,marginBottom:2}}>Intereses est.</div><Num size={14} color={C.orange}>{fmtK(intT)}</Num></div></div></div>)})}
      {show&&<Sheet title="Registrar Deuda" onClose={()=>setShow(false)}><Field label="Tipo" value={form.tipo} onChange={v=>setForm({...form,tipo:v})} options={["Hipoteca","Auto","Personal","Tarjeta","Estudiantil","Negocio","Familia","Otro"]}/><Field label="Acreedor / Institución" value={form.acreedor} onChange={v=>setForm({...form,acreedor:v})} placeholder="Ej: BBVA, INFONAVIT..."/><Field label="Monto original ($)" type="number" value={form.montoOrig} onChange={v=>setForm({...form,montoOrig:v})} placeholder="0"/><Field label="Saldo actual ($)" type="number" value={form.saldo} onChange={v=>setForm({...form,saldo:v})} placeholder="0"/><Field label="Tasa anual (%)" type="number" value={form.tasaAnual} onChange={v=>setForm({...form,tasaAnual:v})} placeholder="15"/><Field label="Pago mensual ($)" type="number" value={form.pagoMens} onChange={v=>setForm({...form,pagoMens:v})} placeholder="0"/><SaveBtn onClick={add} color={C.red} label="✓  Registrar Deuda"/></Sheet>}
    </div>
  );
}

// ── METAS ─────────────────────────────────────────────────────────────────────
function Metas({data,setData}){
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({nombre:"",objetivo:"",actual:"",fechaObj:"",prioridad:"Alta"});
  const add=()=>{if(!form.nombre||!form.objetivo)return;setData(d=>({...d,metas:[...d.metas,{...form,objetivo:parseFloat(form.objetivo)||0,actual:parseFloat(form.actual)||0,id:Date.now()}]}));setForm({nombre:"",objetivo:"",actual:"",fechaObj:"",prioridad:"Alta"});setShow(false)};
  const del=id=>setData(d=>({...d,metas:d.metas.filter(m=>m.id!==id)}));
  const upd=(id,val)=>setData(d=>({...d,metas:d.metas.map(m=>m.id===id?{...m,actual:parseFloat(val)||0}:m)}));
  const PC={Alta:C.red,Media:C.orange,Baja:C.blue};
  return(
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontFamily:FN,fontSize:28,fontWeight:600,color:C.green}}>{data.metas.length} Metas</div><div style={{fontSize:12,color:C.gray,fontFamily:FB,marginTop:3}}>{data.metas.filter(m=>m.actual>=m.objetivo).length} completadas</div></div>
        <AddBtn onClick={()=>setShow(true)} color={C.green} label="Nueva meta"/>
      </div>
      {data.metas.map(meta=>{const p=Math.min(1,meta.actual/meta.objetivo);const col=p>=1?C.blue:p>=.75?C.green:p>=.4?C.orange:C.red;const mR=meta.fechaObj?Math.max(0,Math.round((new Date(meta.fechaObj)-new Date())/(1000*60*60*24*30))):null;const aM=mR&&mR>0?(meta.objetivo-meta.actual)/mR:null;return(<div key={meta.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div style={{flex:1}}><div style={{fontFamily:FB,fontSize:15,fontWeight:700,color:C.white}}>{meta.nombre}</div><div style={{marginTop:4}}><Badge text={meta.prioridad} color={PC[meta.prioridad]||C.gray}/></div></div><div style={{display:"flex",gap:8,alignItems:"center"}}><Num size={18} color={col}>{pct(p)}</Num><DelBtn onClick={()=>del(meta.id)}/></div></div><BP value={p} max={1} color={col} height={8}/><div style={{display:"flex",justifyContent:"space-between",marginTop:5,marginBottom:12}}><Num size={12} color={C.gray}>{fmtK(meta.actual)}</Num><Num size={12} color={col}>{fmtK(meta.objetivo)}</Num></div><div style={{display:"flex",gap:8,marginBottom:12}}>{mR!==null&&<div style={{flex:1,background:C.card2,borderRadius:10,padding:"7px",textAlign:"center"}}><div style={{fontSize:10,color:C.gray,fontFamily:FB}}>Meses rest.</div><Num size={14} color={C.blue}>{mR}</Num></div>}{aM&&<div style={{flex:1,background:C.card2,borderRadius:10,padding:"7px",textAlign:"center"}}><div style={{fontSize:10,color:C.gray,fontFamily:FB}}>Ahorro/mes</div><Num size={14} color={C.green}>{fmtK(aM)}</Num></div>}</div><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,color:C.gray,fontFamily:FB,flexShrink:0}}>Actualizar:</span><input type="number" value={meta.actual} onChange={e=>upd(meta.id,e.target.value)} style={{flex:1,padding:"7px 10px",background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,color:C.white,fontSize:13,fontFamily:FB}}/></div></div>)})}
      {show&&<Sheet title="Nueva Meta Financiera" onClose={()=>setShow(false)}><Field label="Nombre de la meta" value={form.nombre} onChange={v=>setForm({...form,nombre:v})} placeholder="🏡 Enganche, ✈️ Viaje..."/><Field label="Monto objetivo ($)" type="number" value={form.objetivo} onChange={v=>setForm({...form,objetivo:v})} placeholder="0"/><Field label="Ahorro actual ($)" type="number" value={form.actual} onChange={v=>setForm({...form,actual:v})} placeholder="0"/><Field label="Fecha objetivo" type="date" value={form.fechaObj} onChange={v=>setForm({...form,fechaObj:v})}/><Field label="Prioridad" value={form.prioridad} onChange={v=>setForm({...form,prioridad:v})} options={["Alta","Media","Baja"]}/><SaveBtn onClick={add} color={C.green} label="✓  Crear Meta"/></Sheet>}
    </div>
  );
}

// ── CALCULADORA ───────────────────────────────────────────────────────────────
function Calculadora(){
  const [meta,setMeta]=useState(200000);
  const [actual,setActual]=useState(20000);
  const [meses,setMeses]=useState(36);
  const [tasa,setTasa]=useState(8);
  const r=tasa/100;
  const aport=useMemo(()=>calcPMT(meta,actual,meses,r),[meta,actual,meses,r]);
  const aOpt=useMemo(()=>calcPMT(meta,actual,meses,r+.04),[meta,actual,meses,r]);
  const aCons=useMemo(()=>calcPMT(meta,actual,meses,Math.max(0,r-.03)),[meta,actual,meses,r]);
  const proj=useMemo(()=>{const pts=[];let s=actual;const rm=r/12;for(let i=1;i<=meses;i++){s=s*(1+rm)+aport;if(i%(Math.ceil(meses/7))===0||i===meses)pts.push({mes:`M${i}`,valor:Math.round(s),meta})}return pts},[actual,meses,aport,r,meta]);
  return(
    <div className="fi">
      <Card>
        <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:C.white,marginBottom:14}}>📥 Parámetros</div>
        <Field label="Meta financiera ($)" type="number" value={meta} onChange={v=>setMeta(parseFloat(v)||0)}/>
        <Field label="Ahorro actual ($)" type="number" value={actual} onChange={v=>setActual(parseFloat(v)||0)}/>
        <div style={{display:"flex",gap:10}}><div style={{flex:1}}><Field label="Plazo (meses)" type="number" value={meses} onChange={v=>setMeses(parseInt(v)||1)}/></div><div style={{flex:1}}><Field label="Rendto. anual (%)" type="number" value={tasa} onChange={v=>setTasa(parseFloat(v)||0)}/></div></div>
      </Card>
      <Card>
        <div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:C.white,marginBottom:14}}>📊 Escenarios</div>
        {[{l:"Optimista",sub:`${tasa+4}% rendimiento`,v:aOpt,c:C.green},{l:"Base",sub:`${tasa}% rendimiento`,v:aport,c:C.blue},{l:"Conservador",sub:`${Math.max(0,tasa-3)}% rendimiento`,v:aCons,c:C.orange}].map(sc=><div key={sc.l} style={{background:C.card2,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:C.white}}>{sc.l}</div><div style={{fontSize:11,color:C.gray,fontFamily:FB}}>{sc.sub}</div></div><div style={{textAlign:"right"}}><Num size={20} color={sc.c}>{fmtK(sc.v)}</Num><div style={{fontSize:11,color:C.gray,fontFamily:FB}}>/mes</div></div></div>)}
        <div style={{background:C.card2,borderRadius:12,padding:"12px 14px",marginTop:4,display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:11,color:C.gray,fontFamily:FB}}>Total aportado</div><Num size={15}>{fmtK(aport*meses+actual)}</Num></div><div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.gray,fontFamily:FB}}>Intereses ganados</div><Num size={15} color={C.green}>{fmtK(Math.max(0,meta-(aport*meses+actual)))}</Num></div></div>
      </Card>
      {proj.length>0&&<Card><div style={{fontFamily:FH,fontSize:14,fontWeight:700,color:C.white,marginBottom:8}}>📈 Proyección</div><div style={{fontSize:11,color:C.gray,fontFamily:FB,marginBottom:8}}>Meta: <span style={{color:C.purple,fontWeight:600}}>{fmtK(meta)}</span> · Aporte base: <span style={{color:C.blue,fontWeight:600}}>{fmtK(aport)}/mes</span></div><ResponsiveContainer width="100%" height={170}><AreaChart data={proj}><defs><linearGradient id="calcG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.purple} stopOpacity={.35}/><stop offset="95%" stopColor={C.purple} stopOpacity={0}/></linearGradient></defs><XAxis dataKey="mes" tick={AXS} axisLine={false} tickLine={false}/><YAxis hide/><Tooltip formatter={v=>fmtK(v)} contentStyle={TTS.contentStyle}/><Area type="monotone" dataKey="valor" stroke={C.purple} fill="url(#calcG)" strokeWidth={2} dot={{fill:C.purple,r:3}} name="Saldo"/><Line type="monotone" dataKey="meta" stroke={C.yellow} strokeDasharray="5 4" dot={false} strokeWidth={1.5} name="Meta"/></AreaChart></ResponsiveContainer></Card>}
    </div>
  );
}

// ── SECTIONS CONFIG ───────────────────────────────────────────────────────────
const SECTIONS=[
  {id:"dashboard",label:"Dashboard",Icon:Home,color:C.blue},
  {id:"ingresos",label:"Ingresos",Icon:TrendingUp,color:C.green},
  {id:"gastos",label:"Gastos",Icon:TrendingDown,color:C.red},
  {id:"inversiones",label:"Inversiones",Icon:BarChart2,color:C.blue},
  {id:"tarjetas",label:"Tarjetas",Icon:CreditCard,color:C.orange},
  {id:"deudas",label:"Deudas",Icon:Wallet,color:C.red},
  {id:"metas",label:"Metas",Icon:Target,color:C.green},
  {id:"calculadora",label:"Calculadora",Icon:Calculator,color:C.purple},
];

// ── APP SHELL ─────────────────────────────────────────────────────────────────
export default function App(){
  const [sec,setSec]=useState("dashboard");
  const [menu,setMenu]=useState(false);
  const [data,setData]=useState(INIT);
  const [ready,setReady]=useState(false);

  useEffect(()=>{injectFonts()},[]);

  useEffect(()=>{
    try{const s=localStorage.getItem("fp_v4");if(s)setData(JSON.parse(s))}catch{}
    setReady(true);
  },[]);

  useEffect(()=>{
    if(!ready)return;
    try{localStorage.setItem("fp_v4",JSON.stringify(data))}catch{}
  },[data,ready]);

  const go=id=>{setSec(id);setMenu(false)};
  const curr=SECTIONS.find(s=>s.id===sec)||SECTIONS[0];
  const p={data,setData};

  const renderSection=()=>{
    switch(sec){
      case"dashboard":return<Dashboard {...p}/>;
      case"ingresos":return<Ingresos {...p}/>;
      case"gastos":return<Gastos {...p}/>;
      case"inversiones":return<Inversiones {...p}/>;
      case"tarjetas":return<Tarjetas {...p}/>;
      case"deudas":return<Deudas {...p}/>;
      case"metas":return<Metas {...p}/>;
      case"calculadora":return<Calculadora/>;
      default:return null;
    }
  };

  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.white,fontFamily:FB,maxWidth:480,margin:"0 auto",position:"relative"}}>
      {/* HEADER */}
      <div style={{position:"sticky",top:0,zIndex:100,background:C.bg2+"F0",borderBottom:`1px solid ${C.border}`,backdropFilter:"blur(20px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",height:56,padding:"0 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${C.blue},${C.blue2})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 10px ${C.blue}44`}}>
              <Activity size={16} color="#fff"/>
            </div>
            <div>
              <div style={{fontFamily:FH,fontSize:15,fontWeight:800,color:C.white,lineHeight:1}}>FinanzasPro</div>
              <div style={{fontSize:9,color:C.gray,fontFamily:FB,marginTop:1}}>Gestión Financiera</div>
            </div>
          </div>
          <button onClick={()=>setMenu(o=>!o)} style={{display:"flex",alignItems:"center",gap:7,background:menu?curr.color+"1A":C.card,border:`1px solid ${menu?curr.color+"55":C.border}`,borderRadius:20,padding:"6px 12px",cursor:"pointer",color:C.white,fontFamily:FB,fontSize:13,fontWeight:600,transition:"all .15s"}}>
            <curr.Icon size={14} color={curr.color}/>
            <span>{curr.label}</span>
            <ChevronDown size={12} color={C.gray} style={{transform:menu?"rotate(180deg)":"none",transition:"transform .2s"}}/>
          </button>
        </div>
        {/* DROPDOWN */}
        {menu&&(
          <div style={{background:C.bg2,borderBottom:`1px solid ${C.border}`,padding:"12px 16px 16px",boxShadow:"0 16px 48px rgba(0,0,0,.6)"}} className="sd">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {SECTIONS.map(s=>(
                <button key={s.id} onClick={()=>go(s.id)} style={{display:"flex",alignItems:"center",gap:9,background:sec===s.id?s.color+"18":C.card,border:`1px solid ${sec===s.id?s.color+"55":C.border}`,borderRadius:12,padding:"10px 12px",cursor:"pointer",color:C.white,fontFamily:FB,fontSize:13,fontWeight:600,textAlign:"left",transition:"all .15s"}}>
                  <div style={{width:26,height:26,borderRadius:7,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <s.Icon size={13} color={s.color}/>
                  </div>
                  {s.label}
                </button>
              ))}
            </div>
            <div style={{textAlign:"center",marginTop:10,fontSize:10,color:C.gray,fontFamily:FB}}>💾 Datos guardados automáticamente</div>
          </div>
        )}
      </div>
      {/* CONTENT */}
      <div style={{padding:"16px 16px 52px"}} onClick={()=>menu&&setMenu(false)}>
        {sec!=="dashboard"&&(
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
            <div style={{width:34,height:34,borderRadius:10,background:curr.color+"20",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <curr.Icon size={17} color={curr.color}/>
            </div>
            <div style={{fontFamily:FH,fontSize:22,fontWeight:800,color:C.white}}>{curr.label}</div>
          </div>
        )}
        {renderSection()}
      </div>
    </div>
  );
}
ENDOFFILE
echo "File created: $(wc -l < /home/claude/App_fixed.jsx) lines"
cp /home/claude/App_fixed.jsx /mnt/user-data/outputs/App_fixed.jsx
Salida

File created: 499 lines
