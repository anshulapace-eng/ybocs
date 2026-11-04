import{u,j as e,L as m,a as f}from"./app-4Bg-d37J.js";import{c as i,b as n,F as v}from"./flower-2-BPFUOmzA.js";function x(s){var a,r,t="";if(typeof s=="string"||typeof s=="number")t+=s;else if(typeof s=="object")if(Array.isArray(s)){var o=s.length;for(a=0;a<o;a++)s[a]&&(r=x(s[a]))&&(t&&(t+=" "),t+=r)}else for(r in s)s[r]&&(t&&(t+=" "),t+=r);return t}function A(){for(var s,a,r=0,t="",o=arguments.length;r<o;r++)(s=arguments[r])&&(a=x(s))&&(t&&(t+=" "),t+=a);return t}/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 18v-1",key:"zg0ygc"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"M16 18v-3",key:"j5jt4h"}]],g=i("file-chart-column",k);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],j=i("layout-dashboard",b);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]],w=i("log-out",N);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],M=i("shield",_);/**
 * @license lucide-react v0.507.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],z=i("users",C);function S({children:s}){const{auth:a,url:r}=u().props,t=(a==null?void 0:a.user)||{},o=typeof window<"u"?window.location.pathname:r||"",p=()=>{f.post(n("/logout"))},c=[{to:n("/dashboard"),label:"Dashboard",icon:j},{to:n("/patients"),label:"Patients",icon:z},{to:n("/reports"),label:"Reports",icon:g}];return t.role==="admin"&&c.push({to:n("/admin/therapists"),label:"Therapists",icon:M}),e.jsxs("div",{className:"min-h-screen flex",style:{background:"var(--cream)"},children:[e.jsxs("aside",{className:"w-64 shrink-0 hidden md:flex flex-col py-8 px-5 border-r",style:{borderColor:"var(--line)",background:"#FBF6E9"},"data-testid":"sidebar",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-12 px-2",children:[e.jsx("div",{className:"w-9 h-9 rounded-full flex items-center justify-center",style:{background:"var(--ink)"},children:e.jsx(v,{size:18,color:"#FAF3E3"})}),e.jsxs("div",{children:[e.jsx("div",{className:"font-display text-2xl leading-none",style:{color:"var(--ink)"},children:"radial"}),e.jsx("div",{className:"text-[10px] tracking-widest uppercase",style:{color:"var(--ink-muted)"},children:"Y-BOCS Suite"})]})]}),e.jsx("nav",{className:"flex flex-col gap-1",children:c.map(({to:l,label:d,icon:y})=>{const h=o.startsWith(l);return e.jsxs(m,{href:l,"data-testid":`nav-${d.toLowerCase()}`,className:"flex items-center gap-3 px-3 py-2.5 rounded-xl transition hover:opacity-80",style:{background:h?"var(--cream-deep)":"transparent",color:"var(--ink)",fontWeight:h?600:400},children:[e.jsx(y,{size:18}),e.jsx("span",{className:"text-sm",children:d})]},l)})}),e.jsxs("div",{className:"mt-auto pt-6 border-t",style:{borderColor:"var(--line)"},children:[e.jsxs("div",{className:"px-3 mb-3",children:[e.jsx("div",{className:"text-sm font-medium",style:{color:"var(--ink)"},children:t.name||"Therapist"}),e.jsx("div",{className:"text-xs",style:{color:"var(--ink-muted)"},children:t.email})]}),e.jsxs("button",{onClick:p,"data-testid":"logout-btn",className:"flex items-center gap-2 px-3 py-2 rounded-xl text-sm w-full hover:opacity-80",style:{color:"var(--ink-soft)"},children:[e.jsx(w,{size:16})," Sign out"]})]})]}),e.jsx("main",{className:"flex-1 px-6 md:px-12 py-10",children:s})]})}export{S as A,M as S,z as U,A as c};
