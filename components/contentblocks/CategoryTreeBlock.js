import React, { useContext, useState, useCallback } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { Container, Row, Col } from 'reactstrap';
import ContentLoader from 'components/common/ContentLoader';
import Card from 'components/common/Card';
import { gql, useQuery } from '@apollo/client';
import CategoryTreeMap from 'components/graphs/CategoryTreeMap';

import PlanContext from 'context/plan';

const CategoryListSection = styled.div`
  background-color: ${(props) => props.theme.neutralLight};
  padding: ${(props) => props.theme.spaces.s300} 0 ${(props) => props.theme.spaces.s100};

  @media (min-width: ${(props) => props.theme.breakpointMd}) {
    padding: ${(props) => props.theme.spaces.s100} 0;
  }
`;

const TreemapContent = styled.div`
  background-color: ${(props) => props.theme.neutralLight};
  text-align: center;
`;

const CategoryCard = styled.div`
  position: relative;
  z-index: 199;
  background-color: white;
  height: calc(100% - 6px);
  padding: 1rem;
  margin: 1rem 3px 3px 3px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,.5));

  &::after {
    content: '';
    position: absolute;
    right: 75%;
    z-index: 200;
    top: -1.25rem;
    width: 0;
    height: 0;
    border-top: 0;
    border-left: 1.25rem solid transparent;
    border-right: 1.25rem solid transparent;
    border-bottom: 1.25rem solid white;
  }

  @media (min-width: ${(props) => props.theme.breakpointMd}) {
    margin: 3px 1rem 3px 0;

    &::after {
    right: -1.5rem;
    top: 33%;
    border-top: 1.5rem solid transparent;
    border-bottom: 1.5rem solid transparent;
    border-left: 1.5rem solid white;
    border-right: 0;
  }
  }
`;

const CategoryTreeLayout = styled.div`
  display: flex;
  flex-direction: column-reverse;

  @media (min-width: ${(props) => props.theme.breakpointMd}) {
    flex-direction: row;
  }
`;

const CategoryCardColumn = styled.div`
  flex: 0 0 25%;
`;

const CategoryVizColumn = styled.div`
  flex: 0 0 75%;
`;
const GET_CATEGORIES_FOR_TREEMAP = gql`
query GetCategoriesForTreeMap($plan: ID!, $categoryType: ID!) {
  planCategories(plan: $plan, categoryType: $categoryType) {
    id
    name
    color
    parent {
      id
    }
    metadata(id: "impact") {
      ...on CategoryMetadataNumericValue {
        value
      }
    }
  }
}
`;

const CategoryTreeSection = (props) => {
  const { sections } = props;
  const [activeCategory, setCategory] = useState({
    name: 'Total',
    metadata: [{ value: '50.921' }],
  });

  const rootSection = {
    id: 'root',
    name: 'Total utsläpp',
    color: '#999999',
    parent: null,
    metadata: [
      {
        value: 50.921,
      },
    ],
  };

  // useCallback, so function prop does not cause graph re-rendering
  const onChangeSection = useCallback(
    (cat) => {
      const allSections = _.concat(rootSection, sections);
      const newCat = allSections.find((sect) => sect.id === cat);
      setCategory(newCat);
      return false;
    }, [],
  );

  console.log(sections);

  return (
    <CategoryListSection>
      <Container fluid>
        <CategoryTreeLayout>

          <CategoryCardColumn>
            <CategoryCard>
              <h4>{activeCategory?.name}</h4>
              <h5>
                {activeCategory?.metadata[0]?.value}
                {' '}
                Mt CO
                <sub>2</sub>
                e
              </h5>
            </CategoryCard>
          </CategoryCardColumn>

          <CategoryVizColumn>
            <TreemapContent>
              <CategoryTreeMap
                data={sections}
                onChangeSection={onChangeSection}
              />
            </TreemapContent>
          </CategoryVizColumn>
        </CategoryTreeLayout>

      </Container>
    </CategoryListSection>
  );
};

const CategoryTreeBlock = () => {
  if (!process.browser) {
    return null;
  }
  const plan = useContext(PlanContext);
  const { data, loading, error } = useQuery(GET_CATEGORIES_FOR_TREEMAP, {
    variables: {
      plan: plan.identifier,
      categoryType: 'transition', // FIXME
    },
  });

  if (!data) return <ContentLoader />;

  return (
    <CategoryTreeSection sections={data?.planCategories} />
  );
};

export default CategoryTreeBlock;
