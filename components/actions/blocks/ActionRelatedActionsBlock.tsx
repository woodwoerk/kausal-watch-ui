import styled from 'styled-components';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'common/i18n';
import { ActionSection, SectionHeader } from 'components/actions/ActionContent';
import ActionCard from 'components/actions/ActionCard';

const RelatedActionList = styled(Row)`
  padding-left: 0;
`;

const RelatedActionItem = styled(Col)`
  list-style: none;
`;

const ActionRelatedActionsBlock = (props) => {
  const { relatedActions, plan } = props;
  const { t } = useTranslation();

  // Display the plan name only if there are related actions from other plans
  const hasRelatedActionsFromOtherPlans = relatedActions.some(
    (relAction) => relAction.plan.id !== plan.id
  );

  return (
    <div>
      <Row>
        <Col>
          <SectionHeader>{t('actions:related-actions')}</SectionHeader>
          <RelatedActionList tag="ul">
            {relatedActions.map((relAction) => (
              <RelatedActionItem
                tag="li"
                xs="12"
                sm="6"
                lg="4"
                className="mb-5 d-flex align-items-stretch"
                style={{ transition: 'all 0.5s ease' }}
                key={relAction.id}
              >
                <ActionCard
                  action={relAction}
                  showPlan={hasRelatedActionsFromOtherPlans}
                />
              </RelatedActionItem>
            ))}
          </RelatedActionList>
        </Col>
      </Row>
    </div>
  );
};

export default ActionRelatedActionsBlock;
