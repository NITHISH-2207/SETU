import { useState } from 'react'

function TagInput({
  label,
  placeholder = 'Type and press Enter to add...',
  tags = [],
  onChange,
  suggestions = [],
  required = false,
}) {
  const [inputVal, setInputVal] = useState('')

  const handleAddTag = (tagToAdd) => {
    const trimmed = (tagToAdd || inputVal).trim()
    if (!trimmed) return
    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInputVal('')
  }

  const handleRemoveTag = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag(inputVal)
    } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="space-y-2 font-outfit">
      {label && (
        <label className="block text-xs font-semibold tracking-wider text-[#1F2A28] uppercase">
          {label} {required && <span className="text-[#E07A4E]">*</span>}
        </label>
      )}

      {/* Tag Container Input */}
      <div className="p-2 sm:p-2.5 bg-white border border-[#BFD9D2] rounded-xl focus-within:border-[#176B5B] focus-within:ring-2 focus-within:ring-[#176B5B]/20 transition-all flex flex-wrap items-center gap-1.5 min-h-[46px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#DCEFEA] text-[#176B5B] border border-[#BFD9D2]/70 animate-fade-in"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-[#E07A4E] transition-colors cursor-pointer text-xs p-0.5 leading-none"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-[#1F2A28] placeholder-[#5C726E]/60 focus:outline-hidden py-1 px-1"
        />

        {inputVal.trim() && (
          <button
            type="button"
            onClick={() => handleAddTag(inputVal)}
            className="px-2 py-0.5 text-xs font-bold bg-[#176B5B] text-white rounded-md cursor-pointer hover:bg-[#125649] transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {/* Suggested Quick Add Tags */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-[#5C726E] font-medium mr-1">Suggested:</span>
          {suggestions.slice(0, 6).map((sugg) => {
            const isSelected = tags.includes(sugg)
            return (
              <button
                key={sugg}
                type="button"
                onClick={() => (isSelected ? handleRemoveTag(sugg) : handleAddTag(sugg))}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#176B5B] text-white border-[#176B5B]'
                    : 'bg-[#F7FAF9] text-[#5C726E] border-[#BFD9D2] hover:border-[#176B5B] hover:text-[#176B5B]'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {sugg}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TagInput
