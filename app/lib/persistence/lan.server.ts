import { logger } from "~/lib/logging/logging"
import { subscribeObjectManager } from "./db.server"
import * as fs from 'fs';

declare global {
    var lan: Lan
}

export interface Lan {
    name: string,
    motd: string
}

const lanFilePath = 'db/lan.json'

subscribeObjectManager("lan", {
    onRestore: () => {
        if (global.lan) {
            return;
        }

        if (fs.existsSync(lanFilePath)) {
            global.lan = JSON.parse(fs.readFileSync(lanFilePath, 'utf-8'))
        } else {
            logger.info("Initialise lan with default")
            global.lan = {
                name: "Nouvelle LAN",
                motd: "A modifier"
            }
        }
    },
    onStore: () => {
        fs.writeFileSync(lanFilePath, JSON.stringify(global.lan, null, 2), 'utf-8' )
    }
})

export function getLan() {
    return global.lan
}

export function updateLan(partialLan : Partial<Lan>) {
    global.lan = {...lan, ...partialLan}
}