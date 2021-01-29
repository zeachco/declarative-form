import React from 'react';
import {
  DeclarativeFormContext,
  NodeProps,
  RootNode,
  SchemaNode,
  SchemaNodeDefinitionLegacy,
  useNode,
} from '../framework';
import { getFunctionName } from '../framework/utils';
import { StringNode } from './plugins';
import { SCHEMA } from './schema';
import { SCHEMA_SANDBOX } from './schemaSandbox';
import {
  formatValidator,
  lengthValidator,
  presenceValidator,
} from './validators';

function SimpleBillingDetails({ node, children }: NodeProps) {
  useNode(node);
  return (
    <div
      key={'BusinessDetailsSoleProp'}
      style={{ padding: '1em', border: '1px dashed black' }}
    >
      <h3>hahahaha I intercepted SimpleBillingDetails</h3>
      {children}
      <small>path: {node.path}</small>
    </div>
  );
}

const context = new DeclarativeFormContext({
  plugins: {
    string: StringNode,
    date: StringNode,
    region: StringNode,
    SimpleBillingDetails,
    AdditionalOwner2({ node }: NodeProps) {
      return <div>input</div>;
    },
  },
  validators: {
    Presence: presenceValidator,
    Format: formatValidator,
    Length: lengthValidator,
  },
});

const schema: SchemaNodeDefinitionLegacy = {
  kind: 'group',
  attributes: SCHEMA_SANDBOX || SCHEMA,
};

const legacyConfigWrappedInNodes = new SchemaNode(context, '', schema);

export function App() {
  const [debug, setDebug] = React.useState(context.debug);

  return (
    <div>
      <label className="debug">
        <input type="checkbox" checked={debug} onChange={handleSwitch} /> Show
        groups
      </label>

      <RootNode
        context={context}
        node={legacyConfigWrappedInNodes}
        key={debug.toString()}
      />
    </div>
  );

  function handleSwitch() {
    context.debug = !debug;
    setDebug(context.debug);
  }
}

// for debugger
(window as any).config = legacyConfigWrappedInNodes;
(window as any).context = context;
