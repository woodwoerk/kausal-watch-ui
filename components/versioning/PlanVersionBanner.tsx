import styled from 'styled-components';
import { Container } from 'reactstrap';

import Icon from 'components/common/Icon';
import { useTranslations } from 'next-intl';

const VersionBannerSection = styled.div`
  padding: ${(props) => props.theme.spaces.s100} 0;
  background-color: ${(props) => props.theme.graphColors.blue070};
  color: ${(props) => props.theme.graphColors.grey010};
`;

const VersionBanner = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0;
  background-color: ${(props) => props.theme.graphColors.blue070};
  color: ${(props) => props.theme.graphColors.grey010};

  @media (max-width: ${(props) => props.theme.breakpointMd}) {
  }
`;

const VersionNote = styled.div`
  display: flex;
`;

const VersionName = styled.div`
  font-size: ${(props) => props.theme.fontSizeSm};
`;

const CurrentVersionName = styled.div`
  font-weight: ${(props) => props.theme.fontWeightBold};
`;

const LatestVersionName = styled.div`
  font-weight: ${(props) => props.theme.fontWeightBold};
`;

const LinkToLatestVersion = styled.div`
  display: flex;
  text-align: right;
  font-size: ${(props) => props.theme.fontSizeSm};

  a {
    color: ${(props) => props.theme.graphColors.grey010};
  }
`;

const PlanVersionBanner = (props) => {
  const { latestVersion, currentVersion } = props;
  const t = useTranslations();

  return (
    <VersionBannerSection>
      <Container>
        <VersionBanner>
          <VersionNote>
            <Icon
              name="version"
              className="me-2"
              width="2.25rem"
              height="2.25rem"
            />
            <VersionName>
              {t('version-this-is-old')}
              <br />
              <CurrentVersionName>
                {currentVersion?.versionName || currentVersion?.shortName}
              </CurrentVersionName>
            </VersionName>
          </VersionNote>
          <LinkToLatestVersion>
            <a href={latestVersion?.viewUrl} className="ms-2">
              {t('version-switch-to-active')}
              <br />
              <LatestVersionName>
                {latestVersion?.versionName || latestVersion?.shortName}
              </LatestVersionName>
            </a>
            <Icon
              name="arrow-right"
              className="ms-2"
              width="2.25rem"
              height="2.25rem"
            />
          </LinkToLatestVersion>
        </VersionBanner>
      </Container>
    </VersionBannerSection>
  );
};

export default PlanVersionBanner;
