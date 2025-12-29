"use client"



const SocialButtons = ({ onClick }) => {
    return <div className="w-full flex flex-col md:flex-row justify-center items-center gap-10 mt-8 mb-4">
        <button type="button" onClick={() => onClick("google")} className="text-white w-[70%] md:w-[47%] font-semibold rounded-sm bg-[#EA4335] h-fit py-4 hover:bg-[#C5221F] transition duration-300 ease-in-out relative cursor-pointer">سجل باستخدام Google <img className="w-8 h-8 absolute left-2 top-[50%] translate-y-[-50%]" src="/assets/icons/google/google.png" /></button>
        <button type="button" onClick={() => onClick("github")} className="text-white w-[70%] md:w-[47%] font-semibold rounded-sm bg-gray-700 h-fit py-4 hover:bg-gray-900 transition duration-300 ease-in-out relative cursor-pointer">سجل باستخدام GitHub <img className="w-8 h-8 absolute left-2 top-[50%] translate-y-[-50%]    " src="/assets/icons/github/github.png" /></button>
    </div>
}
export default SocialButtons;