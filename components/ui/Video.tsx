interface VideoProps {
  src: string;
  poster?: string;
}

export default function Video({ src, poster }: VideoProps) {
  return (
    <video
      controls
      preload="none"
      poster={poster}
      style={{
        width: '100%',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: '#1a1a1a',
      }}
    >
      <source src={src} type="video/webm" />
    </video>
  );
}
