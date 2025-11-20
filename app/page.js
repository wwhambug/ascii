'use client';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [src, setSrc] = useState(null);
  const videoRef = useRef(null);
  const preRef = useRef(null);
  const canvasRef = useRef(null); // 화면에 안보이는 캔버스

  const CHARS = "Ñ@#W$9876543210?!abc;:+=-,._ "; // 어두움 -> 밝음 문자셋

  const play = (e) => {
    e.preventDefault();
    if(url) setSrc(`/api/video?url=${encodeURIComponent(url)}`);
  };

  useEffect(() => {
    let frameId;
    const render = () => {
      const vid = videoRef.current;
      const cvs = canvasRef.current;
      const pre = preRef.current;

      if (vid && !vid.paused && !vid.ended && cvs && pre) {
        const ctx = cvs.getContext('2d', { willReadFrequently: true });
        const w = 100; // 가로 해상도 (문자 개수)
        const h = Math.floor(w * (vid.videoHeight / vid.videoWidth) * 0.55); // 세로 비율 보정

        cvs.width = w;
        cvs.height = h;
        ctx.drawImage(vid, 0, 0, w, h);

        const { data } = ctx.getImageData(0, 0, w, h);
        let ascii = "";

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // 픽셀 밝기 평균
          const charIdx = Math.floor((avg / 255) * (CHARS.length - 1));
          ascii += CHARS[charIdx];
          if (((i / 4) + 1) % w === 0) ascii += "\n"; // 줄바꿈
        }
        pre.textContent = ascii;
      }
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, [src]); // src가 바뀌면 실행

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#0f0', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <form onSubmit={play} style={{ marginBottom: '20px', zIndex: 10 }}>
        <input 
          value={url} onChange={e => setUrl(e.target.value)} 
          placeholder="Youtube URL" 
          style={{ background: '#333', border: 'none', color: '#fff', padding: '10px', width: '300px' }} 
        />
        <button style={{ background: '#0f0', color: '#000', border: 'none', padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>RUN</button>
      </form>
      
      {/* ASCII 출력 화면 */}
      <pre ref={preRef} style={{ fontSize: '10px', lineHeight: '10px', whiteSpace: 'pre' }}>
        Ready to Input...
      </pre>

      {/* 숨겨진 요소들 */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {src && <video ref={videoRef} src={src} crossOrigin="anonymous" autoPlay playsInline muted style={{ display: 'none' }} />}
    </div>
  );
                                  }
    
