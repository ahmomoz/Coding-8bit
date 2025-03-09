const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-BHexUQY3.js","./index-Cj2q_r4V.css"])))=>i.map(i=>d[i]);
import{j as e,r as t,c as L,u as B,z as u,a as M,F,b as z,L as O,C as H,_ as Q,S as c,d as S,P as X,s as Z,e as G,f as J,g as K,l as W,H as Y,T as ee}from"./index-BHexUQY3.js";function se(){return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"add-learning-need-bot-wrap",children:[e.jsx("img",{src:"images/deco/bot-greeting.svg",alt:"bot-greeting-image",className:"bot-greeting"}),e.jsx("a",{href:"#",className:"add-learning-need-bot-btn","data-bs-toggle":"offcanvas","data-bs-target":"#offcanvasRight","aria-controls":"offcanvasRight",children:e.jsx("img",{src:"images/deco/addLearningNeedBot-sm.svg",alt:"addLearningNeedBot-image"})})]})})}function ae(){const[i,p]=t.useState(!1),[r,d]=t.useState(""),[g,b]=t.useState([]),[n,N]=t.useState([]),v=async()=>{if(r.trim()){b(s=>[...s,{id:g.length+1,userResponse:r}]),d("");try{p(!0);let s=localStorage.getItem("chatSessionId");s||(s=crypto.randomUUID(),localStorage.setItem("chatSessionId",s));const x=await L.postChat({message:r,sessionId:s});N(y=>[...y,{id:n.length+1,botResponse:x.response}])}catch(s){console.error("請求失敗:",s)}finally{p(!1)}}},R=s=>{d(s.target.value)},f=[...g.map(s=>({...s,type:"user"})),...n.map(s=>({...s,type:"bot"}))].sort((s,x)=>s.id-x.id),j=t.useRef(null);return t.useEffect(()=>{j.current&&j.current.scrollIntoView({behavior:"smooth"})},[f]),e.jsxs("div",{className:"chat-room offcanvas offcanvas-end",tabIndex:"-1",id:"offcanvasRight","aria-labelledby":"offcanvasRightLabel",children:[e.jsxs("div",{className:"offcanvas-header",children:[e.jsx("h4",{id:"offcanvasRightLabel",className:"room-title",children:"建立需求小幫手"}),e.jsx("button",{type:"button",className:"btn-close text-reset","data-bs-dismiss":"offcanvas","aria-label":"Close"})]}),e.jsxs("div",{className:"offcanvas-body position-relative px-4 px-lg-8",children:[e.jsxs("div",{className:"d-flex align-items-center pe-8",children:[e.jsx("div",{className:"flex-shrink-0 align-self-start",children:e.jsx("img",{src:"images/deco/robot-avatar.svg",alt:"user-image",className:"user-page-header-img rounded-circle"})}),e.jsx("ul",{className:"flex-grow-1 ms-4 ms-lg-6",children:e.jsx("li",{className:"bg-white rounded-5 py-3 px-5 mb-6 mb-lg-8",children:e.jsx("p",{className:"fs-7 fs-lg-6",children:"哈囉你好^_^ 我是建立需求小幫手~請在輸入框輸入內容與我開始進行對話。"})})})]}),f.map((s,x)=>e.jsxs("div",{className:`d-flex align-items-center ${s.type==="user"?"f-end-center":"pe-8"}`,children:[e.jsx("div",{className:"flex-shrink-0 align-self-start",children:s.type==="bot"&&e.jsx("img",{src:"images/deco/robot-avatar.svg",alt:"user-image",className:"user-page-header-img rounded-circle"})}),e.jsx("div",{ref:j}),e.jsx("ul",{className:`flex-grow-1 ms-4 ms-lg-6 ${s.type==="user"?"text-end":""}`,children:e.jsx("li",{className:`${s.type==="user"?"bg-brand-02 d-inline-block text-start":"bg-white"} rounded-5 py-3 px-5 mb-6 mb-lg-8`,children:e.jsx("p",{className:"fs-7 fs-lg-6",children:s.type==="user"?s.userResponse:s.botResponse})})})]},x)),i&&e.jsxs("div",{className:"f-align-center",children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm text-brand-01",role:"status","aria-hidden":"true"}),e.jsx("p",{className:"text-brand-01 ms-2",children:"Loading..."})]})]}),e.jsxs("div",{className:"offcanvas-footer bg-white shadow position-absolute bottom-0 f-align-center px-3 px-lg-8 py-4 py-lg-6 w-100 ",children:[e.jsx("input",{type:"text",className:"form-control",id:"answer",name:"answer",value:r,onChange:R}),e.jsx("button",{type:"button",className:"btn btn-brand-03 lh-lg py-2 ms-2 ms-md-6",onClick:v,children:"發送"})]}),e.jsxs("div",{className:"offcanvas-footer bg-white shadow position-absolute bottom-0 px-3 px-lg-8 py-4 py-lg-6 w-100 d-none",children:[e.jsx("button",{type:"button",className:"btn btn-outline-gray-03 text-gray-01 w-100",children:"想獲得新知識"}),e.jsx("button",{type:"button",className:"btn btn-outline-gray-03 text-gray-01 w-100 mt-4",children:"遇到小問題卡關了"})]})]})}const te={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_API_BASE:"https://service.coding-8bit.site/api/v1"},ne=t.lazy(()=>Q(()=>import("./index-BHexUQY3.js").then(i=>i.i),__vite__mapDeps([0,1]),import.meta.url)),{VITE_API_BASE:le}=te;function P({setLoadingState:i}){var I;const p=B(),r=()=>{p(-1)},[d,g]=t.useState(!1);t.useEffect(()=>{g(!0)},[]);const b=t.useMemo(()=>[{id:1,name:"Lv.0 - 什麼都不會的小萌新"},{id:2,name:"Lv.1 - 略懂略懂的小菜鳥"},{id:3,name:"Lv.2 - 可獨立學習的勇者"},{id:4,name:"Lv.3 - 有多年 coding 經驗的大神"}],[]),[n,N]=t.useState([]),v=async a=>{var m,w,T;const l=(m=a.target.files)==null?void 0:m[0];if(!l){c.fire({icon:"warning",title:"請選擇檔案"});return}const o=5;if(l.size>o*1024*1024){c.fire({icon:"error",title:`檔案過大，請選擇小於 ${o}MB 的檔案`});return}if(n.length>4){c.fire({icon:"error",title:"最多只可以上傳五張圖片"});return}i(!0);try{const _=document.cookie.replace(/(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/,"$1")||null;S.defaults.headers.common.Authorization=`Bearer ${_}`;const A=await S.post(`${le}/upload/get-upload-url`,{fileName:l.name,fileType:l.type});if(!A.data.uploadUrl)throw new Error("無法取得上傳 URL");const{uploadUrl:D,filePath:$,downloadUrl:q}=A.data;await S.put(D,l,{headers:{"Content-Type":l.type}}),N(V=>[...V,q||$]),c.fire({icon:"success",title:"上傳成功"})}catch(_){c.fire({icon:"error",title:((T=(w=_.response)==null?void 0:w.data)==null?void 0:T.message)||"圖片上傳失敗，請稍後再試"})}finally{i(!1)}},R=async a=>{var l,o;i(!0);try{const m=await L.addCustomRequest(a);await Promise.all(n.map(w=>L.addCustomRequestImg({request_id:m.data.id,photo_url:w}))),c.fire({icon:"success",title:"新增成功"}),p("/custom-requests-list")}catch(m){c.fire({icon:"error",title:(o=(l=m.response)==null?void 0:l.data)==null?void 0:o.message})}finally{i(!1)}},C=u.object({title:u.string().min(1,"請輸入標題"),content:u.string().min(1,"請輸學習需求描述").max(1e3,"課程描述長度不能超過 1000 字符"),level:u.string().min(1,"請選擇學習等級"),category:u.string().min(1,"請選擇工具與語言"),tag:u.string().min(1,"請輸入關鍵字")}),{register:f,handleSubmit:j,setValue:s,control:x,watch:y,formState:{errors:h,isValid:k}}=M({resolver:Z(C),mode:"onTouched"}),E=t.useRef(null),U=async a=>{var l;if(n.length>0){const o=(l=E.current)==null?void 0:l.getEditor().getText();o&&s("content",o),R(a)}else c.fire({icon:"error",title:"請確認封面圖片是否已上傳"})};return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"learning-need-form-wrap card-column",children:[e.jsx("h1",{children:"提出您的學習需求"}),e.jsxs("form",{className:"mt-4",onSubmit:j(U),children:[e.jsxs("h4",{className:"fs-7 fw-normal text-gray-01 lh-base",children:["圖片 (最多可以上傳五張)",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("div",{className:"d-flex flex-wrap gap-2 mt-1",children:[n&&e.jsx(e.Fragment,{children:n.map((a,l)=>e.jsxs("div",{className:"image-upload-wrapper",children:[e.jsx("input",{type:"file",accept:".jpg,.jpeg,.png",className:"form-control p-0",id:"cover_image",onChange:v}),e.jsx("label",{htmlFor:"cover_image",className:"form-label image-upload-label mb-0"}),e.jsxs("div",{className:"img-wrapper border-0 p-0",children:[e.jsx("img",{src:a,alt:"course-cover_image",className:"w-100 object-fit"}),e.jsx("button",{type:"button",onClick:()=>N(o=>o.filter(m=>m!=a)),children:e.jsx("span",{className:"material-symbols-outlined delete-icon",children:"delete"})})]})]},l))}),e.jsxs("div",{className:"image-upload-wrapper",children:[e.jsx("input",{type:"file",accept:".jpg,.jpeg,.png",className:"form-control p-0",id:"cover_image",onChange:v}),e.jsxs("label",{htmlFor:"cover_image",className:"form-label image-upload-label mb-0",children:[e.jsx("span",{className:"material-symbols-outlined mb-2",children:"imagesmode"}),"請上傳圖片，讓其他人更容易理解您的需求"]})]})]}),e.jsx("div",{className:"mt-6 mt-lg-8",children:e.jsx(F,{register:f,errors:h,id:"title",labelText:"學習需求標題",type:"text"})}),e.jsx("div",{className:"mt-6 mt-lg-8",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-lg-7",children:[e.jsxs("label",{className:"form-label",htmlFor:"level",children:["您的學習等級",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("div",{className:"dropdown",children:[e.jsxs("button",{type:"button",className:"btn btn-outline-gray-03 text-gray-01 border-1 dropdown-toggle d-block w-100 text-start px-4","data-bs-toggle":"dropdown","aria-expanded":"false",children:[y("level")||"請選擇學習等級",e.jsx("span",{className:"material-symbols-outlined position-absolute end-0 pe-3",children:"keyboard_arrow_down"})]}),e.jsx("ul",{className:"dropdown-menu w-100 mt-1",children:b.map(a=>e.jsx("li",{children:e.jsx("button",{type:"button",className:"dropdown-item",onClick:()=>s("level",a.name),children:a.name})},a.id))})]})]}),e.jsxs("div",{className:"col-lg-5 mt-6 mt-lg-0",children:[e.jsxs("label",{className:"form-label",htmlFor:"tech_stack",children:["開發工具與語言",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("div",{className:"dropdown",children:[e.jsxs("button",{type:"button",className:"btn btn-outline-gray-03 text-gray-01 border-1 dropdown-toggle d-block w-100 text-start px-4 position-relative","data-bs-toggle":"dropdown","aria-expanded":"false",children:[y("category")||"請選擇工具與語言",e.jsx("span",{className:"material-symbols-outlined position-absolute end-0 pe-3",children:"keyboard_arrow_down"})]}),e.jsx("ul",{className:"dropdown-menu w-100 mt-1",children:z.map(a=>e.jsx("li",{children:e.jsx("button",{type:"button",className:"dropdown-item",onClick:()=>s("category",a.name),children:a.name})},a.id))})]})]})]})}),e.jsx("div",{className:"mt-6 mt-lg-8",children:e.jsx(F,{register:f,errors:h,id:"tag",labelText:"關鍵字 (請用半型逗號隔開)",type:"text"})}),e.jsxs("div",{className:"pb-8 mt-6 mt-lg-8",children:[e.jsxs("label",{htmlFor:"content",className:"form-label",children:["學習需求描述",e.jsx("span",{className:"text-danger",children:"*"})]}),d&&e.jsxs(t.Suspense,{fallback:e.jsx(O,{}),children:[e.jsx(H,{name:"content",control:x,render:({field:a})=>e.jsx(ne,{...a,value:a.value||"",ref:E,onChange:a.onChange})}),h.content&&e.jsx("p",{className:"fs-7 text-danger",children:(I=h==null?void 0:h.content)==null?void 0:I.message})]})]}),e.jsxs("div",{className:"btn-container text-end mt-lg-4 d-none d-lg-block",children:[e.jsx("button",{type:"submit",className:"btn btn-outline-brand-03 border-3 w-25",style:{padding:"9px 24px"},onClick:r,children:"取消"}),e.jsx("button",{type:"submit",className:"btn btn-brand-03 ms-4",disabled:!k,children:"提出學習需求"})]}),e.jsx("div",{className:"text-end fixed-bottom bg-white shadow d-lg-none py-4",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"d-flex",children:[e.jsx("button",{type:"submit",className:"btn btn-outline-brand-03 w-100",onClick:r,children:"取消"}),e.jsx("button",{type:"submit",className:"btn btn-brand-03 w-100 ms-4",disabled:!k,children:"提出學習需求"})]})})})]})]})})}P.propTypes={setLoadingState:X.func.isRequired};function re(){const[i,p]=t.useState(!1),r=G(),{userData:d,isAuth:g}=J(n=>n.auth),b=B();return t.useEffect(()=>{d.id&&!d.subscriptions.filter(n=>n.plan_name==="premium").filter(n=>n.status==="active").length>0&&(c.fire({title:"成為高級會員後即可提出客製化學習需求",showCancelButton:!1,confirmButtonText:"確定"}),b(-1))},[d.id]),t.useEffect(()=>{g&&r(K())},[g]),t.useEffect(()=>{r(W())},[]),e.jsxs(e.Fragment,{children:[e.jsx(Y,{children:e.jsx("title",{children:"Coding∞bit ｜ 新增客製化需求"})}),i&&e.jsx(ee,{}),e.jsx(se,{}),e.jsx("div",{className:"add-learning-need-section",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-lg-6",children:e.jsxs("div",{className:"guide-wrap",children:[e.jsxs("div",{className:"guide-text-wrap p-0 p-sm-8",children:[e.jsx("h2",{children:"學習需求是什麼？"}),e.jsxs("div",{className:"mt-4 mt-lg-6",children:[e.jsx("p",{className:"fs-7",children:"不曉得您在程式學習上有沒有遇到以下情況："}),e.jsxs("ul",{className:"disc-list-style ps-5 py-4 py-lg-5",children:[e.jsx("li",{children:e.jsx("h3",{children:"只是想學習一個小知識點，卻找不到適合的教學，網路上的知識雜七雜八，沒有一個是真正符合需求的。"})}),e.jsx("li",{className:"mt-5",children:e.jsx("h3",{children:"學習到一半突然遇上一個小bug，卻不知道如何解決，需要有人手把手引導。"})})]}),e.jsx("p",{className:"fs-7",children:"這些情況，就適合提出客製化學習需求！只要在本頁面描述您的情況並填寫相關資訊，發表學習需求，就有機會獲得專屬解答。"})]}),e.jsx("div",{className:"divider-label-brand-02 d-flex align-items-center py-2 py-lg-4",children:e.jsx("hr",{})}),e.jsx("h2",{children:"該怎麼描述我的需求？"}),e.jsxs("ul",{className:"py-5",children:[e.jsxs("li",{children:[e.jsx("h3",{children:"1. 在標題寫上您使用的程式語言，並簡述您的學習需求"}),e.jsx("p",{className:"fs-7 ps-5 mt-2",children:"開頭寫上程式語言，再用簡短的一句話說明您希望解決的問題或達成的目標。(例如：CSS 毛玻璃樣式)"})]}),e.jsxs("li",{className:"mt-4 mt-lg-5",children:[e.jsx("h3",{children:"2. 選擇背景資訊"}),e.jsx("p",{className:"fs-7 ps-5 mt-2",children:"我們提供了幾個下拉式選單，請選擇符合自己情況的選項，讓大家更了解您的狀況，能回答得更加精準。"})]}),e.jsxs("li",{className:"mt-4 mt-lg-5",children:[e.jsx("h3",{children:"3. 填入關鍵字"}),e.jsx("p",{className:"fs-7 ps-5 mt-2",children:"填寫幾個關鍵字，讓大家更容易看見這個需求。關鍵字與關鍵字之間請以半形逗號隔開。(例如：React, 前端開發, 效能優化, Hooks)"})]}),e.jsxs("li",{className:"mt-4 mt-lg-5",children:[e.jsx("h3",{children:"4. 描述您的學習需求"}),e.jsx("p",{className:"fs-7 ps-5 mt-2",children:"請明確描述您想學習怎麼樣的小知識 / 想解決什麼問題，以成果為導向。"})]})]})]}),e.jsxs("div",{className:"openRobot-button-wrap bg-brand-02 position-relative",children:[e.jsx("img",{src:"images/deco/addLearningNeedBot.svg",alt:"addLearningNeedBot-icon",className:"position-absolute"}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-brand-03 fw-medium",children:"還是不太清楚該怎麼填寫？"}),e.jsxs("button",{type:"button",className:"btn btn-outline-none text-brand-03 fs-7 fs-lg-6 fw-bold slide-right-hover d-inline-flex f-align-center px-0 py-3","data-bs-toggle":"offcanvas","data-bs-target":"#offcanvasRight","aria-controls":"offcanvasRight",children:["點我開啟建立需求小幫手",e.jsx("span",{className:"material-symbols-outlined icon-fill fs-5 ms-1",children:"arrow_forward"})]})]})]})]})}),e.jsx("div",{className:"col-lg-6",children:e.jsx(P,{setLoadingState:p})})]})})}),e.jsx(ae,{})]})}export{re as default};
