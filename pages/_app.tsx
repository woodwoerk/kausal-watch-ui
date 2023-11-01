import React, { useEffect } from 'react';
import App, { AppContext, AppProps } from 'next/app';
import getConfig from 'next/config';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import ReactPiwik from 'react-piwik';
import { ThemeProvider } from 'styled-components';
import { Router, useRouter } from 'next/router';
import numbro from 'numbro';

import StatusMessage from 'components/common/StatusMessage';
import { appWithTranslation } from 'common/i18n';
import { initializeApolloClient, setApolloPlanIdentifier } from 'common/apollo';
import { setBasePath } from 'common/links';
import { loadTheme } from 'common/theme';
import { getI18n } from 'common/i18n';
import dayjs from 'common/dayjs';
import PlanContext, { GET_PLAN_CONTEXT, customizePlan } from 'context/plan';
import SiteContext from 'context/site';

import '@kausal/mapboxgl-legend/dist/style.css';
import {
  GetPlanContextQuery,
  PublicationStatus,
} from 'common/__generated__/graphql';
import { ThemeProps } from 'styled-components';
import { NextPageContext } from 'next';
import { IncomingMessage } from 'http';

const { publicRuntimeConfig } = getConfig();
const isServer = typeof window === 'undefined';

require('../styles/default/main.scss');

if (!isServer) {
  setBasePath();
}

let piwik;

function onRouteChange(url) {
  const parts = url.split('?');
  const pathname = parts[0];
  const path = pathname.substring(1);

  piwik.track({ path, pathname, search: '' });
}

interface SiteContext {
  deploymentType: string;
  domain: string;
  path: string;
}

interface GlobalProps {
  siteProps: SiteContext;
  themeProps: ThemeProps;
  plan: NonNullable<GetPlanContextQuery['plan']>;
  unpublished?: boolean;
  statusMessage?: string;
}

type WatchAppProps = AppProps &
  GlobalProps & {
    apollo?: ApolloClient<InMemoryCache>;
  };

function WatchApp(props: WatchAppProps) {
  const {
    Component,
    pageProps,
    siteProps,
    themeProps,
    plan,
    unpublished,
    statusMessage,
  } = props;
  let { apollo } = props;

  const router = useRouter();
  const matomoAnalyticsUrl = plan?.domain?.matomoAnalyticsUrl;
  let matomoURL: string | null, matomoSiteId: string | null;

  if (matomoAnalyticsUrl) {
    [matomoURL, matomoSiteId] = matomoAnalyticsUrl.split('?');
  } else {
    ({ matomoURL, matomoSiteId } = publicRuntimeConfig);
  }
  if (!apollo) {
    apollo = initializeApolloClient({ planIdentifier: plan.identifier });
  }

  useEffect(() => {
    // Launch Piwik after rendering the app
    if (piwik || isServer || !matomoURL || !matomoSiteId) return;
    piwik = new ReactPiwik({
      url: matomoURL,
      siteId: parseInt(matomoSiteId, 10),
      jsFilename: 'js/',
      phpFilename: 'js/',
    });
    // Disable cookies
    ReactPiwik.push(['disableCookies']);
    // Track the initial page view
    ReactPiwik.push(['trackPageView']);
    Router.events.on('routeChangeComplete', onRouteChange);
  }, [matomoURL, matomoSiteId]);

  if (unpublished === true) {
    return <StatusMessage message={statusMessage} noindex={true} />;
  }

  dayjs.locale(router.locale);

  const i18n = getI18n();
  if (i18n) {
    numbro.setLanguage(i18n.language);
  }

  if (!isServer) {
    setApolloPlanIdentifier(plan.identifier);
  }
  return (
    <SiteContext.Provider value={siteProps}>
      <ThemeProvider theme={themeProps}>
        <ApolloProvider client={apollo}>
          <PlanContext.Provider value={plan}>
            <Component {...pageProps} />
          </PlanContext.Provider>
        </ApolloProvider>
      </ThemeProvider>
    </SiteContext.Provider>
  );
}

async function getI18nProps(ctx) {
  const {
    serverSideTranslations,
  } = require('next-i18next/serverSideTranslations');
  const nextI18nConfig = require('../next-i18next.config');
  const { publicRuntimeConfig } = getConfig();
  let locale = ctx.locale || publicRuntimeConfig.locale;
  const i18n = getI18n();

  if (!locale) {
    throw new Error('Locale not set');
  }
  if (i18n) {
    await i18n.changeLanguage(locale);
  }
  const conf = {
    ...nextI18nConfig,
    i18n: {
      ...nextI18nConfig.i18n,
      defaultLocale: ctx.defaultLocale,
      locales: ctx.locales,
    },
  };
  const i18nConfig = await serverSideTranslations(
    locale,
    ['common', 'actions', 'a11y'],
    conf
  );
  return i18nConfig;
}

type WatchCurrentURL = {
  hostname: string;
  path: string;
  baseURL: string;
};

type WatchRequest = IncomingMessage & {
  planIdentifier: string;
  currentURL: WatchCurrentURL;
  publicationStatus?: PublicationStatus;
  publicationStatusMessage?: string;
};

type WatchPageContext = NextPageContext & {
  req: WatchRequest;
};

type WatchAppContext = AppContext & {
  ctx: WatchPageContext;
};

async function getPlan(ctx: WatchPageContext) {
  const apollo = initializeApolloClient({ ctx });
  const planIdentifier = ctx.req.planIdentifier;

  const { data, error } = await apollo.query({
    query: GET_PLAN_CONTEXT,
    variables: {
      identifier: ctx.req.planIdentifier,
      hostname: ctx.req.currentURL.hostname,
      clientUrl: ctx.req.currentURL.baseURL,
    },
  });
  if (error) throw error;
  const plan = data.plan;

  if (!plan) {
    throw new Error(`No plan found for identifier '${planIdentifier}'`);
  }
  return customizePlan(plan);
}

function getSiteContext(ctx) {
  const { currentURL } = ctx.req;
  const { deploymentType } = publicRuntimeConfig;
  return {
    deploymentType,
    hostname: currentURL.hostname,
    path: currentURL.path,
    baseURL: currentURL.baseURL,
  };
}

WatchApp.getInitialProps = async (appContext: WatchAppContext) => {
  const { ctx } = appContext;
  setBasePath();
  const appProps = await App.getInitialProps(appContext);

  if (!isServer) {
    const nextData = window.__NEXT_DATA__;
    const { _nextI18Next } = nextData.props.pageProps;
    const { plan, themeProps, siteProps } = nextData.props;
    const ret = {
      ...appProps,
      plan,
      siteProps,
      themeProps,
      pageProps: {
        ...appProps.pageProps,
        _nextI18Next,
      },
    };
    return ret;
  }
  const { publicationStatus, publicationStatusMessage } = ctx.req;
  if (publicationStatus != null && publicationStatus !== 'PUBLISHED') {
    return {
      ...appProps,
      unpublished: true,
      statusMessage: publicationStatusMessage,
    };
  }
  /*
  if (err) {
    return {...appProps}
  }
  */
  const i18nProps = await getI18nProps(ctx);
  const plan = await getPlan(ctx);
  const pageProps = {
    ...appProps.pageProps,
    ...i18nProps,
  };
  const theme = await loadTheme(plan.themeIdentifier || plan.identifier);
  return {
    ...appProps,
    plan,
    themeProps: theme,
    pageProps: pageProps,
    siteProps: getSiteContext(ctx),
  };
};

export default appWithTranslation(WatchApp);
