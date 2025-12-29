// ProgressBar.js
import React from "react";

export default function ProgressBar({ step }) {
    const steps = [
        { id: 1, label: "البيانات الأساسية" },
        { id: 2, label: "الصور" },
        { id: 3, label: "الفيديو" },
        { id: 4, label: "المرفقات" },
    ];

    return (
        <div className="relative flex flex-col items-center w-full my-6">
            <div className="absolute bottom-[-8px] left-0 w-full h-1 bg-gray-300 rounded-full transform -translate-y-1/2"></div>

            <div className="relative flex justify-between w-full">
                {steps.map((s, index) => {
                    const isActive = step === s.id;
                    const isCompleted = step > s.id;

                    return (
        <div
                            key={s.id}
                            className="flex flex-col items-center w-1/4 text-center"
                        >
                            <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 
                ${isActive
                                        ? "border-blue-600 bg-blue-600 text-white scale-110"
                                        : isCompleted
                                            ? "border-blue-600 bg-blue-600 text-white"
                                            : "border-gray-400 bg-white text-gray-400"
                                    }`}
                            >
                                {s.id}
                            </div>

                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute bottom-[-8px] left-[calc(25%*${index + 1
                                        })] w-1/4 h-1 -translate-y-1/2 
                  ${step > s.id ? "bg-blue-600" : "bg-gray-300"
                                        } transition-all duration-500`}
                                ></div>
                            )}

                            {/* العنوان تحت الدائرة */}
                            <span
                                className={`mt-2 text-sm ${isActive || isCompleted
                                    ? "text-blue-600 font-medium"
                                    : "text-gray-500"
                                    }`}
                            >
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
