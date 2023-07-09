import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("https://chat-hn-prueba.onrender.com/");

interface IMensajes {
  id: string;
  msg: string;
}

function App() {
  const [isConected, setIsConected] = useState(false);
  const [mensajes, setMensajes] = useState<IMensajes[]>([]);
  const [mensajeAEnviar, setMensajeAEnviar] = useState("");

  const onChangeMensaje = ({ target }: { target: { value: string } }) => {
    setMensajeAEnviar(target.value);
  };

  const enviarMensaje = () => {
    if (mensajeAEnviar.trim().length === 0) return alert("Escriba un mensaje");
    socket.emit("chat_message", {
      msg: mensajeAEnviar,
      id: socket.id,
    });

    setMensajeAEnviar("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setIsConected(true);
    });

    socket.on("chat_message", (data: IMensajes) => {
      setMensajes((mensajes) => [...mensajes, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("chat_message");
    };
  }, []);

  console.log("MENSAJES >> ", mensajes);

  return (
    <div>
      <h1>Chat demo {isConected.toString()}</h1>

      <div
        style={{
          backgroundColor: "grey",
          height: "20rem",
          width: "50rem",
          padding: "0.5rem",
          borderRadius: "1rem",
        }}
      >
        {mensajes.map((e, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#176B87",
              borderRadius: "1rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              marginBottom: "0.3rem",
            }}
          >
            <span>{e.msg}</span>
          </div>
        ))}
      </div>

      <input type="text" value={mensajeAEnviar} onChange={onChangeMensaje} />
      <button type="button" onClick={enviarMensaje}>
        Enviar
      </button>
    </div>
  );
}

export default App;
