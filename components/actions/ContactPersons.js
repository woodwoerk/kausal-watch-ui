import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTranslation } from '../../common/i18n';

import ContactPerson from './ContactPerson';

const SectionHeader = styled.h3`
  font-size: ${(props) => props.theme.fontSizeBase};
  margin: 0;
`;

const ContactList = styled.ul`
  margin-top: 2em;
  list-style: none;
  padding: 0;
`;

const Note = styled.div`
  color: ${(props) => props.theme.themeColors.dark};
`;

function ContactPersons(props) {
  const { t, persons } = props;
  return (
    <>
      <SectionHeader>{t('contact-persons')}</SectionHeader>
      <ContactList>
        {persons.length !== 0 ? (
          persons.map((person, index) => (
            <li key={person.id}>
              <ContactPerson person={person} leader={index === 0} />
            </li>
          ))
        ) : (
          <Note>{t('contact-persons-missing')}</Note>
        )}
      </ContactList>
    </>
  );
}
ContactPersons.propTypes = {
  persons: PropTypes.arrayOf(
    PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string,
      title: PropTypes.string,
      organization: PropTypes.shape({
        name: PropTypes.string,
      }),
    })
  ).isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(ContactPersons);
