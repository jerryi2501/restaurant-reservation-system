// TODO [WS]: Spring STOMP WebSocket 接続・購読ユーティリティ
// 使い方: const { connected, subscribe } = useWebSocket(token);
//   subscribe("/user/queue/updates", (data) => { ... });
import { useEffect, useRef, useState } from "react";

export function useWebSocket(token) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    // TODO [WS]: npm install @stomp/stompjs の後、以下を有効化
    // import { Client } from "@stomp/stompjs";
    // const client = new Client({
    //   brokerURL: "ws://localhost:8080/ws",
    //   connectHeaders: { Authorization: `Bearer ${token}` },
    //   onConnect:    () => setConnected(true),
    //   onDisconnect: () => setConnected(false),
    // });
    // client.activate();
    // clientRef.current = client;
    // return () => client.deactivate();
  }, [token]);

  function subscribe(destination, callback) {
    if (!clientRef.current?.connected) return { unsubscribe: () => {} };
    // TODO [WS]: return clientRef.current.subscribe(destination, (msg) => callback(JSON.parse(msg.body)));
    return { unsubscribe: () => {} };
  }

  return { connected, subscribe };
}
