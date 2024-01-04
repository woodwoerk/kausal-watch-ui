import { gql } from '@apollo/client';
import { getClient } from '../apollo-client';
import { ALL_ACTION_LIST_FILTERS } from '../fragments/action-list.fragment';
import {
  GetActionListPageIncludeRelatedQuery,
  GetActionListPageIncludeRelatedQueryVariables,
  GetActionListPageQuery,
  GetActionListPageQueryVariables,
} from '@/common/__generated__/graphql';

const GET_INCLUDE_RELATED_ACTIONS = gql`
  query GetActionListPageIncludeRelated($plan: ID!) {
    plan(id: $plan) {
      actionListPage {
        includeRelatedPlans
      }
    }
  }
`;

export const getIncludeRelatedActions = async (plan: string) =>
  await getClient().query<
    GetActionListPageIncludeRelatedQuery,
    GetActionListPageIncludeRelatedQueryVariables
  >({
    query: GET_INCLUDE_RELATED_ACTIONS,
    variables: { plan },
    fetchPolicy: 'no-cache',
  });

const GET_ACTIONS_LIST_PAGE = gql`
  query GetActionListPage($plan: ID!, $singlePlan: Boolean!) {
    plan(id: $plan) {
      actionListPage {
        __typename
        id
        slug
        title
        ... on ActionListPage {
          leadContent
          defaultView
          headingHierarchyDepth
          includeRelatedPlans
          ...ActionListPageFilters
        }
        lastPublishedAt
      }
    }
  }
  ${ALL_ACTION_LIST_FILTERS}
`;

export const getActionsListPage = async (plan: string, isSinglePlan: boolean) =>
  await getClient().query<
    GetActionListPageQuery,
    GetActionListPageQueryVariables
  >({
    query: GET_ACTIONS_LIST_PAGE,
    variables: {
      plan,
      singlePlan: isSinglePlan,
    },
    fetchPolicy: 'no-cache',
  });
