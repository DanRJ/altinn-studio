import {
  mapPolicySubjectToSubjectTitle,
  mapResourceFromBackendToResource,
  mapPolicyRulesBackendObjectToPolicyRuleCard,
  mapSubjectTitleToSubjectString,
  mapPolicyRuleToPolicyRuleBackendObject,
  createNewPolicyResource,
  mergeActionsFromPolicyWithActionOptions,
  mergeSubjectsFromPolicyWithSubjectOptions,
  convertSubjectStringToSubjectId,
  createNewSubjectFromSubjectString,
  convertSubjectStringToSubjectSource,
  findSubjectByPolicyRuleSubject,
} from './index';
import {
  mockAction1,
  mockAction2,
  mockAction3,
  mockAction4,
  mockActions,
  mockPolicyResourceBackendString1,
  mockPolicyRule1,
  mockPolicyRuleCard1,
  mockPolicyRuleCards,
  mockPolicyRules,
  mockResource11,
  mockResource3,
  mockResourceType1,
  mockResourecId1,
  mockRuleId1,
  mockSubject1,
  mockSubject2,
  mockSubject3,
  mockSubjectBackendString1,
  mockSubjectBackendString3,
  mockSubjectId1,
  mockSubjectTitle1,
  mockSubjectTitle3,
  mockSubjects,
} from '../data-mocks';
import type { PolicySubject } from '../types';

describe('PolicyEditorUtils', () => {
  describe('mapPolicySubjectToSubjectTitle', () => {
    it('should map policy subjects to subject titles', () => {
      const mockBackendPolicySubjects: string[] = [
        mockSubjectBackendString1,
        mockSubjectBackendString3,
      ];
      const result = mapPolicySubjectToSubjectTitle(mockSubjects, mockBackendPolicySubjects);

      expect(result).toEqual([mockSubjectTitle1, mockSubjectTitle3]);
    });
  });

  describe('mapResourceFromBackendToResource', () => {
    it('should map a resource string to a resource object', () => {
      const result = mapResourceFromBackendToResource(mockPolicyResourceBackendString1);

      expect(result).toEqual({ type: mockResourceType1, id: mockResourecId1 });
    });
  });

  describe('mapPolicyRulesBackendObjectToPolicyRuleCard', () => {
    it('should map policy rules from backend to policy rule cards', () => {
      const result = mapPolicyRulesBackendObjectToPolicyRuleCard(
        mockSubjects,
        mockActions,
        mockPolicyRules,
      );
      expect(result).toEqual(mockPolicyRuleCards);
    });
  });

  describe('mapSubjectTitleToSubjectString', () => {
    it('should map a subject title to a subject string', () => {
      const result = mapSubjectTitleToSubjectString(mockSubjects, mockSubjectTitle1);

      expect(result).toBe(mockSubjectBackendString1);
    });

    it('should return nothing when there is no subject matching the subject title', () => {
      const result = mapSubjectTitleToSubjectString(mockSubjects, 'invalidTitle');
      expect(result).toBe(undefined);
    });
  });

  describe('mapPolicyRuleToPolicyRuleBackendObject', () => {
    it('should map a policy rule card to a policy rule backend object', () => {
      const result = mapPolicyRuleToPolicyRuleBackendObject(
        mockSubjects,
        mockPolicyRuleCard1,
        mockRuleId1,
      );

      expect(result).toEqual(mockPolicyRule1);
    });
  });

  describe('createNewPolicyResource', () => {
    it('should create a new policy resource with "resourcetype" and "resourceid" for usagetype resource', () => {
      const result = createNewPolicyResource('resource', mockResourceType1, mockResourecId1);

      expect(result).toEqual([mockResource11]);
    });

    it('should create a new policy resource with "org" and "app" for usagetype app', () => {
      const result = createNewPolicyResource('app', mockResourceType1, '');

      expect(result).toEqual(mockResource3);
    });
  });

  describe('mergeActionsFromPolicyWithActionOptions', () => {
    it('merges actions from policy rules with existing action options', () => {
      const mergedActions = mergeActionsFromPolicyWithActionOptions(
        [mockPolicyRule1],
        [mockAction3],
      );

      expect(mergedActions).toHaveLength(4);
      expect(mergedActions.map((action) => action.actionId)).toEqual([
        mockAction3.actionId,
        mockAction1.actionId,
        mockAction2.actionId,
        mockAction4.actionId,
      ]);
    });
  });

  describe('mergeSubjectsFromPolicyWithSubjectOptions', () => {
    it('merges subjects from policy rules with existing subject options', () => {
      const mergedSubjects = mergeSubjectsFromPolicyWithSubjectOptions(
        [mockPolicyRule1],
        [mockSubject2],
      );

      expect(mergedSubjects).toHaveLength(3);
      expect(mergedSubjects.map((subject) => subject.subjectId)).toEqual([
        mockSubject2.subjectId,
        mockSubject1.subjectId,
        mockSubject3.subjectId,
      ]);
    });
  });

  describe('convertSubjectStringToSubjectId', () => {
    it('converts subject string to subject ID correctly', () => {
      const subjectId = convertSubjectStringToSubjectId(mockSubjectBackendString1);

      expect(subjectId).toBe(mockSubject1.subjectId);
    });
  });

  describe('createNewSubjectFromSubjectString', () => {
    it('creates a new subject from subject string correctly', () => {
      const newSubject = createNewSubjectFromSubjectString(mockSubjectBackendString1);

      expect(newSubject).toEqual({
        ...mockSubject1,
        subjectSource: mockSubject1.subjectSource,
        subjectTitle: mockSubject1.subjectId,
      });
    });
  });

  describe('convertSubjectStringToSubjectSource', () => {
    it('converts subject string to subject source correctly', () => {
      const subjectSource = convertSubjectStringToSubjectSource(mockSubjectBackendString1);
      expect(subjectSource).toBe(mockSubject1.subjectSource);
    });
  });

  describe('findSubjectByPolicyRuleSubject', () => {
    it('returns a subject when the policy rule subject is in the subject options list', () => {
      const subject: PolicySubject = findSubjectByPolicyRuleSubject(mockSubjects, mockSubjectId1);
      expect(subject.subjectTitle).toEqual(mockSubjectTitle1);
      expect(subject.subjectId).toEqual(mockSubjectId1);
    });

    it('returns undefined when the policy rule subject is not in the subject options list', () => {
      const subject: PolicySubject = findSubjectByPolicyRuleSubject(mockSubjects, 's4');
      expect(subject).toEqual(undefined);
    });
  });
});
