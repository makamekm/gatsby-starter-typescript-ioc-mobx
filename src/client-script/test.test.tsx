import * as React from 'react';
import * as renderer from 'react-test-renderer';

it('SubjectToBeTested renders correctly', () => {
  const tree = renderer.create(<div>Hello World</div>).toJSON();
  expect(tree).toMatchSnapshot();
});
