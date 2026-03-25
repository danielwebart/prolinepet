(()=>{var e={};e.id=785,e.ids=[785],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},43197:(e,t,a)=>{"use strict";a.r(t),a.d(t,{GlobalError:()=>r.Z,__next_app__:()=>p,originalPathname:()=>c,pages:()=>o,routeModule:()=>m,tree:()=>l}),a(7205),a(45892),a(7629),a(12523);var s=a(23191),i=a(88716),r=a(43315),n=a(95231),d={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>n[e]);a.d(t,d);let l=["",{children:["work-orders",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(a.bind(a,7205)),"C:\\Workspace\\prolinepet_build\\src\\app\\work-orders\\[id]\\page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(a.bind(a,45892)),"C:\\Workspace\\prolinepet_build\\src\\app\\layout.tsx"],error:[()=>Promise.resolve().then(a.bind(a,7629)),"C:\\Workspace\\prolinepet_build\\src\\app\\error.tsx"],"not-found":[()=>Promise.resolve().then(a.bind(a,12523)),"C:\\Workspace\\prolinepet_build\\src\\app\\not-found.tsx"]}],o=["C:\\Workspace\\prolinepet_build\\src\\app\\work-orders\\[id]\\page.tsx"],c="/work-orders/[id]/page",p={require:a,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/work-orders/[id]/page",pathname:"/work-orders/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},40947:(e,t,a)=>{Promise.resolve().then(a.bind(a,68104))},68104:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>l});var s=a(10326),i=a(17577),r=a(49460),n=a(35047);let d=({className:e,onChange:t})=>{let a=(0,i.useRef)(null),[r,n]=(0,i.useState)(!1);(0,i.useEffect)(()=>{let e=a.current;if(!e)return;let t=e.getContext("2d");if(!t)return;let s=()=>{let a=window.devicePixelRatio||1,s=e.getBoundingClientRect();e.width=s.width*a,e.height=s.height*a,t.resetTransform(),t.scale(a,a),t.lineWidth=2,t.lineJoin="round",t.lineCap="round",t.strokeStyle="#111827"};return s(),window.addEventListener("resize",s),()=>window.removeEventListener("resize",s)},[]);let d=e=>{let t=a.current.getBoundingClientRect(),s=0,i=0;if("touches"in e){let a=e.touches[0]||e.changedTouches[0];s=a.clientX-t.left,i=a.clientY-t.top}else s=e.clientX-t.left,i=e.clientY-t.top;return{x:s,y:i}},l=e=>{e.preventDefault();let t=a.current.getContext("2d"),{x:s,y:i}=d(e);t.beginPath(),t.moveTo(s,i),n(!0)},o=e=>{if(!r)return;let s=a.current.getContext("2d"),{x:i,y:n}=d(e);s.lineTo(i,n),s.stroke(),t?.(a.current.toDataURL("image/png"))},c=()=>n(!1);return s.jsx("div",{className:e??"",children:(0,s.jsxs)("div",{className:"border rounded bg-white",children:[(0,s.jsxs)("div",{className:"flex items-center justify-between px-2 py-1 border-b",children:[s.jsx("span",{className:"text-sm text-gray-600",children:"Assine no quadro abaixo"}),(0,s.jsxs)("div",{className:"flex gap-2",children:[s.jsx("button",{type:"button",onClick:()=>{let e=a.current;e.getContext("2d").clearRect(0,0,e.width,e.height),t?.("")},className:"px-2 py-1 text-sm bg-gray-200 rounded",children:"Limpar"}),s.jsx("button",{type:"button",onClick:()=>{let e=a.current.toDataURL("image/png"),t=document.createElement("a");t.href=e,t.download="assinatura.png",t.click()},className:"px-2 py-1 text-sm bg-gray-800 text-white rounded",children:"Baixar"})]})]}),s.jsx("div",{className:"p-2",children:s.jsx("div",{className:"relative w-full h-48",children:s.jsx("canvas",{ref:a,className:"w-full h-full touch-manipulation",onMouseDown:l,onMouseMove:o,onMouseUp:c,onMouseLeave:c,onTouchStart:l,onTouchMove:o,onTouchEnd:c})})})]})})};function l(){let e=(0,n.useParams)().id,[t,a]=(0,i.useState)(null),[l,o]=(0,i.useState)([]),[c,p]=(0,i.useState)(!1),[m,u]=(0,i.useState)(""),[x,h]=(0,i.useState)([]),v=(0,i.useMemo)(()=>{let e=new Map;for(let t of x)e.set(t.id,{id:t.id,name:t.name,code:t.code??null,parentId:t.parentId??null});return e},[x]),g=(0,i.useMemo)(()=>{let e=new Map;for(let t of x){let a=t.parentId??0;e.has(a)||e.set(a,[]),e.get(a).push({id:t.id,name:t.name,code:t.code??null,parentId:t.parentId??null})}return Array.from(e.values()).forEach(e=>e.sort((e,t)=>(e.name||"").localeCompare(t.name||""))),e},[x]);return t?(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("h1",{className:"text-2xl font-semibold",children:["OS #",t.id]}),(0,s.jsxs)("div",{className:"bg-white shadow rounded p-4",children:[s.jsx("div",{className:"font-medium mb-2",children:t.title}),(0,s.jsxs)("div",{className:"text-sm text-gray-600",children:["Status: ",t.status]}),(0,s.jsxs)("div",{className:"text-sm text-gray-600",children:["Setor: ",t.sector||"-"]}),(0,s.jsxs)("div",{className:"text-sm text-gray-600",children:["Tipo: ",t.maintenanceType||"-"]}),(0,s.jsxs)("div",{className:"text-sm text-gray-600",children:["Programada: ",(()=>{let e=t.scheduledAt||t.scheduled_at;if(!e)return"-";try{return new Date(e).toLocaleString()}catch{return String(e)}})()]}),(0,s.jsxs)("div",{className:"text-sm",children:["Ativo: ",t.asset?.name]}),t.rootAssetId&&(0,s.jsxs)("div",{className:"mt-3",children:[s.jsx("div",{className:"font-medium mb-2",children:"Componentes selecionados (visualiza\xe7\xe3o)"}),s.jsx("div",{className:"text-xs text-gray-500 mb-2",children:"\xc1rvore somente leitura dos ativos vinculados \xe0 abertura"}),s.jsx("div",{className:"rounded border p-3 bg-gray-50",children:(e=>{if(!e||!v.has(e))return null;let t=v.get(e),a=e=>{let t=g.get(e.id)||[];return(0,s.jsxs)("li",{className:"mb-2",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2",children:[s.jsx("span",{className:"font-medium",children:e.name}),e.code&&s.jsx("span",{className:"text-xs text-gray-500",children:e.code})]}),t.length>0&&s.jsx("ul",{className:"mt-1 ml-6 border-l pl-3",children:t.map(e=>a(e))})]},e.id)};return s.jsx("ul",{children:a(t)})})(t.rootAssetId)||s.jsx("div",{className:"text-sm text-gray-600",children:"\xc1rvore n\xe3o dispon\xedvel"})})]})]}),(0,s.jsxs)("div",{className:"bg-white shadow rounded p-4",children:[s.jsx("div",{className:"font-medium mb-2",children:"Anexos"}),(0,s.jsxs)("div",{className:"flex items-center gap-2 mb-3",children:[s.jsx("input",{type:"file",accept:"image/*",capture:"environment",onChange:async t=>{let a=t.target.files?.[0];if(!a)return;let s=new FileReader;s.onload=async()=>{let t=s.result;p(!0),await fetch(`/api/work-orders/${e}/attachments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fileName:a.name,url:t,mimeType:a.type})}),p(!1);let i=await fetch(`/api/work-orders/${e}/attachments`).then(e=>(0,r.a)(e,[]));o(Array.isArray(i)?i:[])},s.readAsDataURL(a)}}),c&&s.jsx("span",{className:"text-sm text-gray-600",children:"Enviando..."})]}),(0,s.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3",children:[l.map(e=>(0,s.jsxs)("div",{className:"border rounded overflow-hidden",children:[s.jsx("img",{src:e.url,alt:e.fileName,className:"w-full h-32 object-cover"}),s.jsx("div",{className:"px-2 py-1 text-xs text-gray-600 truncate",children:e.fileName})]},e.id)),0===l.length&&s.jsx("div",{className:"text-sm text-gray-500",children:"Nenhum anexo"})]})]}),(0,s.jsxs)("div",{children:[s.jsx("div",{className:"font-medium mb-2",children:"Assinatura do executor/aprovador"}),s.jsx(d,{onChange:e=>u(e)}),s.jsx("div",{className:"mt-2",children:s.jsx("button",{onClick:async()=>{if(!m)return;p(!0),await fetch(`/api/work-orders/${e}/attachments`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fileName:`assinatura-${Date.now()}.png`,url:m,mimeType:"image/png"})}),p(!1);let t=await fetch(`/api/work-orders/${e}/attachments`).then(e=>(0,r.a)(e,[]));o(Array.isArray(t)?t:[])},className:"px-3 py-2 bg-blue-600 text-white rounded",children:"Salvar assinatura"})})]}),s.jsx("div",{className:"flex gap-2",children:s.jsx("button",{onClick:()=>{let e=window.open("","_blank");if(!e)return;let a=e=>{if(!e)return"-";try{return new Date(e).toLocaleString()}catch{return String(e)}},s=`
      body { font-family: Arial, sans-serif; color: #111; }
      .wrap { max-width: 900px; margin: 0 auto; padding: 24px; }
      .header { display:flex; align-items:center; gap:16px; border-bottom: 2px solid #333; padding-bottom: 12px; }
      .logo { width: 80px; height: 80px; object-fit: contain; }
      .title { font-size: 22px; font-weight: 700; }
      .meta { margin-top: 6px; color: #555; font-size: 12px; }
      .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin-top: 12px; }
      .card { border:1px solid #ddd; border-radius:8px; padding:12px; margin-top: 16px; }
      .card h3 { margin: 0 0 8px 0; font-size: 14px; }
      .row { display:flex; gap:8px; }
      .label { width: 160px; color:#555; }
      table { width:100%; border-collapse: collapse; font-size: 12px; }
      th, td { border:1px solid #ddd; padding:6px 8px; text-align:left; }
      .attachments { display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap:10px; }
      .attachments img { width:100%; height:100px; object-fit:cover; border:1px solid #ddd; border-radius:6px; }
      .signature { max-width: 320px; border:1px solid #ddd; border-radius:6px; }
      .footer { margin-top: 24px; font-size: 11px; color:#666; }
      @media print { .no-print { display:none; } }
    `,i=null!=t.mttr?`${t.mttr} min`:"-",r=t.maintainedComponents&&Array.isArray(t.maintainedComponents)?t.maintainedComponents:[],n=t.usedEquipment&&Array.isArray(t.usedEquipment)?t.usedEquipment:[],d=t.tasks&&Array.isArray(t.tasks)?t.tasks:[],o=(l||[]).map(e=>`<div><img src="${e.url}" alt="${e.fileName}" /><div style="font-size:11px;color:#555;margin-top:4px">${e.fileName}</div></div>`).join("");e.document.write(`
      <html>
        <head>
          <title>OS ${t.code||t.id}</title>
          <meta charset="utf-8" />
          <style>${s}</style>
        </head>
        <body>
          <div class="wrap">
            <div class="header">
              <img class="logo" src="/icons/logo cartonificio.png" alt="Cartonificio" />
              <div>
                <div class="title">Ordem de Servi\xe7o #${t.code||t.id}</div>
                <div class="meta">Emitida por: Cartonificio Valinhos • ${new Date().toLocaleString()}</div>
              </div>
            </div>

            <div class="card">
              <h3>Dados da OS</h3>
              <div class="grid">
                <div><span class="label">T\xedtulo:</span> ${t.title||"-"}</div>
                <div><span class="label">Ativo:</span> ${t.asset?.name||"-"}</div>
                <div><span class="label">Setor:</span> ${t.sector||"-"}</div>
                <div><span class="label">Tipo:</span> ${t.maintenanceType||"-"}</div>
                <div><span class="label">C\xf3digo ERP:</span> ${t.erpCode||"-"}</div>
                <div><span class="label">Condi\xe7\xe3o do ativo:</span> ${t.assetCondition||"-"}</div>
                <div><span class="label">Pessoas:</span> ${t.personnelCount??"-"}</div>
                <div><span class="label">Dura\xe7\xe3o estimada:</span> ${t.estimatedDurationMinutes??"-"} min</div>
                <div><span class="label">Programada:</span> ${a(t.scheduledAt||t.scheduled_at)}</div>
                <div><span class="label">Abertura:</span> ${a(t.openedAt)}</div>
                <div><span class="label">In\xedcio:</span> ${a(t.startedAt)}</div>
                <div><span class="label">Conclus\xe3o:</span> ${a(t.completedAt)}</div>
                <div><span class="label">Encerramento:</span> ${a(t.closedAt)}</div>
                <div><span class="label">MTTR:</span> ${i}</div>
                <div><span class="label">Status:</span> ${t.status}</div>
              </div>
            </div>

            <div class="card">
              <h3>Descri\xe7\xe3o</h3>
              <div>${(t.description||"").replace(/\n/g,"<br/>")||"-"}</div>
            </div>

            <div class="card">
              <h3>Materiais</h3>
              <div>${t.materials||"-"}</div>
            </div>

            <div class="card">
              <h3>Tarefas</h3>
              ${d.length?`<ul>${d.map(e=>`<li>${"string"==typeof e?e:JSON.stringify(e)}</li>`).join("")}</ul>`:"<div>-</div>"}
            </div>

            <div class="card">
              <h3>Execu\xe7\xe3o</h3>
              <div class="row"><span class="label">Equipamentos usados:</span> ${n.length?n.join(", "):"-"}</div>
              <div class="row"><span class="label">Componentes mantidos:</span> ${r.length?r.map(e=>"string"==typeof e?e:e?.name||JSON.stringify(e)).join(", "):"-"}</div>
              <div class="row"><span class="label">Descri\xe7\xe3o da execu\xe7\xe3o:</span> ${t.executionDescription||"-"}</div>
              <div class="row"><span class="label">Observa\xe7\xf5es:</span> ${t.observations||"-"}</div>
            </div>

            <div class="card">
              <h3>Assinatura do t\xe9cnico</h3>
              ${t.technicianSignature?`<img class="signature" src="${t.technicianSignature}" alt="Assinatura" />`:"<div>-</div>"}
            </div>

            <div class="card">
              <h3>Anexos</h3>
              <div class="attachments">${o||"<div>-</div>"}</div>
            </div>

            <div class="footer">Documento gerado pelo CMMS - Cartonificio • ${new Date().toLocaleDateString()}</div>
          </div>
        </body>
      </html>
    `),e.document.close(),e.focus(),setTimeout(()=>e.print(),100)},className:"px-4 py-2 bg-gray-800 text-white rounded",children:"Imprimir OS"})})]}):s.jsx("div",{children:"Carregando..."})}},49460:(e,t,a)=>{"use strict";async function s(e,t){try{let a=await e.text().catch(()=>"");if(!a)return t;try{return JSON.parse(a)}catch{return t}}catch{return t}}a.d(t,{a:()=>s})},7205:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>s});let s=(0,a(68570).createProxy)(String.raw`C:\Workspace\prolinepet_build\src\app\work-orders\[id]\page.tsx#default`)}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),s=t.X(0,[9276,7325,5141],()=>a(43197));module.exports=s})();