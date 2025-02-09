import styled from 'styled-components';

import { PlanContextType } from 'context/plan';
import { useTheme } from 'common/theme';
import PlanChip from './PlanChip';
import { useLocalizedLink } from 'common/hooks/localize-link';

const PlanDropdownItem = styled.a`
  display: block;
  padding: 0.25rem 0;
  margin: 0 0.5rem 0.5rem;
  border: 1px solid ${(props) => props.theme.themeColors.light};
  border-radius: 0.5rem;
  text-decoration: none !important;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: ${(props) => props.theme.themeColors.light};
    border-color: ${(props) => props.theme.themeColors.light};
    text-decoration: none;
  }
`;

interface Props {
  plan: PlanContextType | NonNullable<PlanContextType['allRelatedPlans'][0]>;
}

const PlanLink = ({ plan }: Props) => {
  const theme = useTheme();
  const localizedPlanUrl = useLocalizedLink(plan.viewUrl ?? '');

  if (!plan.viewUrl) {
    return null;
  }

  return (
    <PlanDropdownItem
      key={plan.identifier}
      href={localizedPlanUrl}
      type="button"
      tabIndex={0}
      role="menuitem"
    >
      <PlanChip
        planImage={plan.image?.rendition?.src}
        planShortName={plan.shortName}
        organization={
          theme.settings?.multiplan?.hideLongPlanNames ? undefined : plan.name
        }
        size="md"
      />
    </PlanDropdownItem>
  );
};

export default PlanLink;
