// include crypto functions
import md4 from "js-md4"
import bcrypt from "bcryptjs"
import CryptoJS from "crypto-js"

// include react functions
import { useState } from "react"

// mysql 3.23 hash function (simple JS implementation)
function mysql323Hash(str) {
	let add = 7
	let nr = 1345345333
	let nr2 = 0x12345671

	for (let i = 0; i < str.length; i++) {
		const c = str.charCodeAt(i)
		if (c === 32 || c === 9) continue
		nr ^= (((nr & 63) + add) * c) + (nr << 8)
		nr2 += (nr2 << 8) ^ nr
		add += c
	}
	const toHex = (num) => ("00000000" + (num >>> 0).toString(16)).slice(-8)
	return toHex(nr) + toHex(nr2)
}

// ntlm hash = MD4(UTF-16LE(password))
function ntlmHash(password) {
	const encoder = new TextEncoder("utf-16le")
	const buf = encoder.encode(password)
	const arr = Array.from(buf)
	return md4(arr)
}

export default function HashGenerator() {
	const [hash, setHash] = useState("")
	const [input, setInput] = useState("")
	const [copied, setCopied] = useState(false)
	const [loading, setLoading] = useState(false)
	const [algorithm, setAlgorithm] = useState("MD5")

	// extra inputs
	const [salt, setSalt] = useState("")
	const [iterations, setIterations] = useState(1000)
	const [bcryptSaltRounds, setBcryptSaltRounds] = useState(10)

	// hash generator
	const generateHash = async () => {
		setLoading(true)
		let result = ""

		try {
			switch (algorithm) {
				case "MD4":
					result = md4(input)
					break
				case "MD5":
					result = CryptoJS.MD5(input).toString()
					break
				case "SHA-1":
					result = CryptoJS.SHA1(input).toString()
					break
				case "SHA-256":
					result = CryptoJS.SHA256(input).toString()
					break
				case "SHA-512":
					result = CryptoJS.SHA512(input).toString()
					break
				case "RIPEMD-160":
					result = CryptoJS.RIPEMD160(input).toString()
					break
				case "NTLM":
					result = ntlmHash(input)
					break
				case "MySQL323":
					result = mysql323Hash(input)
					break
				case "PBKDF2":
					result = CryptoJS.PBKDF2(input, CryptoJS.enc.Utf8.parse(salt), {
						keySize: 64 / 4,
						iterations,
						hasher: CryptoJS.algo.SHA512,
					}).toString(CryptoJS.enc.Hex)
					break
				case "bcrypt":
					result = await bcrypt.hash(input, bcryptSaltRounds)
					break
				default:
					result = "Unsupported algorithm"
			}
		} catch (err) {
			result = `Error: ${err.message}`
		}

		setHash(result)
		setCopied(false)
		setLoading(false)
	}

	// copy hash to clipboard
	const copyToClipboard = async () => {
		if (!hash) return
		await navigator.clipboard.writeText(hash)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}

	return (
		<div className="md:max-w-xl max-w-xl mx-auto p-6 md:mt-20 bg-[#0c1621] text-white md:rounded-md md:shadow-lg md:border border-gray-700 z-10 opacity-90">
			<h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">Hash Generator</h1>

			{/* input text */}
			<div className="mb-4">
				<label className="block mb-2 font-semibold text-sm">Input:</label>
				<textarea className="w-full p-2 bg-gray-800 text-white rounded-md resize-y" rows={3} value={input} onChange={(e) => setInput(e.target.value)}/>
			</div>

			{/* algorithm selection */}
			<div className="mb-4">
				<label className="block mb-2 font-semibold text-sm">Algorithm:</label>
				<select className="w-full p-2 bg-gray-800 text-white rounded-md" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
					{[
						"MD4",
						"MD5",
						"SHA-1",
						"SHA-256",
						"SHA-512",
						"NTLM",
						"PBKDF2",
						"bcrypt",
						"MySQL323",
						"RIPEMD-160"
					].map((algo) => (
						<option key={algo} value={algo}>
							{algo}
						</option>
					))}
				</select>
			</div>

			{/* extra inputs for PBKDF2 */}
			{(algorithm === "PBKDF2") && (
				<div className="mb-4 space-y-3">
					<div>
						<label className="block text-sm font-semibold mb-1">Salt:</label>
						<input type="text" value={salt} onChange={(e) => setSalt(e.target.value)} className="w-full p-2 bg-gray-800 text-white rounded-md"/>
					</div>
					<div>
						<label className="block text-sm font-semibold mb-1">Iterations:</label>
						<input type="number" min={1} value={iterations} onChange={(e) => setIterations(parseInt(e.target.value) || 1)} className="w-full p-2 bg-gray-800 text-white rounded-md"/>
					</div>
				</div>
			)}

			{/* extra inputs for bcrypt */}
			{algorithm === "bcrypt" && (
				<div className="mb-4 space-y-3">
					<label className="block text-sm font-semibold mb-1">Salt rounds:</label>
					<input type="number" min={1} max={20} value={bcryptSaltRounds} onChange={(e) => setBcryptSaltRounds(parseInt(e.target.value) || 10)} className="w-full p-2 bg-gray-800 text-white rounded-md"/>
				</div>
			)}

			{/* generate button */}
			<button onClick={generateHash} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-4 rounded-md mb-6 disabled:opacity-50">
				{loading ? "Generating..." : "Generate Hash"}
			</button>

			{/* hash output */}
			{hash && (
				<div className="relative">
					<div className="bg-gray-800 rounded-md p-3 mb-2 font-mono text-sm break-all">{hash}</div>
					<button onClick={copyToClipboard} className="absolute top-2 right-2 text-xs bg-blue-500 hover:bg-blue-600 transition px-2 py-1 rounded text-white">
						{copied ? "Copied!" : "Copy"}
					</button>
				</div>
			)}
		</div>
	)
}
