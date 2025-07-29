// include react functions
import { useState } from "react"

export default function PasswordGenerator() {
    const [length, setLength] = useState(25)
    const [copied, setCopied] = useState(false)
    const [password, setPassword] = useState("")
    const [includeNumbers, setIncludeNumbers] = useState(true)
    const [includeSymbols, setIncludeSymbols] = useState(false)
    const [includeUppercase, setIncludeUppercase] = useState(true)
    const [includeLowercase, setIncludeLowercase] = useState(true)

    const generatePassword = () => {
        let charset = ""
        const numbers = "0123456789"
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const lower = "abcdefghijklmnopqrstuvwxyz"
        const symbols = "!@#$%^&*()_+[]{}|;:,.<>?"

        // add enabled charsets to charset
        if (includeUppercase) charset += upper
        if (includeLowercase) charset += lower
        if (includeNumbers) charset += numbers
        if (includeSymbols) charset += symbols

        // check if at least one option is enabled
        if (!charset) return setPassword("Select at least one option!")

        // generate random string
        let generated = ""
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length)
            generated += charset[randomIndex]
        }

        // set generated password
        setPassword(generated)
        setCopied(false)
    }

    // copy generated password to clipboard
    const copyToClipboard = async () => {
        if (!password || password.startsWith("Select")) return
        await navigator.clipboard.writeText(password)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className="md:max-w-xl max-w-xl mx-auto p-6 md:mt-20 bg-[#0c1621] text-white md:rounded-md md:shadow-lg md:border border-gray-700 z-10 opacity-90">
            <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">Password Generator</h1>

            {/* length slider */}
            <div className="mb-6">
                <label className="block mb-2 font-semibold text-sm">Length: {length}</label>
                <input type="range" min="2" max="50" value={length} className="w-full accent-blue-500" onChange={(e) => setLength(parseInt(e.target.value))}/>
            </div>

            {/* options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} className="accent-blue-500"/>Uppercase (A–Z)
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={includeLowercase} onChange={() => setIncludeLowercase(!includeLowercase)} className="accent-blue-500" />Lowercase (a–z)
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="accent-blue-500"/>Numbers (0–9)
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="accent-blue-500"/>Symbols (!@#$...)
                </label>
            </div>

            {/* generate button */}
            <button onClick={generatePassword} className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-md mb-6">
                Generate Password
            </button>

            {/* password output */}
            {password && (
                <div className="relative">
                    {/* password ou */}
                    <div className="bg-gray-800 rounded-md p-3 mb-2 font-mono text-sm break-all">{password}</div>
                    {/* copy button */}
                    <button onClick={copyToClipboard} className="absolute top-2 right-2 text-xs bg-blue-500 hover:bg-blue-600 transition px-2 py-1 rounded text-white">
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            )}
        </div>
    )
}
