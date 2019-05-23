import React from 'react';
import Link from 'umi/link';

export const fieldTypes = [
  {
    name: '数字',
    value: 'number'
  },
  {
    name: '字符串',
    value: 'string'
  },
  {
    name: '布尔值',
    value: 'boolean'
  },
  {
    name: '日期',
    value: 'date'
  },
  {
    name: '时间戳',
    value: 'timestamp'
  },
  {
    name: '引用',
    value: 'reference'
  },
  {
    name: '对象',
    value: 'object'
  },
  {
    name: '数组',
    value: 'array'
  }
]

export function parseObjectProperties(properties) {
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

export function formatSchema(data) {
  const result = {
    description: data.description
  };
  switch (data.type) {
    case 'number':
      result.type = 'number';
      break;
    case 'string':
      result.type = 'string';
      break;
    case 'boolean':
      result.type = 'boolean';
      break;
    case 'date':
      result.type = 'string';
      result.format = 'date';
      break;
    case 'timestamp':
      result.type = 'string';
      result.format = 'date-time';
      break;
    case 'object':
      result.type = 'object';
      result.properties = {};
      data.properties.forEach(property => {
        result.properties[property.name] = formatSchema(property);
      });
      break;
    case 'reference':
      result.$ref = data.reference;
      break;
    case 'array':
      result.type = 'array';
      result.items = formatSchema(data.items);
      break;
    default:
      throw new Error(`Unknown field type ${data.type}`)
  };

  return result;
}

export function parseSchema(schema) {
  const result = {
    description: schema.description
  };
  switch (schema.type) {
    case 'number':
      result.type = 'number';
      break;
    case 'string':
      switch (schema.format) {
        case 'date':
          result.type = 'date';
          break;
        case 'date-time':
          result.type = 'timestamp';
          break;
        default:
          result.type = 'string'
      }
      break;
    case 'boolean':
      result.type = 'boolean';
      break;
    case 'object':
      result.type = 'object';
      result.properties = Object.keys(schema.properties).map(key =>
        ({
          name: key,
          ...parseSchema(schema.properties[key])
        })
      );
      break;
    case 'array':
      result.type = 'array';
      result.items = parseSchema(schema.items);
      break;
    default:
      result.type = 'reference';
      result.reference = schema.$ref;
  }

  return result;
}

export function SchemaType({ schema }) {
  switch (schema.type) {
    case 'number':
      return '数字';
    case 'string':
      return '字符串';
    case 'boolean':
      return '布尔值';
    case 'date':
      return '日期';
    case 'timestamp':
      return '时间戳';
    case 'object':
      return '对象';
    case 'array':
      return <>数组[<SchemaType schema={schema.items} />]</>;
    case 'reference':
      return <Link to={`/data/fields/${schema.reference.substr(schema.reference.lastIndexOf('/') + 1)}`}>引用</Link>;
    default:
      return '未知类型';
  }
}