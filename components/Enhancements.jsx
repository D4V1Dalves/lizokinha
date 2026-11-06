const {useEffect,useRef,useState}=React;
const h=React.createElement;
function Media({src,alt='',mode='click',...props}){
 const ref=useRef(null);const video=/^data:video\//.test(src||'');const audio=/^data:audio\//.test(src||'');
 useEffect(()=>{const el=ref.current;if(!video||mode!=='visible'||!el)return;const ob=new IntersectionObserver(([entry])=>{if(entry.isIntersecting)el.play().catch(()=>{});else el.pause();},{threshold:.35});ob.observe(el);return()=>ob.disconnect();},[src,mode]);
 if(video)return <video {...props} ref={ref} src={src} controls playsInline muted={mode==='visible'} loop={mode==='visible'} preload="metadata" aria-label={alt}/>;
 if(audio)return <audio {...props} src={src} controls preload="metadata" aria-label={alt}/>;
 return <img {...props} src={src} alt={alt}/>;
}
function BackgroundMusic({src}){
 const ref=useRef(null);const [playing,setPlaying]=useState(false);const intent=useRef(true);
 useEffect(()=>{const el=ref.current;if(!el||!src)return;intent.current=true;el.volume=.35;const start=()=>{if(intent.current)el.play().catch(()=>setPlaying(false));};start();window.addEventListener('pointerdown',start);window.addEventListener('keydown',start);return()=>{window.removeEventListener('pointerdown',start);window.removeEventListener('keydown',start);el.pause();};},[src]);
 if(!src)return null;
 return <div className="background-player"><audio ref={ref} src={src} loop autoPlay onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/><button onClick={()=>{intent.current=!playing;if(playing)ref.current.pause();else ref.current.play().catch(()=>setPlaying(false));}} aria-label={playing?'Pausar música de fundo':'Tocar música de fundo'}>{playing?'Ⅱ PAUSAR MÚSICA':'♫ OUVIR NOSSA TRILHA'}</button></div>;
}
function LetterPaper({text,src,mode}){
 const [image,setImage]=useState('');
 useEffect(()=>{if(src){setImage(src);return;}const c=document.createElement('canvas');c.width=960;c.height=1200;const ctx=c.getContext('2d');ctx.fillStyle='#f4f0e8';ctx.fillRect(0,0,960,1200);ctx.fillStyle='#5A262C';ctx.font='italic 42px Georgia';ctx.fillText('Só para você, Liz.',70,100);ctx.font='28px Georgia';let y=175;for(const paragraph of text.split('\n')){let line='';for(const word of paragraph.split(/\s+/)){if(ctx.measureText(line+word).width>810){ctx.fillText(line,70,y);y+=41;line='';}line+=word+' ';}ctx.fillText(line,70,y);y+=60;}ctx.font='italic 27px Georgia';ctx.fillText('Com todo o amor que existe em mim.',70,1120);setImage(c.toDataURL('image/png'));},[text,src]);
 if(src&&/^data:(video|audio)\//.test(src))return <div className="letter"><Media src={src} mode={mode} alt="Sua carta"/></div>;
 return <div className="interactive-letter"><p>Segure e arraste a carta. Solte para desamassar.</p>{image&&<window.PaperCrumple src={image} alt="Sua carta, Liz" width={320} height={400} sceneHeight={560} releaseBehavior="restore" crumpleAmount={.85} crumpleDuration={.55} releaseDuration={.4} foldCount={6} foldSharpness={.6} wrinkleDepth={.65} creaseStrength={.18} paperColor="#f4f0e8" paperTexture={.08} draggable returnToOrigin/>}<details><summary>Ler a carta em texto</summary><div className="letter">{text}</div></details></div>;
}
function AssetEditor({label,field,data,save,readFile,show}){
 const [busy,setBusy]=useState(false);const src=data[field];const mode=data[field+'Mode']||'click';
 return <div className="admin-row"><h3>{label}</h3><label>{label} — escolher arquivo<input type="file" accept="image/*,video/*,audio/*,.svg,.gif,.webp,.avif,.mp4,.webm,.mov,.mp3,.wav,.ogg" disabled={busy} onChange={async e=>{const f=e.target.files[0];if(!f)return;if(!/^(image|video|audio)\//.test(f.type)){show('Escolha uma imagem, vídeo ou áudio compatível com o navegador.');e.target.value='';return;}setBusy(true);try{await save({...data,[field]:await readFile(f)});}catch{show('Não foi possível ler o arquivo.');}finally{setBusy(false);e.target.value='';}}}/></label>{src&&<><Media src={src} mode="click" alt={'Prévia: '+label}/>{/^data:video\//.test(src)&&<label>Reprodução do vídeo<select value={mode} onChange={e=>save({...data,[field+'Mode']:e.target.value})}><option value="click">Ao clicar (com som disponível)</option><option value="visible">Ao aparecer na tela (sem som)</option></select></label>}<button className="btn" onClick={()=>save({...data,[field]:null})}>REMOVER ARQUIVO</button></>}</div>;
}
Object.assign(window,{Media,BackgroundMusic,LetterPaper,AssetEditor});
