// include react functions
import { useState } from "react"

export default function Base64Tool() {
    const [mode, setMode] = useState("text")
    const [action, setAction] = useState("encode")
    const [textInput, setTextInput] = useState("")
    const [textResult, setTextResult] = useState("")
    const [imageBase64, setImageBase64] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [textProcessed, setTextProcessed] = useState(false)
    const [imageProcessed, setImageProcessed] = useState(false)
    const [imageDecodeError, setImageDecodeError] = useState(false)
    const [imageDecodedBase64, setImageDecodedBase64] = useState("")

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

    // handle image upload
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

    // handle image decode
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

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    const Selector = ({ options, selected, onChange }) => (
        <div className="flex rounded-md overflow-hidden border border-gray-700">
            {options.map((opt) => (
                <button key={opt} className={`w-1/2 py-2 font-semibold transition-colors duration-200 ${selected === opt ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`} onClick={() => onChange(opt)}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
            ))}
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto md:mt-10 md:mb-10 p-6 bg-[#0c1621] text-white md:rounded-xl md:shadow-xl md:border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {/* select format */}
                <Selector options={["text", "image"]} selected={mode} onChange={(m) => {
                    setMode(m)
                    setAction("encode")
                    setTextInput("")
                    setTextResult("")
                    setImageBase64("")
                    setImageDecodedBase64("")
                    setImageDecodeError(false)
                    setTextProcessed(false)
                    setImageProcessed(false)
                }} />

                {/* select action */}
                <Selector options={["encode", "decode"]} selected={action} onChange={(a) => {
                    setAction(a)
                    setTextInput("")
                    setTextResult("")
                    setImageDecodedBase64("")
                    setImageDecodeError(false)
                    setTextProcessed(false)
                    setImageProcessed(false)
                }}/>
            </div>

            <div className="mt-6">
                {mode === "text" && (
                    <div className="space-y-4">
                        <label className="font-semibold">
                            {action === "encode" ? "Enter text to encode:" : "Paste Base64 to decode:"}
                        </label>
                        <textarea className="w-full h-24 p-3 bg-gray-800 text-white rounded border border-gray-600" placeholder={action === "encode" ? "Enter text" : "Paste Base64"} value={textInput} onChange={(e) => setTextInput(e.target.value)}/>
                        <button className={`w-full md:w-32 py-2 rounded ${action === "encode" ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}`} onClick={action === "encode" ? handleEncodeText : handleDecodeText}>
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                        </button>

                        {textProcessed && (
                            <div>
                                <label className="block font-semibold mt-4">
                                    {action === "encode" ? "Encoded Base64:" : "Decoded text:"}
                                </label>
                                <textarea className="w-full h-24 p-3 bg-gray-800 text-white rounded border border-gray-600" readOnly value={textResult}/>
                            </div>
                        )}
                    </div>
                )}

                {mode === "image" && action === "encode" && (
                    <div className="space-y-4">
                        <label className="font-semibold">Upload Image to encode:</label>
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded cursor-pointer p-6 bg-gray-900 hover:border-blue-500 transition-colors text-gray-300 hover:text-blue-400">
                            <span className="mb-2 select-none">Click or drag & drop to upload image</span>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    if (e.dataTransfer.files.length > 0) {
                                        const file = e.dataTransfer.files[0]
                                        const fakeEvent = { target: { files: [file] } }
                                        handleImageUpload(fakeEvent)
                                    }
                                }}
                            />
                        </label>

                        {imageProcessed && imageBase64 && (
                            <div>
                                <label className="block font-semibold mt-4 mb-2">Preview & Encoded Base64:</label>
                                <img src={imageBase64} alt="Uploaded preview" className="max-h-48 w-auto rounded mb-3 shadow-md mx-auto"/>
                                <textarea className="w-full h-40 p-3 bg-gray-800 text-white rounded border border-gray-600 font-mono text-xs overflow-auto" readOnly value={imageBase64}/>
                            </div>
                        )}
                    </div>
                )}

                {mode === "image" && action === "decode" && (
                    <div className="space-y-4">
                        <label className="font-semibold">Paste Image Base64 to decode:</label>
                        <textarea
                            className="w-full h-40 p-3 bg-gray-800 text-white rounded border border-gray-600"
                            placeholder="Paste image Base64"
                            value={imageDecodedBase64}
                            onChange={(e) => {
                                setImageDecodedBase64(e.target.value)
                                setImageDecodeError(false)
                            }}
                        />
                        <button className="w-full md:w-48 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded" onClick={handleDecodeImage}>
                            Decode & Preview
                        </button>
                        {imageProcessed && imageDecodedBase64 && !imageDecodeError && (
                            <div className="text-center mt-4">
                                <img src={imageDecodedBase64} alt="decoded" className="max-w-full h-auto mx-auto cursor-pointer rounded shadow" onClick={openModal}/>
                            </div>
                        )}
                        {imageDecodeError && <p className="text-red-500 mt-4">Invalid image Base64</p>}
                    </div>
                )}
            </div>

            {/* image preview modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50" onClick={closeModal}>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeModal} className="absolute top-2 right-2 text-white bg-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-gray-700" aria-label="Close modal">
                            ×
                        </button>
                        <img src={imageDecodedBase64} alt="decoded large" className="max-w-screen max-h-screen rounded shadow-lg"/>
                    </div>
                </div>
            )}
        </div>
    )
}
