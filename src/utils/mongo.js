/** Stable string id for Mongo-style documents from JSON API */
export function docId(doc) {
  if (!doc || typeof doc !== 'object') return ''
  const id = doc._id ?? doc.id
  if (id == null) return ''
  return typeof id === 'object' && id.toString ? id.toString() : String(id)
}
