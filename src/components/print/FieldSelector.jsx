import {useState} from "react";
import {ArrowDownToLine, ChevronDown, ChevronUp} from "lucide-react"

const FieldSelector = ({toggleField, visibleFields, fields}) => {
  const [isOpen, setOpened] = useState(false);
  return (
    <div>
      <button
        className={"border flex gap-5 items-center border-gray-300 rounded p-2"}
        onClick={() => setOpened(!isOpen)}
      >
        <p>Field Selector</p>
        {isOpen ? <ChevronUp className={"h-5 w-5"} /> : <ChevronDown className={"h-5 w-5"}/> }

      </button>

      <div className={`${isOpen ? "" : "hidden"} flex flex-wrap gap-2 mt-2`}>
        {fields.map((f) => (
          <label
            key={f.key}
            className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={visibleFields[f.key]}
              onChange={() => toggleField(f.key)}
              className="rounded border-gray-300"
            />
            <span>{f.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FieldSelector;