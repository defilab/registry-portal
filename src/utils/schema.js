export function parseSubFields(properties) {
  const fields = [];
  Object.keys(properties).forEach(key => {
    fields.push({
      name: key,
      description: properties[key].description,
      type: properties[key].type || 'reference'
    })
  });

  return fields;
}

export function dummy() {
  
}