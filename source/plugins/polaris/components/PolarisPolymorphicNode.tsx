import {Card, FormLayout, Select} from '@shopify/polaris';
import React from 'react';

import {NodeProps, renderNodes, useNode} from '../../..';

interface Props {
  nestWithChild?: string;
  labelTranslationKey?: string;
}

export function PolarisPolymorphicNode({
  node,
  nestWithChild,
  labelTranslationKey = 'label',
}: NodeProps & Props) {
  const {onChange, errors} = useNode(node);
  const variant = node.children[node.value];
  const options = node.attributes.map((key) => {
    const child = node.children[key];
    return {
      value: key,
      label: child.translate('path'),
    };
  });
  const title = node.translate('sectionTitle');
  const label = node.translate(labelTranslationKey);
  const error = errors[0] ? node.translate('error', {error: errors[0]}) : '';

  if (nestWithChild && variant) {
    const {[nestWithChild]: nestedNode, ...otherNodes} = variant.children;
    const childTitle = nestedNode.translate('sectionTitle') || title;
    return (
      <>
        <Card title={childTitle}>
          <Card.Section>
            <FormLayout>
              <Select
                label={label}
                onChange={onChange}
                options={options}
                value={node.value}
                error={error}
              />
            </FormLayout>
          </Card.Section>
          <Card.Section>
            <FormLayout>{renderNodes({nestedNode})}</FormLayout>
          </Card.Section>
        </Card>
        {renderNodes(otherNodes)}
      </>
    );
  }

  return (
    <FormLayout>
      <Select
        label={label}
        onChange={onChange}
        options={options}
        value={node.value}
        error={error}
      />
      {variant && renderNodes({variant})}
    </FormLayout>
  );
}
