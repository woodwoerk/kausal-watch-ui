import React from 'react';
import { useTheme } from 'common/theme';
import PropTypes from 'prop-types';
import { Container } from 'reactstrap';
import styled from 'styled-components';
import RichText from 'components/common/RichText';

const Hero = styled.div`
  width: 100%;
  position: relative;
  background-color: ${(props) => props.theme.brandDark};
  padding: 0 0 2rem;

  @media (min-width: ${(props) => props.theme.breakpointMd}) {
    display: flex;
    align-items: flex-start;
    min-height: 24rem;
    padding: 0;
  }

  @media (min-width: ${(props) => props.theme.breakpointLg}) {
    min-height: 28rem;
  }

  @media (min-width: ${(props) => props.theme.breakpointXl}) {
    min-height: 30rem;
  }
`;

const HeroImage = styled.div`
  min-height: 14rem;
  margin: 0 -1rem;
  background-size: cover;
  background-position: ${(props) => props.imageAlign};
  background-image: url(${(props) => props.image});
  background-repeat: no-repeat;

  @media (min-width: ${(props) => props.theme.breakpointMd}) {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
  }
`;

const MainCard = styled.div`
  position: relative;
  max-width: ${(props) => props.theme.breakpointSm};
  margin: -2rem auto 0;
  padding: ${(props) =>
    `${props.theme.spaces.s200} ${props.theme.spaces.s200} ${props.theme.spaces.s100}`};
  border-radius: ${(props) => props.theme.cardBorderRadius};
  background-color: ${(props) => props.theme.themeColors.white};
  color: ${(props) => props.theme.neutralDark};
  box-shadow: 4px 4px 8px rgba(0,0,0,0.1);
  z-index: 100;

  h1 {
    font-size: ${(props) => props.theme.fontSizeLg};
    margin-bottom: ${(props) => props.theme.spaces.s100};
  }

  a {
    color: ${(props) => props.theme.neutralDark};

    &:hover {
      text-decoration: none;
    }
  }

  .lead-content {
    font-size: ${(props) => props.theme.fontSizeBase};
    line-height: ${(props) => props.theme.lineHeightMd};
    font-family: ${(props) => props.theme.fontFamilyContent};
  }

  @media (min-width: ${(props) => props.theme.breakpointMd}) {
    margin: 3rem ${(props) => {
      switch(props.alignment) {
        case 'left': return '0 2rem 0';
        case 'right': return '0 2rem auto';
        case 'center': return 'auto';
        default: return '0';
      }}};

    h1 {
      font-size: ${(props) => props.theme.fontSizeXl};
    }

    .lead-content {
      font-size: ${(props) => props.theme.fontSizeMd};
    }
  }
`;

const HeroFullImage = (props) => {
  const {
    bgImage, imageAlign, title, lead
  } = props;

  const theme = useTheme();

  return (
    <Hero>
      <HeroImage
        image={bgImage}
        imageAlign={imageAlign}
      />
      <Container>
      <MainCard
        alignment={theme.settings?.frontHero ? theme.settings.frontHero.cardPlacement : 'left'}
      >
        <h1>{ title }</h1>
        <RichText html={lead} className="lead-content" />
      </MainCard>
      </Container>
    </Hero>
  );
}

HeroFullImage.defaultProps = {
  imageAlign: 'left',
  lead: '',
};

HeroFullImage.propTypes = {
  bgImage: PropTypes.string.isRequired,
  imageAlign: PropTypes.string,
  title: PropTypes.string.isRequired,
  lead: PropTypes.string,
};

export default HeroFullImage;
