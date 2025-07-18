import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RefreshCw } from "lucide-react";
import styles from "./UploadSection.module.css"; // ✅ Import styles

/**
 * @typedef {Object} UploadSectionProps
 * @property {(file: File, options: { textToEmbed: string, bits: string }, action: string) => void} onUploadAndEmbed
 * @property {boolean} isLoading
 * @property {string} error
 */

/**
 * @param {UploadSectionProps} props
 */
function UploadSection({ onUploadAndEmbed, isLoading, error }) {
  const [file, setFile] = useState(null);
  const [textToEmbed, setTextToEmbed] = useState("");
  const [bits, setBits] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [action, setAction] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setSubmitted(false);
      setTextToEmbed(""); // clear previous extracted/embedded data
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type.startsWith("image/")) {
      setFile(droppedFile);
      setSubmitted(false);
      setTextToEmbed("");
    }
  };

  const handleBoxClick = () => {
    if (user && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    const bitsInt = parseInt(bits, 10);
    if (
      !file ||
      (action === "embed" && (!textToEmbed || !bitsInt || bitsInt <= 0))
    )
      return;

    if (action === "embed" && textToEmbed.length > bitsInt) {
      alert(
        `Watermark length (${textToEmbed.length}) exceeds number of bits (${bitsInt}).`
      );
      return;
    }

    try {
      setLocalLoading(true);
      setSubmitted(false);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("watermark_length", bitsInt.toString());

      if (action === "embed") {
        const bitArray = textToEmbed.split("").map((b) => parseInt(b, 10));
        formData.append("watermark_bits", JSON.stringify(bitArray));
        formData.append("wavelet_type", "haar");

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/embed`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to embed watermark");
        }

        const blob = await response.blob();
        const watermarkedFile = new File([blob], "watermarked.png", {
          type: blob.type,
        });

        setTimeout(() => {
          setFile(watermarkedFile);
          setSubmitted(true);
          setLocalLoading(false);
        }, 1000);
      }

      if (action === "extract") {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/extract`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to extract watermark");
        }

        const data = await response.json();
        // console.log(data);

        setTimeout(() => {
          setTextToEmbed(data.decoded_watermark || "");
          setSubmitted(true);
          setLocalLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Watermark Error:", error);
      alert("Error: " + error.message);
      setLocalLoading(false);
    }
  };

  const handleSaveImage = () => {
    if (!file) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "watermarked_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateRandomBits = () => {
    const bitsInt = parseInt(bits, 10);
    if (!bitsInt || bitsInt <= 0) return;
    const randomBits = Array.from({ length: bitsInt }, () =>
      Math.round(Math.random())
    ).join("");
    setTextToEmbed(randomBits);
  };

  return (
    <div className="relative isolate px-6 pt-24 lg:px-8 text-center min-h-[80vh] flex flex-col items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800 uppercase">
        Upload Image for Watermarking
      </h2>

      <div
        className={`w-[54rem] h-[36rem] relative border-4 border-dashed rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-center ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:bg-gray-50"
        } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={user ? handleDragOver : undefined}
        onDragLeave={user ? handleDragLeave : undefined}
        onDrop={user ? handleDrop : undefined}
        onClick={handleBoxClick}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={inputRef}
          className="hidden"
          disabled={!user}
        />
        {file ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="max-w-[60%] max-h-[60%] opacity-50 blur-sm rounded-lg"
          />
        ) : (
          <p className="text-gray-500 text-center">
            {user
              ? "📁 Drag & Drop your image here OR Click to browse"
              : "🔒 Please login to upload images"}
          </p>
        )}
      </div>

      {user && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setAction("embed")}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow ${
              action === "embed" ? "ring-2 ring-blue-400" : ""
            }`}
          >
            Add Watermark
          </button>
          <button
            onClick={() => setAction("extract")}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow ${
              action === "extract" ? "ring-2 ring-blue-400" : ""
            }`}
          >
            Extract Watermark
          </button>
        </div>
      )}

      {action === "embed" && (
        <>
          <input
            type="number"
            min="1"
            placeholder="Enter number of bits"
            value={bits}
            onChange={(e) => setBits(e.target.value)}
            disabled={!user}
            className="mt-6 w-96 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          />
          <div className="mt-4 w-96 relative">
            <input
              type="text"
              placeholder="Enter bits or generate random"
              value={textToEmbed}
              onChange={(e) => setTextToEmbed(e.target.value)}
              disabled={!user}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            />
            <button
              onClick={generateRandomBits}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-black"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </>
      )}

      {action && user && (
        <button
          onClick={handleSubmit}
          disabled={
            localLoading ||
            !file ||
            (action === "embed" &&
              (!textToEmbed || !bits || parseInt(bits, 10) <= 0))
          }
          className={`mt-4 w-[24rem] flex items-center justify-center gap-2 ${
            localLoading
              ? "bg-gray-500 cursor-not-allowed"
              : file && (action === "extract" || (textToEmbed && bits))
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold px-6 py-3 rounded-lg shadow disabled:opacity-50`}
        >
          {localLoading ? (
            <>
              <span className={styles.spinner}></span>
              Processing...
            </>
          ) : (
            "Submit"
          )}
        </button>
      )}

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {submitted && !localLoading && !error && (
        <div
          className={`mt-8 p-6 border rounded-lg shadow w-[800px] bg-white ring-4 ring-blue-300 flex flex-col items-center ${styles.fadeIn}`}
        >
          <h3 className="text-2xl font-semibold mb-4">Result</h3>
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Processed"
              className="mb-4 max-h-60"
            />
          )}
          {action === "embed" ? (
            <p className="text-green-600 font-bold mb-4">Watermark Added</p>
          ) : (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50 w-full text-center">
              <p className="font-medium">Bits Extracted:</p>
              <p className="break-all">
                {textToEmbed || "No watermark data found."}
              </p>
            </div>
          )}
          <button
            onClick={handleSaveImage}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
          >
            Save Image
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadSection;
