const DRAFTS_KEY = 'setu_citizen_drafts'

export function getSavedDrafts() {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.warn('Failed to load drafts:', err)
    return []
  }
}

export function saveDraftToStorage(draftData) {
  try {
    const existing = getSavedDrafts()
    const id = draftData.id || `DRAFT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
    const updatedDraft = {
      ...draftData,
      id,
      updatedAt: new Date().toISOString(),
    }

    const index = existing.findIndex((d) => d.id === id)
    let newDrafts = []
    if (index >= 0) {
      newDrafts = [...existing]
      newDrafts[index] = updatedDraft
    } else {
      newDrafts = [updatedDraft, ...existing]
    }

    localStorage.setItem(DRAFTS_KEY, JSON.stringify(newDrafts))
    return updatedDraft
  } catch (err) {
    console.warn('Failed to save draft:', err)
    return draftData
  }
}

export function removeDraftFromStorage(id) {
  try {
    const existing = getSavedDrafts()
    const filtered = existing.filter((d) => d.id !== id)
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(filtered))
    return filtered
  } catch (err) {
    console.warn('Failed to remove draft:', err)
    return []
  }
}
