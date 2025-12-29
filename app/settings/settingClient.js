// "use client"
// import { Logout } from "@/serverrequests/logout";
// import { useState } from "react";



// const SettingsClient = () => {
//     const [clicked, setClicked] = useState(false);
//     const logouthandler = async () => {

//         const res = await Logout();
//         if (res.ok) {
//             console.log("تم تسجيل الخروج");
//         }
//         else {
//             console.log("HUGE FAILURE!!");
//         }
//     }
//     return <div>
//         <div>
//             <button onClick={() => {
//                 logouthandler();
//                 setClicked(true);
//             }}
//                 disabled={clicked}
//                 className={`px-20 py-10 rounded-2xl text-white  text-center mx-auto block mt-60 text-5xl transition duration-300 ease-in-out ${clicked ? 'bg-gray-700 cursor-not-allowed duration-100' : 'bg-sky-800 cursor-pointer hover:bg-blue-500'}`}>تسجيل الخروج</button>
//         </div>
//     </div>
// }
// export default SettingsClient;