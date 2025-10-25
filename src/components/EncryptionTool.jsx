// include react functions
import { useState } from "react"

// include crypto functions
import CryptoJS from "crypto-js"

export default function EncryptionTool() {
	const [iv, setIv] = useState("")
    const [key, setKey] = useState("")
	const [error, setError] = useState("")
	const [input, setInput] = useState("")
	const [mode, setMode] = useState("CBC")
	const [output, setOutput] = useState("")
	const [copied, setCopied] = useState(false)
	const [bitLength, setBitLength] = useState(256)
	const [action, setAction] = useState("encrypt")
	const [padding, setPadding] = useState("Pkcs7")

	const requiredIVLength = 16
	const requiredKeyLength = bitLength / 8

    // handle encrypt / decrypt
	const encryptOrDecrypt = () => {
		setError("")
		setOutput("")

		// validate input
		if (!key) return setError("Encryption key is required.")
		if (key.length !== requiredKeyLength) {
			return setError(`Key must be exactly ${requiredKeyLength} characters long for ${bitLength}-bit AES.`)
		}
		if (!input) return setError("Input is required.")

		if (mode !== "ECB") {
			if (!iv) return setError("IV is required for selected mode.")
			if (iv.length !== requiredIVLength) {
				return setError(`IV must be exactly ${requiredIVLength} characters long.`)
			}
		}

		try {
			const keyBytes = CryptoJS.enc.Utf8.parse(key)
			const ivBytes = CryptoJS.enc.Utf8.parse(iv)
			const modeObj = CryptoJS.mode[mode]
			const paddingObj = CryptoJS.pad[padding]

			let result = ""

			if (action === "encrypt") {
				const encrypted = CryptoJS.AES.encrypt(input, keyBytes, {
					iv: ivBytes,
					mode: modeObj,
					padding: paddingObj,
					keySize: bitLength / 32
				})
				result = encrypted.toString()
			} else {
				const decrypted = CryptoJS.AES.decrypt(
					input,
					keyBytes,
					{
						iv: ivBytes,
						mode: modeObj,
						padding: paddingObj,
						keySize: bitLength / 32
					}
				)
				result = decrypted.toString(CryptoJS.enc.Utf8)
				if (!result) throw new Error("Decryption failed. Possibly wrong key, IV, mode or padding.")
			}
			setOutput(result)
		} catch (err) {
			setError("Error: " + err.message)
		}
	}

	const copyToClipboard = async () => {
		if (!output) return
		await navigator.clipboard.writeText(output)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	return (
		<div className="md:max-w-xl max-w-xl mx-auto p-6 md:mt-10 md:mb-10 bg-[#0c1621] text-white md:rounded-md md:shadow-lg md:border border-gray-700 z-10 opacity-90">
			<h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">AES Encryption Tool</h1>
            
			{/* action toggle */}
			<div className="mb-4 flex justify-center gap-4">
				<button onClick={() => setAction("encrypt")} className={`px-4 py-2 rounded ${action === "encrypt" ? "bg-blue-600" : "bg-gray-700"}`}>Encrypt</button>
				<button onClick={() => setAction("decrypt")} className={`px-4 py-2 rounded ${action === "decrypt" ? "bg-blue-600" : "bg-gray-700"}`}>Decrypt</button>
			</div>

			{/* input */}
			<div className="mb-4">
				<label htmlFor="input-textarea" className="block text-sm font-semibold mb-1">Input:</label>
				<textarea id="input-textarea" className="w-full p-2 bg-gray-800 text-white rounded-md resize-y" rows={5} value={input} onChange={(e) => setInput(e.target.value)} />
			</div>

			{/* key */}
			<div className="mb-4">
				<label htmlFor="key-input" className="block text-sm font-semibold mb-1">Key (exactly {requiredKeyLength} chars):</label>
				<input id="key-input" className="w-full p-2 bg-gray-800 text-white rounded-md" value={key} onChange={(e) => setKey(e.target.value)} />
			</div>

			{/* IV */}
			{mode !== "ECB" && (
				<div className="mb-4">
					<label htmlFor="iv-input" className="block text-sm font-semibold mb-1">IV (exactly {requiredIVLength} chars):</label>
					<input id="iv-input" className="w-full p-2 bg-gray-800 text-white rounded-md" value={iv} onChange={(e) => setIv(e.target.value)} />
				</div>
			)}

			{/* bit length, mode and padding */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div>
					<label htmlFor="bit-length-select" className="block text-sm font-semibold mb-1">Bit length:</label>
					<select id="bit-length-select" className="w-full p-2 bg-gray-800 text-white rounded-md" value={bitLength} onChange={(e) => setBitLength(parseInt(e.target.value))}>
						<option value={128}>128</option>
						<option value={192}>192</option>
						<option value={256}>256</option>
					</select>
				</div>
				<div>
					<label htmlFor="mode-select" className="block text-sm font-semibold mb-1">Mode:</label>
					<select id="mode-select" className="w-full p-2 bg-gray-800 text-white rounded-md" value={mode} onChange={(e) => setMode(e.target.value)}>
						{["CBC", "CFB", "OFB", "CTR", "ECB"].map((m) => (
							<option key={m} value={m}>{m}</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="padding-select" className="block text-sm font-semibold mb-1">Padding:</label>
					<select id="padding-select" className="w-full p-2 bg-gray-800 text-white rounded-md" value={padding} onChange={(e) => setPadding(e.target.value)}>
						{["Pkcs7", "AnsiX923", "Iso10126", "ZeroPadding", "NoPadding"].map((p) => (
							<option key={p} value={p}>{p}</option>
						))}
					</select>
				</div>
			</div>

			{/* button */}
			<button onClick={encryptOrDecrypt} className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-md mb-6">
				{action === "encrypt" ? "Encrypt" : "Decrypt"}
			</button>

			{/* error message */}
			{error && <div className="text-red-500 text-sm mb-4">{error}</div>}

			{/* output */}
			{output && (
				<div className="relative">
					<div className="bg-gray-800 rounded-md p-3 mb-2 font-mono text-sm break-all">{output}</div>
					<button onClick={copyToClipboard} className="absolute top-2 right-2 text-xs bg-blue-500 hover:bg-blue-600 transition px-2 py-1 rounded text-white">
						{copied ? "Copied!" : "Copy"}
					</button>
				</div>
			)}
		</div>
	)
}
