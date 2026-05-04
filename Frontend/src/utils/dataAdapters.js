function unwrapApiPayload(value) {
  return value?.data || value;
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function resolveEntityId(entity) {
  return entity?._id || entity?.id || null;
}

export { resolveEntityId, toArray, unwrapApiPayload };
