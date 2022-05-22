import WebSocket from 'ws';
import { TextDecoder } from 'util';

export let wsServerUrl = 'wss://api.lanyard.rest/socket';
export let ws = new WebSocket(wsServerUrl)
export let interval = 30000;
export let intervalObject: NodeJS.Timeout;

ws.on('open', () => {
    console.log('Connection is established to WebSocket')

    initializeMessage();
})

ws.on('message', (buffer: any) => {
    let convert = new TextDecoder().decode(buffer);
    let json = JSON.parse(convert);
    console.log(json);
    return json;
})

function send(message: any) {
    return ws.send(JSON.stringify(message));
}

function initializeMessage() {
    let msg = {
        op: 2,
        d: {
            // subscribe_to_ids should be an array of user IDs you want to subscribe to presences from
            // if Lanyard doesn't monitor an ID specified, it won't be included in INIT_STATE
            subscribe_to_id: "391511241786654721"
        }
    }

    send(msg)
    intervalObject = setInterval(() => {
        console.log('Sending heartbeat_interval')
        let msg = {
            op: 3
        }
        send(msg)
    }, interval);
}