const fs = require("fs");
const path = require("path");

const FEED_PATH = path.join(process.cwd(), "cache", "homeFeed.json");

export function getHomeFeed() {
    try {
        if (!fs.existsSync(FEED_PATH)) return { exclusive: [], special: [] };
        const data = fs.readFileSync(FEED_PATH, "utf8");
        console.log(data);
        return JSON.parse(data);
    }
    catch (e) {
        console.log(e);
        return { exclusive: [], special: [] };
    }
};
