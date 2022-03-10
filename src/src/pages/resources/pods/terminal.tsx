import React, { useEffect, useRef } from 'react';
import 'xterm/css/xterm.css'; // 一定要记得引入css
import { message } from 'antd';
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';
import { API_SERVER } from '../../../apiserver'

export interface TerminalProps {
    tenantId?: number;
    clusterId?: number;
    namespace?: string;
    pod_Name?: string;
    container_Name?: string;
}

const WebTerminal: React.FC<TerminalProps> = props => {
    const divRef: any = useRef(null); 
    let socket: WebSocket;
    const initTerminal = () => {  
        const { tenantId,clusterId, namespace, pod_Name, container_Name } = props;
        //var url = "ws://localhost:8080/v1/pod/terminal?tenantId=1&clusterId=2&namespace=yoyogo&podName=yoyogo-867678b49b-ldtr5&containerName=sm"
        const reUri = API_SERVER.ws + `/v1/pod/terminal?tenantId=${tenantId}&clusterId=${clusterId}&namespace=${namespace}&podName=${pod_Name}&containerName=${container_Name}`
        console.log(reUri)
        const terminal = new Terminal({
            cursorBlink: true, // 光标闪烁
        });
      
        socket = new WebSocket(reUri);
        socket.onopen = () => {
            console.log('connection success');
        };

        socket.onerror = () => {
            message.error('连接出错')
        };

        socket.onmessage = function(event) {
            let msg = JSON.parse(event.data)
            if (msg.operation === "stdout") {
                terminal.write(msg.data)
            } else {
                console.log("invalid msg operation: "+msg)
            }
        };

        socket.onclose = function(event) {
                if (event.wasClean) {
                    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } else {
                    console.log('[close] Connection died');
                    terminal.writeln("")
                }
                terminal.write('Connection Reset By Peer! Try Refresh.');
        };

        socket.onerror = function(error) {
                console.log('[error] Connection error');
                terminal.write("error: "+error.eventPhase.toString());
                terminal.dispose()
        };
        const webLinksAddon = new WebLinksAddon();
        const fitAddon = new FitAddon();
        terminal.loadAddon(webLinksAddon);
        terminal.loadAddon(fitAddon);
        terminal.open(divRef.current);
        fitAddon.fit();
        terminal.write("connecting to pod "+ pod_Name + "...\r\n")
		// term.toggleFullScreen(true);
        terminal.onData(function (data) {
            console.log(data)
            let msg = {operation: "stdin", data: data}
            socket.send(JSON.stringify(msg))
        });
        terminal.onResize(function (size) {
            console.log("resize: " + size)
            let msg = {operation: "resize", cols: size.cols, rows: size.rows}
            socket.send(JSON.stringify(msg))
        });
    };
  
    useEffect(() => {
      if (socket) {
        socket.close();
      }
      initTerminal();
    }, [props.namespace, props.pod_Name, props.container_Name]);
  
    return <div style={{  width: '100%', height: 960 }} ref={divRef} />;
  };
  
  export default WebTerminal;
  
