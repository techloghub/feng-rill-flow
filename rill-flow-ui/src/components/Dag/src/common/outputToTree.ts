function convertSchemaToTreeData(schema) {
  const treeData = [];

  if (schema.type === 'object') {
    for (const [key, value] of Object.entries(schema.properties)) {
      const node = {
        title: key,
        value: key,
        children: convertSchemaToTreeData(value),
      };

      treeData.push(node);
    }
  } else if (schema.type === 'array') {
    const arrayItems = schema.items;

    if (arrayItems && arrayItems.type === 'object') {
      const node = {
        title: 'Item',
        value: 'item',
        children: convertSchemaToTreeData(arrayItems),
      };
      // const node = convertSchemaToTreeData(arrayItems);

      treeData.push(node);
    }
  }

  return treeData;
}

const schema = {
  type: 'object',
  properties: {
    statuses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          visible: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              list_id: { type: 'string' },
            },
          },
          created_at: { type: 'string' },
          id: { type: 'integer' },
          mid: { type: 'string' },
        },
      },
    },
  },
};

const treeData = convertSchemaToTreeData(schema);
console.log(treeData, JSON.stringify(treeData));
