import { useState } from 'react';
import PropTypes from 'prop-types';

import { ImSearch } from 'react-icons/im';

import { Form, Input, Submit } from './Searchbar.styled';

export const Searchbar = ({ onSerchSubmit, notify }) => {
  const [tag, setTag] = useState('');

  const handleFormSubmit = e => {
    e.preventDefault();
    const submitTag = tag.trim();
    if (submitTag === '') {
      notify('info', 'Please, enter a tag to search!');
      return;
    }
    onSerchSubmit(tag);
    setTag('');
  };

  const handleChange = e => {
    const serchTag = e.currentTarget.value;
    setTag(serchTag);
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Input
        onChange={handleChange}
        value={tag}
        placeholder="Search images..."
      />
      <Submit type="submit">
        <ImSearch size="20" fill="#2b47a8" />
      </Submit>
    </Form>
  );
};
Searchbar.propTypes = {
  onSerchSubmit: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};
