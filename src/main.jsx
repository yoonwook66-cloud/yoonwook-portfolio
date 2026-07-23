import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {
  Award, BriefcaseBusiness, Building2, Cloud, Code2, Download, Github, Image,
  LogIn, LogOut, Mail, Menu, Phone, Plus, Save, Settings, ShieldCheck,
  TestTube2, Trash2, Upload, Users, X
} from 'lucide-react';
import './styles.css';

const B = import.meta.env.BASE_URL;
const CONFIG_KEY = 'yw_portfolio_config_v2';
const ADMIN_SESSION_KEY = 'yw_admin_session';
const DB_NAME = 'yw_portfolio_assets';
const STORE = 'assets';

const defaults = {
  adminPin: '1966',
  hero: {
    eyebrow: '37년 금융 IT 경험과 AI 품질 테스트 역량을 보유한',
    title1: 'FINANCIAL IT',
    title2: 'PROFESSIONAL',
    description: '금융 시스템 구축부터 AI 기반 품질 개선까지,\n신뢰할 수 있는 IT 서비스로 가치를 만듭니다.',
    portraitAsset: 'portrait',
    backgroundAsset: 'heroBackground'
  },
  contact: {
    phone: '010-5352-3448',
    email: 'yoonwook@naver.com',
    github: 'https://github.com/yoonwook66-cloud'
  },
  downloads: {
    resumeName: '윤욱_IT이력서_20260721_최종.doc',
    portfolioName: '윤욱_금융IT_포트폴리오_20260722_v1.0.pptx'
  },
  career: [
    {period:'1989 ~ 1996', company:'한일약품공업㈜', role:'전산실 / 개발'},
    {period:'1996 ~ 1999', company:'뉴비지니스시스템㈜', role:'금융사업부'},
    {period:'2007 ~ 2010', company:'SK C&C / IBM', role:'금융사업 / GBS'},
    {period:'2014 ~ 2026', company:'한화시스템/ICT', role:'금융프로젝트팀 / 사업관리'}
  ],
  projects: [
    {id:'p1', title:'국민은행 차세대 시스템 구축', subtitle:'여신사전심사 시스템', role:'PL', period:'2007.11 ~ 2010.06', asset:'project-1'},
    {id:'p2', title:'K-Bank 시스템 구축', subtitle:'인터넷은행 신용평가시스템', role:'PL', period:'2016.04 ~ 2017.03', asset:'project-2'},
    {id:'p3', title:'AI 자동견적시스템 구축(AOS)', subtitle:'보험개발원 AI AOS 구축 사업관리', role:'사업관리', period:'2019.03 ~ 2020.01', asset:'project-3'},
    {id:'p4', title:'제주은행 차세대시스템 구축', subtitle:'여신사후관리 분석/설계/개발', role:'개발', period:'2020.04 ~ 2021.11', asset:'project-4'},
    {id:'p5', title:'플러스앱 구축', subtitle:'한화생명 모바일 구축사업', role:'사업관리', period:'2022.04 ~ 2022.11', asset:'project-5'}
  ]
};

function loadConfig(){
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw ? {...defaults, ...JSON.parse(raw)} : defaults;
  } catch { return defaults; }
}
function saveConfig(c){ localStorage.setItem(CONFIG_KEY, JSON.stringify(c)); }

function openDb(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,1);
    req.onupgradeneeded=()=>req.result.createObjectStore(STORE);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
async function putAsset(key, file){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).put(file,key);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
  });
}
async function getAsset(key){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const req=db.transaction(STORE).objectStore(STORE).get(key);
    req.onsuccess=()=>resolve(req.result || null);
    req.onerror=()=>reject(req.error);
  });
}
async function deleteAsset(key){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error);
  });
}
async function listAssets(){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE);
    const req=tx.objectStore(STORE).getAllKeys();
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}
function fileToDataURL(file){
  return new Promise((resolve,reject)=>{
    const r=new FileReader(); r.onload=()=>resolve(r.result); r.onerror=()=>reject(r.error); r.readAsDataURL(file);
  });
}
function dataURLToBlob(dataURL){
  const [meta,data]=dataURL.split(',');
  const mime=(meta.match(/data:(.*?);/)||[])[1]||'application/octet-stream';
  const bytes=atob(data); const arr=new Uint8Array(bytes.length);
  for(let i=0;i<bytes.length;i++) arr[i]=bytes.charCodeAt(i);
  return new Blob([arr],{type:mime});
}

function useAssetUrl(key, fallback){
  const [url,setUrl]=useState(fallback);
  useEffect(()=>{
    let active=true, objectUrl=null;
    (async()=>{
      const blob=await getAsset(key);
      if(active && blob){ objectUrl=URL.createObjectURL(blob); setUrl(objectUrl); }
      else if(active) setUrl(fallback);
    })().catch(()=>setUrl(fallback));
    return ()=>{active=false;if(objectUrl)URL.revokeObjectURL(objectUrl)};
  },[key,fallback]);
  return url;
}

function AssetImage({asset,fallback,alt,className}){
  const url=useAssetUrl(asset,fallback);
  return <img src={url} alt={alt} className={className}/>;
}

async function downloadAsset(key, fallback, filename){
  const blob=await getAsset(key);
  if(blob){
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=filename;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }else{
    const a=document.createElement('a');a.href=fallback;a.download=filename;a.click();
  }
}

function Site({config,setAdmin}){
  const [open,setOpen]=useState(false);
  const heroBg=useAssetUrl(config.hero.backgroundAsset, B+'images/hero-city.jpg');
  const skills=[[Building2,'금융 SI'],[ShieldCheck,'여신/융자'],[Users,'PM / PL'],[TestTube2,'QA / 테스트'],[Code2,'AI Quality'],[Cloud,'AWS / 클라우드']];
  const certs=[['ISTQB','2024'],['KSTQB Gen-AI','2026'],['정보처리기사','2019'],['소방안전관리자 1급','2023'],['소방안전관리자 2급','2023'],['프로그래밍기능사','1989']];
  return <>
    <header>
      <a className="brand" href="#home"><b>YOON <i>WOOK</i></b><small>Financial IT Professional</small></a>
      <nav className={open?'open':''}>
        {['HOME','ABOUT','CAREER','PROJECTS','SKILLS','CERTIFICATIONS','CONTACT'].map(x=><a key={x} href={'#'+x.toLowerCase()} onClick={()=>setOpen(false)}>{x}</a>)}
        <button className="admin-link" onClick={()=>setAdmin(true)}><Settings size={15}/> 관리자</button>
      </nav>
      <button className="menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </header>
    <main>
      <section id="home" className="hero" style={{backgroundImage:`linear-gradient(90deg,rgba(3,16,31,.96) 0%,rgba(3,16,31,.72) 43%,rgba(3,16,31,.15) 77%), url("${heroBg}")`}}>
        <div className="copy">
          <p className="gold">{config.hero.eyebrow}</p>
          <h1>{config.hero.title1}<br/><span>{config.hero.title2}</span></h1>
          <p className="lead">{config.hero.description.split('\n').map((t,i)=><React.Fragment key={i}>{t}{i===0?<br/>:null}</React.Fragment>)}</p>
          <div className="tags">{['PM / PL','금융 SI','여신/융자','AI Quality','Software Tester'].map(x=><em key={x}>{x}</em>)}</div>
          <div className="actions">
            <button className="primary" onClick={()=>downloadAsset('resume',B+'downloads/'+config.downloads.resumeName,config.downloads.resumeName)}><Download/>이력서 다운로드</button>
            <button onClick={()=>downloadAsset('portfolio',B+'downloads/'+config.downloads.portfolioName,config.downloads.portfolioName)}><Download/>포트폴리오 다운로드</button>
          </div>
        </div>
        <div className="portrait"><AssetImage asset={config.hero.portraitAsset} fallback={B+'images/yoonwook-main-transparent.png'} alt="윤욱"/></div>
      </section>
      <section className="stats">
        {[[BriefcaseBusiness,'37 YEARS+','IT 경력'],[Building2,'15+','금융 프로젝트'],[Award,'7+','전문 자격증'],[Users,'PM / PL / QA','다양한 역할 수행']].map(([I,v,l])=><article key={v}><I/><div><b>{v}</b><small>{l}</small></div></article>)}
      </section>
      <section id="about" className="two"><div><p className="gold">ABOUT ME</p><h2>신뢰는 책임감에서 시작되고,<br/>성장은 배움에서 완성됩니다.</h2><p>1989년 전산개발자로 시작해 제조와 금융 분야에서 37년간 시스템 구축 프로젝트를 수행했습니다. 은행·보험 차세대 시스템과 여신·신용평가·사후관리 업무를 중심으로 개발, 분석·설계, PL, PM 및 사업관리까지 폭넓게 경험했습니다.</p><p>최근에는 ISTQB와 KSTQB Gen-AI를 기반으로 AI Agent 평가, 테스트 자동화, FastAPI, AWS를 학습하며 금융 IT 경험에 AI 품질 역량을 더하고 있습니다.</p></div><div><p className="gold">핵심 역량</p><div className="skillgrid">{skills.map(([I,t])=><article key={t}><I/><b>{t}</b></article>)}</div></div></section>
      <section id="career"><p className="gold">CAREER HIGHLIGHTS</p><h2>경력 타임라인</h2><div className="timeline">{config.career.map((x,i)=><article key={i}><span></span><b>{x.period}</b><h3>{x.company}</h3><p>{x.role}</p></article>)}</div></section>
      <section id="projects"><p className="gold">PROJECT EXPERIENCE</p><h2>주요 프로젝트</h2><div className="projects">{config.projects.map((p,i)=><article key={p.id}><ProjectThumb asset={p.asset} fallback={B+`images/project-${Math.min(i+1,5)}.jpg`} index={i}/><div className="pad"><h3>{p.title}</h3><p>{p.subtitle}</p><footer><b>{p.role}</b><span>{p.period}</span></footer></div></article>)}</div></section>
      <section id="skills"><p className="gold">ROLE FIT</p><h2>즉시 기여할 수 있는 역할</h2><div className="roles"><article><b>01</b><h3>금융 IT PM / PL</h3><p>금융 도메인 이해를 바탕으로 요구사항, 일정, 위험과 품질을 관리합니다.</p></article><article><b>02</b><h3>IT 품질관리 / QA</h3><p>ISTQB 관점과 프로젝트 경험을 결합해 테스트 전략과 품질 체계를 개선합니다.</p></article><article><b>03</b><h3>AI 서비스 평가</h3><p>Agent Judge와 RAG 평가 경험을 활용해 AI 서비스 검증 기준을 설계합니다.</p></article></div></section>
      <section id="certifications"><p className="gold">CERTIFICATIONS</p><h2>보유 자격증</h2><div className="certs">{certs.map(x=><article key={x[0]}><Award/><div><b>{x[0]}</b><small>{x[1]}</small></div></article>)}</div></section>
      <section id="contact" className="contact"><div><p className="gold">CONTACT</p><h2>경험을 안정적인 성과로 연결하겠습니다.</h2></div><div><a href={'tel:'+config.contact.phone.replaceAll('-','')}><Phone/>{config.contact.phone}</a><a href={'mailto:'+config.contact.email}><Mail/>{config.contact.email}</a><a href={config.contact.github} target="_blank"><Github/>GitHub</a></div></section>
    </main>
    <div className="bottom">© 2026 YOON WOOK</div>
  </>;
}

function ProjectThumb({asset,fallback,index}){
  const url=useAssetUrl(asset,fallback);
  return <div className="thumb" style={{backgroundImage:`linear-gradient(180deg,transparent,rgba(2,12,23,.65)),url("${url}")`}}><strong>{String(index+1).padStart(2,'0')}</strong></div>
}

function FileUpload({label,assetKey,accept,onUploaded}){
  const [name,setName]=useState('');
  return <label className="upload-box"><Upload/><span><b>{label}</b><small>{name||'파일 선택'}</small></span><input type="file" accept={accept} onChange={async e=>{const f=e.target.files?.[0];if(!f)return;await putAsset(assetKey,f);setName(f.name);onUploaded?.(f)}}/></label>
}

function Admin({config,setConfig,onClose}){
  const [logged,setLogged]=useState(sessionStorage.getItem(ADMIN_SESSION_KEY)==='yes');
  const [pin,setPin]=useState('');
  const [draft,setDraft]=useState(structuredClone(config));
  const [tab,setTab]=useState('media');
  const [message,setMessage]=useState('');

  if(!logged) return <div className="admin-shell"><div className="login-card"><Settings size={42}/><h1>포트폴리오 관리자</h1><p>관리자 PIN을 입력하세요.</p><input type="password" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&pin===config.adminPin){sessionStorage.setItem(ADMIN_SESSION_KEY,'yes');setLogged(true)}}}/><button className="save-btn" onClick={()=>{if(pin===config.adminPin){sessionStorage.setItem(ADMIN_SESSION_KEY,'yes');setLogged(true)}else setMessage('PIN이 올바르지 않습니다.')}}><LogIn/> 로그인</button>{message&&<p className="error">{message}</p>}<button className="ghost" onClick={onClose}>홈으로</button><small>초기 PIN: 1966 · 정적 웹사이트의 간단한 접근 제한이며 보안 로그인은 아닙니다.</small></div></div>;

  const save=()=>{saveConfig(draft);setConfig(structuredClone(draft));setMessage('저장되었습니다. 이 브라우저에서 즉시 반영됩니다.');};
  const updateCareer=(i,key,val)=>setDraft(d=>({...d,career:d.career.map((x,j)=>j===i?{...x,[key]:val}:x)}));
  const updateProject=(i,key,val)=>setDraft(d=>({...d,projects:d.projects.map((x,j)=>j===i?{...x,[key]:val}:x)}));

  const exportBackup=async()=>{
    const keys=await listAssets(); const assets={};
    for(const k of keys){const f=await getAsset(k);assets[k]={name:f.name||k,type:f.type,data:await fileToDataURL(f)}}
    const blob=new Blob([JSON.stringify({config:draft,assets},null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='yoonwook-portfolio-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  };
  const importBackup=async(file)=>{
    const data=JSON.parse(await file.text());
    if(data.config){setDraft(data.config);saveConfig(data.config);setConfig(data.config)}
    for(const [k,v] of Object.entries(data.assets||{})){const blob=dataURLToBlob(v.data);await putAsset(k,new File([blob],v.name||k,{type:v.type}))}
    setMessage('백업을 가져왔습니다.');
  };

  return <div className="admin-page">
    <aside className="admin-sidebar"><div><h2>YOON WOOK</h2><p>Portfolio Admin</p></div>
      {[['media','사진·파일'],['career','경력 사항'],['projects','프로젝트'],['text','메인 문구'],['system','설정·백업']].map(([id,t])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{t}</button>)}
      <button onClick={()=>{sessionStorage.removeItem(ADMIN_SESSION_KEY);setLogged(false)}}><LogOut/> 로그아웃</button>
      <button onClick={onClose}>홈페이지 보기</button>
    </aside>
    <main className="admin-main">
      <div className="admin-top"><div><p>ADMINISTRATION</p><h1>홈페이지 관리</h1></div><button className="save-btn" onClick={save}><Save/> 변경사항 저장</button></div>
      {message&&<div className="notice">{message}</div>}
      {tab==='media'&&<section className="admin-panel"><h2>사진 및 다운로드 파일 교체</h2><div className="upload-grid"><FileUpload label="메인 프로필 사진" assetKey="portrait" accept="image/*"/><FileUpload label="메인 배경 사진" assetKey="heroBackground" accept="image/*"/><FileUpload label="이력서 교체" assetKey="resume" accept=".doc,.docx,.pdf" onUploaded={f=>setDraft(d=>({...d,downloads:{...d.downloads,resumeName:f.name}}))}/><FileUpload label="포트폴리오 교체" assetKey="portfolio" accept=".ppt,.pptx,.pdf" onUploaded={f=>setDraft(d=>({...d,downloads:{...d.downloads,portfolioName:f.name}}))}/></div><h3>프로젝트 배경 이미지</h3><div className="upload-grid">{draft.projects.map((p,i)=><FileUpload key={p.id} label={`${i+1}. ${p.title}`} assetKey={p.asset} accept="image/*"/>)}</div></section>}
      {tab==='career'&&<section className="admin-panel"><div className="panel-title"><h2>경력 사항 수정</h2><button onClick={()=>setDraft(d=>({...d,career:[...d.career,{period:'',company:'',role:''}]}))}><Plus/> 경력 추가</button></div>{draft.career.map((c,i)=><div className="edit-row" key={i}><input value={c.period} onChange={e=>updateCareer(i,'period',e.target.value)} placeholder="기간"/><input value={c.company} onChange={e=>updateCareer(i,'company',e.target.value)} placeholder="회사명"/><input value={c.role} onChange={e=>updateCareer(i,'role',e.target.value)} placeholder="업무"/><button className="danger" onClick={()=>setDraft(d=>({...d,career:d.career.filter((_,j)=>j!==i)}))}><Trash2/></button></div>)}</section>}
      {tab==='projects'&&<section className="admin-panel"><div className="panel-title"><h2>수행 프로젝트 수정</h2><button onClick={()=>setDraft(d=>({...d,projects:[...d.projects,{id:crypto.randomUUID(),title:'새 프로젝트',subtitle:'',role:'',period:'',asset:'project-'+crypto.randomUUID()}]}))}><Plus/> 프로젝트 추가</button></div>{draft.projects.map((p,i)=><div className="project-edit" key={p.id}><div className="number">{i+1}</div><div className="form-grid"><label>프로젝트명<input value={p.title} onChange={e=>updateProject(i,'title',e.target.value)}/></label><label>설명<input value={p.subtitle} onChange={e=>updateProject(i,'subtitle',e.target.value)}/></label><label>역할<input value={p.role} onChange={e=>updateProject(i,'role',e.target.value)}/></label><label>기간<input value={p.period} onChange={e=>updateProject(i,'period',e.target.value)}/></label></div><FileUpload label="배경 이미지" assetKey={p.asset} accept="image/*"/><button className="danger" onClick={()=>setDraft(d=>({...d,projects:d.projects.filter((_,j)=>j!==i)}))}><Trash2/> 삭제</button></div>)}</section>}
      {tab==='text'&&<section className="admin-panel"><h2>메인 화면 문구 수정</h2><div className="form-stack"><label>상단 소개 문구<input value={draft.hero.eyebrow} onChange={e=>setDraft(d=>({...d,hero:{...d.hero,eyebrow:e.target.value}}))}/></label><label>첫 번째 제목<input value={draft.hero.title1} onChange={e=>setDraft(d=>({...d,hero:{...d.hero,title1:e.target.value}}))}/></label><label>강조 제목<input value={draft.hero.title2} onChange={e=>setDraft(d=>({...d,hero:{...d.hero,title2:e.target.value}}))}/></label><label>설명<textarea rows="4" value={draft.hero.description} onChange={e=>setDraft(d=>({...d,hero:{...d.hero,description:e.target.value}}))}/></label></div></section>}
      {tab==='system'&&<section className="admin-panel"><h2>관리자 설정 및 백업</h2><div className="form-stack"><label>관리자 PIN<input type="password" value={draft.adminPin} onChange={e=>setDraft(d=>({...d,adminPin:e.target.value}))}/></label><label>전화번호<input value={draft.contact.phone} onChange={e=>setDraft(d=>({...d,contact:{...d.contact,phone:e.target.value}}))}/></label><label>이메일<input value={draft.contact.email} onChange={e=>setDraft(d=>({...d,contact:{...d.contact,email:e.target.value}}))}/></label><label>GitHub 주소<input value={draft.contact.github} onChange={e=>setDraft(d=>({...d,contact:{...d.contact,github:e.target.value}}))}/></label></div><div className="backup-actions"><button onClick={exportBackup}><Download/> 전체 백업 내보내기</button><label className="button-label"><Upload/> 백업 가져오기<input type="file" accept=".json" onChange={e=>e.target.files?.[0]&&importBackup(e.target.files[0])}/></label><button className="danger" onClick={async()=>{localStorage.removeItem(CONFIG_KEY);for(const k of await listAssets())await deleteAsset(k);setDraft(structuredClone(defaults));setConfig(structuredClone(defaults));setMessage('초기 상태로 복원했습니다.')}}><Trash2/> 전체 초기화</button></div><div className="warning"><b>중요:</b> GitHub Pages는 정적 호스팅이므로 이 관리자 변경은 현재 브라우저의 IndexedDB/localStorage에 저장됩니다. 다른 PC와 방문자에게 동일하게 공개하려면 Supabase·Firebase 같은 서버 저장소를 연결해야 합니다.</div></section>}
    </main>
  </div>;
}

function App(){
  const [config,setConfig]=useState(loadConfig);
  const [admin,setAdmin]=useState(location.hash==='#/admin');
  useEffect(()=>{const fn=()=>setAdmin(location.hash==='#/admin');addEventListener('hashchange',fn);return()=>removeEventListener('hashchange',fn)},[]);
  const openAdmin=()=>{location.hash='/admin';setAdmin(true)};
  const closeAdmin=()=>{location.hash='';setAdmin(false)};
  return admin?<Admin config={config} setConfig={setConfig} onClose={closeAdmin}/>:<Site config={config} setAdmin={openAdmin}/>;
}
createRoot(document.getElementById('root')).render(<App/>);
