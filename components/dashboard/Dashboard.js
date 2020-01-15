/* eslint-disable max-classes-per-file */
import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Spring } from 'react-spring/renderprops.cjs';
import {
  Container, Row, Col, TabContent, TabPane,
} from 'reactstrap';
import styled from 'styled-components';
import { withTranslation } from '../../common/i18n';
import ContentLoader from '../common/ContentLoader';
import PlanContext from '../../context/plan';
import ActionListFilters from '../actions/ActionListFilters';
import ActionCardList from '../actions/ActionCardList';
import ImpactGroupActionList from './ImpactGroupActionList';

import Bar from './Bar';

const IMPACT_GROUP_MIN_WEIGHT = 2;
const IMPACT_GROUP_OTHERS_ID = '_others';

const DashboardSection = styled.div`
  background-color: ${(props) => props.theme.neutralLight};
`;

const DashboardHeader = styled.div`
  padding-top: 3rem;
  margin-bottom: 1rem;
  background-color: ${(props) => props.theme.neutralLight};
`;

const ImpactGroupSection = styled.div`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

export const GET_IMPACT_GROUP_LIST = gql`
  query ImpactGroupList($plan: ID!) {
    plan(id: $plan) {
      id
      impactGroups {
        identifier
        name
        weight
        actions {
          action {
            id
            identifier
            name
            mergedWith {
              id
            }
            status {
              identifier
              name
            }
          }
          impact {
            id
          }
        }
      }
      generalContent {
        actionListLeadContent
      }
    }
  }
`;

class DashboardLoaded extends React.Component {
  static contextType = PlanContext;

  static getFiltersFromQuery(query) {
    const {
      group,
    } = query;
    return {
      group,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      activeTabId: props.filters.group,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(segment) {
    this.setState({
      activeTabId: segment.id,
    });

    // Update URL in address bar
    this.props.onFilterChange({ group: segment.id });
  }

  makeSegments() {
    const { impactGroups } = this.props;
    const segments = [];
    const others = {
      id: IMPACT_GROUP_OTHERS_ID,
      name: 'Muut',
      value: 0,
      groups: [],
    };

    impactGroups.forEach(grp => {
      if (grp.weight > IMPACT_GROUP_MIN_WEIGHT) {
        segments.push({
          id: grp.identifier,
          name: grp.name,
          value: grp.weight,
          groups: [ grp ],
        });
      } else {
        others.groups.push(grp);
        others.value += grp.weight;
      }
    });
    segments.push(others);

    // console.debug('Segments', segments);

    return segments;
  }

  renderTabPane(segment) {
    const title = segment.id === IMPACT_GROUP_OTHERS_ID ? 'Muut' : segment.name;

    // Merge actions from all ImpactGroups
    let actions = [];
    const actionExists = (actId) => actions.find(act => act.action.id === actId) !== undefined;
    segment.groups.forEach(grp => {
      grp.actions.forEach(item => {
        // do not add merged actions or duplicates
        if (item.action.mergedWith === null && !actionExists(item.action.id)) {
          actions.push(item);
        }
      });
    });

    return (
      <TabPane key={segment.id} tabId={segment.id}>
        <h2 className="mb-3">{ title }</h2>
        {actions.length ? (<ImpactGroupActionList actions={actions} />) : 'Ei määriteltyjä toimenpiteitä.'}
      </TabPane>
    );
  }

  render() {
    const { t, filters, impactGroups, leadContent } = this.props;
    const impacts = this.context.actionImpacts;
    const segments = this.makeSegments();

    const tabPanes = segments.map(segment => this.renderTabPane(segment));

    // by default show the first segment
    const activeTabId = this.state.activeTabId || (segments.length ? segments[0].id : undefined);

    return (
      <div id="dashboard">
        <DashboardHeader>
          <Container>
            <h1 className="mb-3">{ t('dashboard') }</h1>
            {leadContent && (
              <Row>
                <Col sm="12" md="12" className="mb-5">
                  <div className="text-content" dangerouslySetInnerHTML={{ __html: leadContent }} />
                </Col>
              </Row>
            )}
          </Container>
        </DashboardHeader>
        <ImpactGroupSection>
          <Container>
            <Bar
              segments={segments}
              active={activeTabId}
              onSelect={this.handleSelect}
            />
            <TabContent activeTab={activeTabId}>
              { tabPanes }
            </TabContent>
          </Container>
        </ImpactGroupSection>
      </div>
    );
  }
}

DashboardLoaded.propTypes = {
  filters: PropTypes.shape({
    group: PropTypes.string,
  }).isRequired,
  impactGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
};


class Dashboard extends React.Component {
  static getFiltersFromQuery(query) {
    return DashboardLoaded.getFiltersFromQuery(query);
  }

  render() {
    const {
      t, plan, filters, onFilterChange,
    } = this.props;
    return (
      <Query query={GET_IMPACT_GROUP_LIST} variables={{ plan: plan.identifier }}>
        {({ data, loading, error }) => {
          if (loading) return <ContentLoader />;
          if (error) return <p>{ t('error-loading-actions') }</p>;

          const { generalContent, ...otherProps } = data.plan;
          // TODO: change leadContent to dashboardLeadContent when it is available!
          // const leadContent = generalContent.someLeadContent;
          const leadContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

          return (
            <DashboardLoaded
              t={t}
              plan={plan}
              leadContent={leadContent}
              filters={filters}
              onFilterChange={onFilterChange}
              {...data.plan}
            />
          );
        }}
      </Query>
    );
  }
}

Dashboard.propTypes = {
  t: PropTypes.func.isRequired,
  plan: PropTypes.shape({
    identifier: PropTypes.string,
  }).isRequired,
  filters: PropTypes.shape({}).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default withTranslation('common')(Dashboard);
