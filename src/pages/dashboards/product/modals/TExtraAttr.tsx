import React, { useState } from 'react';

type TExtraAttr = {
  key: string;
  value: string;
  description: string;
};

interface Props {
  initial?: TExtraAttr[];
  onChange?: (attrs: TExtraAttr[]) => void;
}

export const ExtraAttrEditor: React.FC<Props> = ({ initial = [], onChange }) => {
  const [attrs, setAttrs] = useState<TExtraAttr[]>(initial);

  const handleChange = (index: number, field: keyof TExtraAttr, value: string) => {
    const updated = [...attrs];
    updated[index][field] = value;
    setAttrs(updated);
    onChange?.(updated);
  };

  const addAttr = () => {
    const updated = [...attrs, { key: '', value: '', description: '' }];
    setAttrs(updated);
    onChange?.(updated);
  };

  const removeAttr = (index: number) => {
    const updated = attrs.filter((_, i) => i !== index);
    setAttrs(updated);
    onChange?.(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {attrs.map((attr, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Key"
            value={attr.key}
            onChange={(e) => handleChange(i, 'key', e.target.value)}
            className="border px-2 py-1 rounded w-1/4"
          />
          <input
            type="text"
            placeholder="Value"
            value={attr.value}
            onChange={(e) => handleChange(i, 'value', e.target.value)}
            className="border px-2 py-1 rounded w-1/4"
          />
          <input
            type="text"
            placeholder="Description"
            value={attr.description}
            onChange={(e) => handleChange(i, 'description', e.target.value)}
            className="border px-2 py-1 rounded w-1/3"
          />
          <button
            type="button"
            onClick={() => removeAttr(i)}
            className="text-red-500 hover:underline"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addAttr}
        className="self-start bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        + Añadir atributo
      </button>
    </div>
  );
};
