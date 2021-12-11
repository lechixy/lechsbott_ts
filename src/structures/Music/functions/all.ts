import { client } from "../../.."

export function removeAndClear(guildId: any, disconnect = false) {

    const subscription = client.queue.get(guildId)

    subscription.voiceConnection.removeAllListeners()
    subscription.audioPlayer.removeAllListeners()

    console.log('Removed listeners and queue, deleted every process')

    if (disconnect === true) {
        console.log("Also leaved vc")
        subscription.voiceConnection.disconnect()
        subscription.voiceConnection.destroy(true)
    }

    client.queue.delete(guildId)
    return;

}

export function findTypeAndSend(content: any, method: any): Promise<any> {
    if (method.type !== 'APPLICATION_COMMAND') {
        return method.channel.send(content)
    } else {
        return method.followUp(content)
    }
}

export function defineAuthor(msg: any, value: any): any {
    if (msg.type !== 'APPLICATION_COMMAND') {
        let checkvalue = {
            "username": msg.author.username,
            "id": msg.author.id,
            "displayAvatarURL": msg.author.displayAvatarURL({ dynamic: true })
        }

        return checkvalue[value]
    } else {
        let checkvalue = {
            "username": msg.user.username,
            "id": msg.user.id,
            "displayAvatarURL": msg.user.displayAvatarURL({ dynamic: true })
        }

        return checkvalue[value]

    }
}

export function isMentioned(what: string | string[], search: string): boolean {
    if (what.includes(search) || what[0].includes(search)) {
        return true
    } else {
        return false
    }
}

export function formatTime(time: string | number): string {
    if (time < 10) {
        return `0${time}`
    }
    return `${time}`
}

export function toTimestamp(second: string | number): string {
    if (typeof second === "string") {
        second = parseInt(second);
    }

    if (second < 60) {
        return `00:${second}`
    } else {
        let a = Math.round(second / 60)
        let b = second - (a * 60)

        return `${formatTime(a)}:${formatTime(b)}`
    }
}

export function timeConverter(timestamp: string): number {
    const split = timestamp.split(':')

    if (split.length > 2) {

        let [hour, minute, second] = split;
        

        return parseInt(hour) * 3600 + parseInt(minute) * 60 + parseInt(second) * 1
    } else {

        let [minute, second] = split;

        return (parseInt(minute) * 60 + parseInt(second) * 1)

    }
}

export function clearAndStopPlayer(guildId: string){

    const subscription = client.queue.get(guildId)

    console.log('Removed audioPlayer listener and stopped the player')

    subscription.audioPlayer.removeAllListeners()
    return void subscription.audioPlayer.stop(true)
}

// export function waitForTimeout(guildId: string){

//     const subscription = client.queue.get(guildId)

//     subscription.audioPlayer.removeAllListeners()
//     subscription.voiceConnection.removeAllListeners()


// }