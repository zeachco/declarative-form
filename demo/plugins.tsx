import React from 'react';
import { Node, NodeProps, SchemaNodeComponent, useNode } from '../framework';

export function StringNode({ node }: NodeProps) {
  const { onChange, errors } = useNode(node);
  return (
    <div>
      <label>{node.path} : </label>
      <input value={node.value?.toString() || ''} onChange={onChange} />
      {errors.map((err) => (
        <strong key={err}>{err}</strong>
      ))}
    </div>
  );
}

// this will be moved internal to framework
export function ListNode({ node, context }: NodeProps) {
  const { onChange, errors } = useNode(node);

  const jsx: React.ReactNodeArray = ['[ListNode...]'];

  for (const key in node.children) {
    const child = node.children[key];
    jsx.push(<pre key={key}>{JSON.stringify({ [key]: child })}</pre>);
  }

  return (
    <div>
      <label>{node.path}: </label>

      {errors.map((err) => (
        <strong key={err}>{err}</strong>
      ))}
      {jsx}
      <button onClick={handleAddNew}>Add node</button>
    </div>
  );

  function handleAddNew() {
    const subPath = [node.path, node.value.length].join('.');
    onChange(node.value.push(new Node(context, subPath, node.schema)));
  }
}

// this will be moved internal to framework
export function PolyNode({ node, context }: NodeProps) {
  const { onChange, errors } = useNode(node);

  const optionsJsx: React.ReactNodeArray = [];

  for (const key in node.children) {
    optionsJsx.push(<option key={key}>{key}</option>);
  }

  const subNode = node.children[node.value];

  return (
    <div>
      <label>{node.path} :</label>
      <select onChange={onChange}>{optionsJsx}</select>
      {errors.map((err) => (
        <strong>{err}</strong>
      ))}
      {subNode && <SchemaNodeComponent context={context} node={subNode} />}
    </div>
  );
}
