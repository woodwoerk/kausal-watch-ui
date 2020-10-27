import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import styled, { ThemeProvider } from 'styled-components';

import { useTranslation } from 'common/i18n';
import PlanContext from 'context/plan';
import SiteContext from 'context/site';
import ThemedGlobalStyles from 'common/ThemedGlobalStyles';
import theme from 'common/theme';

import Header from './header';
import Footer from './Footer';

const Content = styled.main`
  min-height: 800px;
`;

function Layout({ children }) {
  const plan = useContext(PlanContext);
  const site = useContext(SiteContext);
  const generalContent = plan.generalContent || {};
  const siteTitle = generalContent.siteTitle || plan.name;
  const iconBase = site.theme ? `/static/images/${site.theme}/favicon` : null;
  const googleSiteVerificationTag = plan.domain?.googleSiteVerificationTag;

  return (
    <>
      <Meta />
      <ThemedGlobalStyles />
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:type" content="website" />
        {site.baseURL && (
          <meta property="og:url" content={site.baseURL + site.path} />
        )}
        <meta property="og:site_name" content={siteTitle} />
        {iconBase && (
          <>
            <link rel="shortcut icon" href={`${iconBase}/favicon.ico`} type="image/x-icon" />
            <link rel="apple-touch-icon" sizes="180x180" href={`${iconBase}/apple-touch-icon.png`} />
            <link rel="icon" type="image/png" sizes="32x32" href={`${iconBase}/favicon-32x32.png`} />
            <link rel="icon" type="image/png" sizes="16x16" href={`${iconBase}/favicon-16x16.png`} />
            <link rel="mask-icon" href={`${iconBase}/safari-pinned-tab.svg`} color={theme.brandDark} />
          </>
        )}
        { theme.themeCustomStylesUrl && <link rel="stylesheet" type="text/css" href={theme.themeCustomStylesUrl} />}
        <meta name="msapplication-TileColor" content={theme.brandDark} />
        <meta name="theme-color" content="#ffffff" />
        { googleSiteVerificationTag && <meta name="google-site-verification" content={googleSiteVerificationTag} />}
      </Head>
      <Header siteTitle={siteTitle} />
      <Content id="main">
        {children}
      </Content>
      <Footer />
    </>
  );
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

export function Meta(props) {
  const plan = React.useContext(PlanContext);
  const { title, shareImageUrl, description } = props;
  const generalContent = plan.generalContent || {};
  const siteTitle = generalContent.siteTitle || plan.name;
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  // In ogTitle we don't want to repeat the site name.
  const ogTitle = title || siteTitle;
  const ogDescription = description || generalContent.siteDescription;
  const ogImage = shareImageUrl || plan.mainImage?.smallRendition?.src || plan.imageUrl;

  return (
    <Head>
      <title key="head-title">{pageTitle}</title>
      <meta property="og:title" key="head-og-title" content={ogTitle} />
      {ogDescription && (
        <meta property="og:description" key="head-og-description" content={ogDescription} />
      )}
      {ogImage && (
        <meta property="og:image" key="head-og-image" content={ogImage} />
      )}
    </Head>
  );
}

Meta.defaultProps = {
  title: null,
  shareImageUrl: null,
  description: null,
};

Meta.propTypes = {
  title: PropTypes.string,
  shareImageUrl: PropTypes.string,
  description: PropTypes.string,
};
