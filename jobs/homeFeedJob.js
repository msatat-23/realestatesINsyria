import { getPropertiesByPlan } from "@/data/property/home-feed-properties";
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const FEED_PATH = path.join(process.cwd(), "cache", "homeFeed.json");

export const updateHomeFeed = async () => {
    console.log("Updating home feed...");
    try {
        const exclusive = await getPropertiesByPlan("EXCLUSIVE");
        const special = await getPropertiesByPlan("PREMIUM");

        const feed = {
            exclusive,
            special,
            updatedAt: new Date().toISOString(),
        };
        console.log(feed);
        fs.mkdirSync(path.dirname(FEED_PATH), { recursive: true });
        fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));

        console.log("تم تحديث عقارات الصفحة الرئيسية", new Date().toLocaleString());
    } catch (err) {
        console.error("خطأ في تحديث العقارات", err);

    }
};
export function startHomeFeedScheduler() {
    // updateHomeFeed();
    cron.schedule("0 */2 * * *", updateHomeFeed);
}