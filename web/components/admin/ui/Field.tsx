"use client";

import React, { useState } from "react";
import { AlertCircle, Plus, Minus, X } from "lucide-react";

export function InputField({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-[#3B2416]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full h-11 px-3.5 rounded-xl border bg-white text-base sm:text-sm text-[#1C1917] placeholder:text-[#6B5240]/40 focus:outline-none focus:ring-2 focus:ring-[#8D0D00] transition ${
          error ? "border-[#B42318] focus:ring-[#B42318]" : "border-[#3B2416]/25"
        }`}
        {...props}
      />
      {error ? (
        <p className="text-xs text-[#B42318] flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#6B5240]">{helperText}</p>
      ) : null}
    </div>
  );
}

export function TextareaField({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helperText?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-[#3B2416]"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full p-3 rounded-xl border bg-white text-base sm:text-sm text-[#1C1917] placeholder:text-[#6B5240]/40 focus:outline-none focus:ring-2 focus:ring-[#8D0D00] transition ${
          error ? "border-[#B42318] focus:ring-[#B42318]" : "border-[#3B2416]/25"
        }`}
        rows={props.rows || 3}
        {...props}
      />
      {error ? (
        <p className="text-xs text-[#B42318] flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#6B5240]">{helperText}</p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  error,
  helperText,
  id,
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  helperText?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-[#3B2416]"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full h-11 px-3.5 rounded-xl border bg-white text-base sm:text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#8D0D00] transition ${
          error ? "border-[#B42318]" : "border-[#3B2416]/25"
        }`}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p className="text-xs text-[#B42318] flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#6B5240]">{helperText}</p>
      ) : null}
    </div>
  );
}

export function SwitchField({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && <div className="text-sm font-semibold text-[#3B2416]">{label}</div>}
          {description && <div className="text-xs text-[#6B5240]">{description}</div>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8D0D00] ${
          checked ? "bg-[#2E7D32]" : "bg-[#6B5B50]/40"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function StepperField({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center border border-[#3B2416]/20 rounded-xl bg-white overflow-hidden shadow-xs">
      <button
        type="button"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-9 flex items-center justify-center text-[#3B2416] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:hover:bg-white transition"
        aria-label="Kurangi jumlah"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-10 text-center font-bold text-sm text-[#3B2416] select-none">
        {value}
      </span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-9 h-9 flex items-center justify-center text-[#3B2416] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:hover:bg-white transition"
        aria-label="Tambah jumlah"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function TagInputField({
  tags,
  onChange,
  label = "Alias / Singkatan Catatan",
  helperText,
}: {
  tags: string[];
  onChange: (newTags: string[]) => void;
  label?: string;
  helperText?: string;
}) {
  const [inputVal, setInputVal] = useState("");

  const handleAdd = () => {
    const trimmed = inputVal.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputVal("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#3B2416]">
          {label}
        </label>
      )}
      <div className="min-h-11 p-2 rounded-xl border border-[#3B2416]/25 bg-white flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-[#8D0D00]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-xs font-semibold text-[#8D0D00] border border-[#CBA857]/40"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="hover:text-[#6B0A00]"
              aria-label={`Hapus alias ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder={tags.length === 0 ? "Ketik alias lalu tekan Enter (mis. ma, mie biasa)" : "Tambah..."}
          className="flex-1 min-w-[120px] h-7 px-2 text-sm bg-transparent outline-none text-[#1C1917] placeholder:text-[#6B5240]/40"
        />
      </div>
      {helperText && <p className="text-xs text-[#6B5240]">{helperText}</p>}
    </div>
  );
}

