let config;

try {
    config = require("../config.json");
} catch (error) {
    config = null;
}

// export const MONGO_DB_SRV = config.MONGO_DB_SRV;
// export const GIPHY_API_KEY = config.GIPHY_API_KEY
// export const TENOR_API_KEY = config.TENOR_API_KEY
// export const PREFIX = config.PREFIX;
// export const YOUTUBE_API_KEY = config.YOUTUBE_API_KEY;
// export const MONGOOSEKEY = config.MONGOOSEKEY;
// export const BS_API_KEY = config.BS_API_KEY;
// export const SOUNDCLOUD_CLIENT_ID = config.SOUNDCLOUD_CLIENT_ID;
// export const TWITCH_TOKEN = config.TWITCH_TOKEN;
// export const TWITCH_CLIENT_ID = config.TWITCH_CLIENT_ID;
// export const DEFAULT_VOLUME = config.DEFAULT_VOLUME;
// export const LECHSBOTTKEY = config.LECHSBOTTKEY;
export const OWNERS = config.OWNERS;