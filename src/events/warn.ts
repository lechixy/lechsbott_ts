import { Event } from "../structures/Event";

export default new Event("warn", async (x) => {
    return console.log(x)
})