import { auth } from "@/auth";
import SettingsClient from "./settingClient";

const Settings = async () => {
    const session = await auth();


    return <div>
        {JSON.stringify(session)}
        <SettingsClient />
    </div>
}
export default Settings;