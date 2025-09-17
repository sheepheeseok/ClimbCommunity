import React from "react";

export const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (v: boolean) => void }> = ({
                                                                                                 enabled,
                                                                                                 onChange,
                                                                                             }) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? "bg-blue-600" : "bg-gray-200"
        }`}
    >
    <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
        }`}
    />
    </button>
);
