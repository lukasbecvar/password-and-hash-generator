import { useState } from "react"

export default function Base64Tool() {
    const [mode, setMode] = useState("text")
    const [action, setAction] = useState("encode")
    const [textInput, setTextInput] = useState("")
    const [textResult, setTextResult] = useState("")
    const [imageBase64, setImageBase64] = useState("")
    const [imageDecodedBase64, setImageDecodedBase64] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [textProcessed, setTextProcessed] = useState(false)
    const [imageProcessed, setImageProcessed] = useState(false)
    const [imageDecodeError, setImageDecodeError] = useState(false)

    // handle text encode
    const handleEncodeText = () => {
        try {
            setTextResult(btoa(textInput))
        } catch {
            setTextResult("Invalid input")
        }
        setTextProcessed(true)
    }

    // handle text decode
    const handleDecodeText = () => {
        try {
            setTextResult(atob(textInput))
        } catch {
            setTextResult("Invalid base64")
        }
        setTextProcessed(true)
    }

    // image handlers
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImageBase64(reader.result)
                setImageProcessed(true)
            }
            reader.readAsDataURL(file)
        }
    }

    // handle decode image
    const handleDecodeImage = () => {
        try {
            if (imageDecodedBase64.startsWith("data:image")) {
                setImageDecodeError(false)
                setImageProcessed(true)
            } else {
                throw new Error("Not valid image base64")
            }
        } catch {
            setImageDecodeError(true)
            setImageProcessed(false)
        }
    }

    // handle image preview modal open
    const openModal = () => {
        setIsModalOpen(true)
    }

    // handle image preview modal close
    const closeModal = () => {
        setIsModalOpen(false)
    }

    return (
        <div className="max-w-4xl mx-auto p-0 md:mt-10 mb-5 bg-[#0c1621] text-white md:rounded-lg md:shadow-xl md:border border-gray-700 opacity-95">
            {/* mode switch: text / image */}  
            <div className="flex w-full overflow-hidden border border-gray-600">
                {["text", "image"].map((m) => (
                    <button
                        key={m}
                        onClick={() => {
                            setMode(m)
                            setAction("encode")
                            setTextInput("")
                            setTextResult("")
                            setImageBase64("")
                            setImageDecodedBase64("")
                            setImageDecodeError(false)
                            setTextProcessed(false)
                            setImageProcessed(false)
                        }}
                        className={`w-1/2 text-center font-semibold transition-colors duration-200 ${mode === m 
                            ? "bg-blue-600 text-white" 
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        style={{ padding: "12px 0" }}
                    >
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                ))}
            </div>

            {/* action switch: encode / decode */}  
            <div className="flex w-full overflow-hidden border border-gray-600">
                {["encode", "decode"].map((a) => (
                    <button
                        key={a}
                        onClick={() => {
                            setAction(a)
                            setTextInput("")
                            setTextResult("")
                            setImageDecodedBase64("")
                            setImageDecodeError(false)
                            setTextProcessed(false)
                            setImageProcessed(false)
                        }}
                        className={`w-1/2 text-center font-semibold transition-colors duration-200 ${action === a
                                ? "bg-green-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }`}
                        style={{ padding: "12px 0" }}
                    >
                        {a.charAt(0).toUpperCase() + a.slice(1)}
                    </button>
                ))}
            </div>

            {/* content */}
            <div className="p-4">
                {/* text encode */}
                {mode === "text" && action === "encode" && (
                    <div className="space-y-4">
                        <label className="block font-semibold">Enter text to encode:</label>
                        <textarea className="w-full h-24 p-3 bg-gray-800 text-white rounded border border-gray-600" placeholder="Enter text" value={textInput} onChange={(e) => setTextInput(e.target.value)}/>
                        <button className="w-full md:w-32 bg-green-600 hover:bg-green-700 text-white py-2 rounded" onClick={handleEncodeText}>Encode</button>
                        {textProcessed && (
                            <span>
                                <label className="block font-semibold mt-4">Encoded Base64:</label>
                                <textarea className="w-full h-24 p-3 bg-gray-800 text-white rounded border border-gray-600" readOnly value={textResult}/>
                            </span>
                        )}
                    </div>
                )}

                {/* text decode */}
                {mode === "text" && action === "decode" && (
                    <div className="space-y-4">
                        <label className="block font-semibold">Paste Base64 to decode:</label>
                        <textarea className="w-full h-24 p-3 bg-gray-800 text-white rounded border border-gray-600" placeholder="Paste Base64" value={textInput} onChange={(e) => setTextInput(e.target.value)}/>
                        <button className="w-full md:w-32 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded" onClick={handleDecodeText}>Decode</button>
                        {textProcessed && (
                            <span>
                                <label className="block font-semibold mt-4">Decoded text:</label>
                                <textarea className="w-full h-24 p-3 bg-gray-800 text-white rounded border border-gray-600" readOnly value={textResult}/>
                            </span>
                        )}
                    </div>
                )}

                {/* image encode */}
                {mode === "image" && action === "encode" && (
                    <div className="space-y-4">
                        <label className="block font-semibold">Upload Image to encode:</label>
                        <input type="file" accept="image/*" className="text-white" onChange={handleImageUpload}/>
                        {imageProcessed && imageBase64 && (
                            <span>
                                <label className="block font-semibold mt-4">Encoded Base64:</label>
                                <textarea className="w-full h-40 p-3 bg-gray-800 text-white rounded border border-gray-600" readOnly value={imageBase64}/>
                            </span>
                        )}
                    </div>
                )}

                {/* image decode */}
                {mode === "image" && action === "decode" && (
                    <div className="space-y-4">
                        <label className="block font-semibold">Paste Image Base64 to decode:</label>
                        <textarea
                            className="w-full h-40 p-3 bg-gray-800 text-white rounded border border-gray-600"
                            placeholder="Paste image Base64"
                            value={imageDecodedBase64}
                            onChange={(e) => {
                                setImageDecodedBase64(e.target.value)
                                setImageDecodeError(false)
                            }}
                        />
                        <button className="w-full md:w-48 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded" onClick={handleDecodeImage}>Decode & Preview</button>
                        {imageProcessed && imageDecodedBase64 && !imageDecodeError && (
                            <div className="text-center mt-4">
                                <img
                                    src={imageDecodedBase64}
                                    alt="decoded"
                                    className="max-w-full h-auto mx-auto cursor-pointer rounded shadow"
                                    onClick={openModal}
                                />
                            </div>
                        )}
                        {imageDecodeError && (
                            <p className="text-red-500 mt-4">Invalid image Base64</p>
                        )}
                    </div>
                )}
            </div>

            {/* modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50" onClick={closeModal}>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-2 right-2 text-white bg-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-gray-700" aria-label="Close modal">×</button>
                        <img src={imageDecodedBase64} alt="decoded large" className="max-w-screen max-h-screen rounded shadow-lg"/>
                    </div>
                </div>
            )}
        </div>
    )
}
