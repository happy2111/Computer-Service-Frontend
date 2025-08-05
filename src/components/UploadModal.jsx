import React, { useState } from "react";
import api from "../api/simpleApi.js";
import {Upload, X} from "lucide-react";

export default function UploadModal({ isOpen, onClose, data, refresh}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreview(selected.map(file => URL.createObjectURL(file)));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Select file first");

    const formData = new FormData();
    files.forEach(file => formData.append("deviceFiles", file));

    try {
      setLoading(true);
      const res = await api.patch(`/services/${data.deviceId}/images?userId=${data.userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      refresh();
      alert("File uploaded successfully");
      console.log(res.data);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
      setFiles([]);
      setPreview([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white z-20 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <button
            className="bg-red-400 duration-100 hover:bg-red-500 active:bg-red-500 text-white font-bold p-2 my-3 rounded"
            onClick={onClose}
            type="button"
          >
            <X className="w-5 h-5 " />
          </button>Rasm yoki Video yuklash</h2>
        <form className="space-y-4" onSubmit={(e) => handleUpload(e)}>
          <span className={"w-full flex gap-2 items-center bg-orange-500 text-white p-2 border rounded-lg"}>
            <Upload className="h-4 w-4"/>
            <input
              type="file"
              multiple
              name="deviceFiles"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </span>

          {preview.map((src, i) => {
            const isVideo = /\.(mp4|webm|mov)$/i.test(src);
            return isVideo ? (
              <video key={i} src={src} controls className="w-28 h-20 rounded" />
            ) : (
              <img key={i} src={src} alt="preview" className="w-20 h-20 object-cover rounded" />
            );
          })}
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white`}
          >
            {loading ? "Yuklanmoqda..." : "Yuklash"}
          </button>

        </form>
      </div>
      <div className="absolute inset-0 z-10 bg-neutral-700/70" onClick={onClose}></div>
    </div>
  );
}
