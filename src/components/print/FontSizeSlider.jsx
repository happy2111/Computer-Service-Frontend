export default function FontSizeSlider({fontSize,setFontSize}) {
  return (
    <div className="flex flex-col items-center gap-1 w-full ">
      {/* Preview text */}
      <label
        className=" font-medium text-gray-600"
        htmlFor="width"
      >
        Matn o'lchamini sozlash
      </label>

      {/* Slider */}
      <div className="w-full flex items-center justify-between">
        <input
          type="range"
          min="12"
          max="48"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="
            w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500
          "
        />
        <div className="text-center mx-4 text-sm text-gray-600">
          {fontSize}px
        </div>
      </div>
    </div>
  );
}
