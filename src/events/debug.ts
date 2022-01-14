import { Event } from "../structures/Event";

export default new Event("debug", async (x) => {
    return console.log(x)
})