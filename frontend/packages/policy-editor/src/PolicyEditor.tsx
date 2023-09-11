import React, { useState } from 'react';
import { Alert, Heading } from '@digdir/design-system-react';
import type {
  PolicyAction,
  Policy,
  PolicyRule,
  PolicyRuleCard,
  PolicyRuleResource,
  PolicySubject,
  RequiredAuthLevel,
  PolicyEditorUsage,
} from './types';
import {
  mapPolicyRulesBackendObjectToPolicyRuleCard,
  emptyPolicyRule,
  mapPolicyRuleToPolicyRuleBackendObject,
  createNewPolicyResource,
} from './utils';
import classes from './PolicyEditor.module.css';
import { VerificationModal } from './components/VerificationModal';
import { SelectAuthLevel } from './components/SelectAuthLevel';
import { ExpandablePolicyCard } from './components/ExpandablePolicyCard';
import { CardButton } from './components/CardButton';
import { deepCopy } from 'app-shared/pure';
import { useTranslation } from 'react-i18next';

export type PolicyEditorProps = {
  /**
   * The policy to edit
   */
  policy: Policy;
  /**
   * A list of actions that can be used in the rules
   */
  actions: PolicyAction[];
  /**
   * A list of subjects that be can selected in the rules
   */
  subjects: PolicySubject[];
  /**
   * (Optional) The ID of the resource so that it can fill the autogenerated field for the first resource
   */
  resourceId?: string;
  /**
   * Function that saves the policy
   * @param policy the policy to save
   * @returns void
   */
  onSave: (policy: Policy) => void;
  /**
   * Flag to decide if errors should be shown or not
   */
  showAllErrors: boolean;
  /**
   * The usage type of the policy editor
   */
  usageType: PolicyEditorUsage;
};
/**
 * @component
 *    Displays the content where a user can add and edit a policy
 *
 * @property {Policy}[policy] - The policy to edit
 * @property {PolicyAction[]}[actions] - A list of actions that can be used in the rules
 * @property {PolicySubject[]}[subjects] - A list of subjects that be can selected in the rules
 * @property {string}[resourceId] - (Optional) The ID of the resource so that it can fill the autogenerated field for the first resource
 * @property {function}[onSave] - Function that saves the policy
 * @property {boolean}[showAllErrors] - Flag to decide if errors should be shown or not
 * @property {PolicyEditorUsage}[usageType] - The usage type of the policy editor
 *
 * @returns {React.ReactNode} - The rendered component
 */
export const PolicyEditor = ({
  policy,
  actions,
  subjects,
  resourceId,
  onSave,
  showAllErrors,
  usageType,
}: PolicyEditorProps): React.ReactNode => {
  const { t } = useTranslation();

  // TODO - Find out how this should be set. Issue: #10880
  const resourceType = usageType === 'app' ? 'urn:altinn' : 'urn:altinn.resource';

  const [policyRules, setPolicyRules] = useState<PolicyRuleCard[]>(
    mapPolicyRulesBackendObjectToPolicyRuleCard(subjects, actions, policy?.rules ?? [])
  );
  const [requiredAuthLevel, setRequiredAuthLevel] = useState<RequiredAuthLevel>(
    policy?.requiredAuthenticationLevelEndUser ?? '3'
  );

  // Handle the new updated IDs of the rules when a rule is deleted / duplicated
  const [lastRuleId, setLastRuleId] = useState((policy?.rules.length ?? 0) + 1);

  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  // To keep track of which rule to delete
  const [ruleIdToDelete, setRuleIdToDelete] = useState('0');

  const [showErrorsOnAllRulesAboveNew, setShowErrorsOnAllRulesAboveNew] = useState(false);

  /**
   * Displays all the rule cards
   */
  const displayRules = policyRules.map((pr, i) => {
    return (
      <div className={classes.space} key={pr.ruleId}>
        <ExpandablePolicyCard
          policyRule={pr}
          actions={actions}
          subjects={subjects}
          rules={policyRules}
          setPolicyRules={setPolicyRules}
          resourceId={resourceId ?? ''}
          resourceType={resourceType}
          handleCloneRule={() => handleCloneRule(i)}
          handleDeleteRule={() => {
            setVerificationModalOpen(true);
            setRuleIdToDelete(pr.ruleId);
          }}
          showErrors={
            showAllErrors || (showErrorsOnAllRulesAboveNew && policyRules.length - 1 !== i)
          }
          savePolicy={(rules: PolicyRuleCard[]) => handleSavePolicy(rules)}
          usageType={usageType}
        />
      </div>
    );
  });

  /**
   * Returns the rule ID to be used on the new element, and
   * updates the store of the next rule id
   */
  const getRuleId = () => {
    const idTaken: boolean = policyRules.map((p) => p.ruleId).includes(lastRuleId.toString());

    const currentRuleId = idTaken ? lastRuleId + 1 : lastRuleId;
    setLastRuleId(currentRuleId + 1);
    return currentRuleId;
  };

  /**
   * Handles adding of more cards
   */
  const handleAddCardClick = () => {
    setShowErrorsOnAllRulesAboveNew(true);

    const newResource: PolicyRuleResource[][] = [
      createNewPolicyResource(usageType, resourceType, resourceId),
    ];

    const newRule: PolicyRuleCard = {
      ...emptyPolicyRule,
      ruleId: getRuleId().toString(),
      resources: newResource,
    };

    const updatedRules: PolicyRuleCard[] = [...policyRules, ...[newRule]];

    setPolicyRules(updatedRules);
    handleSavePolicy(updatedRules);
  };

  /**
   * Duplicates a rule with all the content in it
   *
   * @param index the index of the rule to duplicate
   */
  const handleCloneRule = (index: number) => {
    const ruleToDuplicate: PolicyRuleCard = {
      ...policyRules[index],
      ruleId: getRuleId().toString(),
    };

    // Create a deep copy of the object so the objects don't share same object reference
    const deepCopiedRuleToDuplicate: PolicyRuleCard = deepCopy(ruleToDuplicate);

    const updatedRules = [...policyRules, deepCopiedRuleToDuplicate];
    setPolicyRules(updatedRules);
    handleSavePolicy(updatedRules);
  };

  /**
   * Deletes a rule from the list
   *
   * @param index the index of the rule to delete
   */
  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = [...policyRules];
    const indexToRemove = updatedRules.findIndex((a) => a.ruleId === ruleId);
    updatedRules.splice(indexToRemove, 1);
    setPolicyRules(updatedRules);

    // Reset
    setVerificationModalOpen(false);
    setRuleIdToDelete('0');

    handleSavePolicy(updatedRules);
  };

  /**
   * Handle the saving of the updated policy
   */
  const handleSavePolicy = (rules: PolicyRuleCard[]) => {
    const policyEditorRules: PolicyRule[] = rules.map((pr) =>
      mapPolicyRuleToPolicyRuleBackendObject(
        subjects,
        actions,
        pr,
        `${resourceType}:${usageType === 'app' ? 'example' : resourceId}:ruleid:${pr.ruleId}` // TODO - find out if ID should be hardcoded. Issue: #10893
      )
    );

    const updatedPolicy: Policy = {
      rules: policyEditorRules,
      requiredAuthenticationLevelEndUser: requiredAuthLevel,
      requiredAuthenticationLevelOrg: '3',
    };
    onSave(updatedPolicy);
  };

  return (
    <div>
      <div className={classes.alertWrapper}>
        <Alert severity='info'>
          {t('policy_editor.alert', {
            usageType:
              usageType === 'app'
                ? t('policy_editor.alert_app')
                : t('policy_editor.alert_resource'),
          })}
        </Alert>
      </div>
      <div className={classes.selectAuthLevelWrapper}>
        <div className={classes.selectAuthLevel}>
          <SelectAuthLevel
            value={requiredAuthLevel}
            setValue={(v) => setRequiredAuthLevel(v)}
            label={t('policy_editor.select_auth_level_label')}
            onBlur={() => handleSavePolicy(policyRules)}
          />
        </div>
      </div>
      <Heading size='xxsmall' className={classes.label} level={2}>
        {t('policy_editor.rules')}
      </Heading>
      {displayRules}
      <div className={classes.addCardButtonWrapper}>
        <CardButton buttonText={t('policy_editor.card_button_text')} onClick={handleAddCardClick} />
      </div>
      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        text={t('policy_editor.verification_modal_text')}
        closeButtonText={t('policy_editor.verification_modal_action_button')}
        actionButtonText={t('policy_editor.verification_modal_close_button')}
        onPerformAction={() => handleDeleteRule(ruleIdToDelete)}
      />
    </div>
  );
};
