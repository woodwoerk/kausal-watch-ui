import { Row, Col } from 'reactstrap';

import { getActionTaskTermContext, useTranslation } from 'common/i18n';
import { ActionSection, SectionHeader } from 'components/actions/ActionContent';
import TaskList from 'components/actions/TaskList';
import { usePlan } from 'context/plan';

const ActionTasksBlock = (props) => {
  const { tasks } = props;
  const { t } = useTranslation();
  const plan = usePlan();

  return (
    <div>
      <Row>
        <Col>
          <SectionHeader>
            {t('actions:action-tasks', getActionTaskTermContext(plan))}
          </SectionHeader>
        </Col>
      </Row>
      <Row>
        <Col>
          <ActionSection>
            <TaskList tasks={tasks} />
          </ActionSection>
        </Col>
      </Row>
    </div>
  );
};

export default ActionTasksBlock;
