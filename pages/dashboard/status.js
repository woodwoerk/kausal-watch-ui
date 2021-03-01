import React, { useContext, useCallback } from 'react';
import { Container } from 'reactstrap';
import { useTranslation } from 'common/i18n';
import PlanContext from 'context/plan';
import { Link } from 'routes';

import Layout, { Meta } from 'components/layout';

function StatusPage() {
  const { t } = useTranslation('common');
  const plan = useContext(PlanContext);

  return (
    <Layout>
      <Meta title={t('actions')} />
      <Container>
        <div>
          <hr />
          This view has a new address:
          {' '}
          <Link href="/actions?view=dashboard">
            access it here
          </Link>
          <hr />
        </div>
      </Container>
    </Layout>
  );
}
const initialProps = {
  namespacesRequired: ['common', 'actions'],
};

export default StatusPage;
