import { useEffect, useState } from "react";

interface DailymotionProps {
  videoId: string;
  startAt?: number;
  onEnded?: () => void;
}

const DailymotionPlayer = ({ videoId, startAt, onEnded }: DailymotionProps) => {
  const [showNotice, setShowNotice] = useState(true);
  const baseUrl = `https://www.dailymotion.com/embed/video/${videoId}`;
  
  // Agregamos el parámetro api=postMessage para que el iframe nos envíe eventos
  const params = new URLSearchParams({
    autoplay: "1", // Generalmente para que pase al siguiente solo funciona si está en 1
    controls: "1",
    start: (startAt || 0).toString(),
    api: "postMessage", 
    origin: window.location.origin // Le decimos a DM a dónde enviar los mensajes
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotice(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Seguridad: Solo escuchar mensajes de Dailymotion
      if (!event.origin.includes("dailymotion.com")) return;

      try {
        // Dailymotion envía la data como string o objeto dependiendo de la versión
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // El evento específico que envía el iframe cuando termina es 'end' o 'video_end'
        if (data.event === "video_end" || data.event === "end") {
          console.log("Dailymotion detectó el final del video");
          onEnded?.();
        }
      } catch (e) {
        console.log(e);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onEnded]);

  return (
    <div className="dm-player" style={{ width: "100%", aspectRatio: "16/9", backgroundColor: "#000" }}>
      {showNotice && (
        <div className="dm-notice">
          ℹ️ Este video es de Dailymotion. Ante cualquier inestabilidad, intentar luego...
        </div>
      )}
      <iframe
        src={`${baseUrl}?${params.toString()}`}
        width="100%"
        height="100%"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default DailymotionPlayer;