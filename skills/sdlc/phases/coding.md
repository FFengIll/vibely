# Coding Phase Skill

Provides implementation guidance and support based on specification documents.

## Usage

```
/sdlc coding [spec_file?]
```

If no spec file is provided, the skill will look for the most recent spec in docs/spec/.

## Description

The coding phase skill guides implementation work based on specification documents. It provides coding guidance, helps break down implementation tasks, ensures adherence to the specification, and supports best practices. **Note:** This skill provides guidance and support - actual coding is done by the developer.

### When to Use

- After specification is approved and ready for implementation
- When starting implementation work
- For guidance on implementing specific components
- To ensure implementation matches specification
- When encountering implementation questions

## Process

1. **Review Specification**
   - Load and analyze the spec document
   - Understand requirements and constraints
   - Identify key components and dependencies

2. **Plan Implementation**
   - Break down into logical implementation tasks
   - Identify dependencies between tasks
   - Suggest implementation order
   - Estimate complexity

3. **Provide Implementation Guidance**
   - Explain technical approach for each component
   - Provide code structure recommendations
   - Suggest patterns and best practices
   - Identify potential pitfalls

4. **Support Development**
   - Answer implementation questions
   - Review code against specification
   - Suggest tests to implement
   - Help troubleshoot issues

## Implementation Guidance Structure

### Overview

**Specification:** [Spec title and reference]
**Implementation Scope:** [What will be implemented in this session]

---

### Implementation Tasks

#### Task 1: [Task Title]
**Description:** [What this task accomplishes]
**File(s):** [Files that need to be created/modified]
**Complexity:** Low | Medium | High

**Guidance:**
[Technical approach, code structure, patterns to use]

**Key Points:**
- [Important consideration 1]
- [Important consideration 2]

**Dependencies:** [What needs to be done first]

**Acceptance Criteria:**
- [Criteria 1]
- [Criteria 2]

---

#### Task 2: [Task Title]
[...]

---

### Technical Approach

#### [Component/Feature A]

**Purpose:** [What this component does]

**Suggested Structure:**
```
[Directory/file structure]
```

**Key Implementation Details:**
- [Detail 1]
- [Detail 2]
- [Detail 3]

**Code Example (if helpful):**
```typescript
// Example pattern or structure
```

**Considerations:**
- [Performance consideration]
- [Error handling approach]
- [Testing approach]

#### [Component/Feature B]
[...]

---

### Data Structures

**From Spec:**
```typescript
// Data structures from specification
```

**Implementation Notes:**
- [Notes on how to implement]
- [Validation implementation]
- [Type safety considerations]

---

### API Implementation

#### [Endpoint/Method]

**Specification:**
```typescript
interface RequestType {
  // request structure
}

interface ResponseType {
  // response structure
}
```

**Implementation Guidance:**
- [Framework/route setup]
- [Validation approach]
- [Error handling]
- [Business logic placement]
- [Response formatting]

**Example Implementation Pattern:**
```typescript
// Suggested pattern
```

---

### State Management

**Global State:**
```typescript
// State structure from spec
```

**Implementation Approach:**
- [State management library to use]
- [Where to define state]
- [How to update state]
- [How to access state]

**Local State:**
- [Component A]: [Approach]
- [Component B]: [Approach]

---

### Error Handling

**From Spec:**
```typescript
// Error types from spec
```

**Implementation Guidance:**
- [Where to catch errors]
- [How to format errors]
- [How to log errors]
- [User-facing error messages]
- [Recovery strategies]

---

### Testing Strategy

**Unit Tests:**
- [What to test]
- [Test framework suggestions]
- [Example test structure]

**Integration Tests:**
- [Test scenarios]
- [Setup requirements]

**E2E Tests:**
- [Critical flows]
- [Test tools]

**Example Test:**
```typescript
// Example test
```

---

### Development Workflow

**Recommended Order:**
1. [Phase 1 - Foundation]
   - [Task 1.1]
   - [Task 1.2]

2. [Phase 2 - Core Features]
   - [Task 2.1]
   - [Task 2.2]

3. [Phase 3 - Integration]
   - [Task 3.1]
   - [Task 3.2]

**Branching Strategy:**
- [Branch name suggestions]
- [Commit message guidelines]

---

### Common Patterns

**Pattern 1: [Pattern Name]**
```typescript
// Example usage
```
**When to use:** [Use cases]

**Pattern 2: [Pattern Name]**
[...]

---

### Gotchas and Considerations

- [Potential issue 1 and how to avoid]
- [Potential issue 2 and how to avoid]
- [Performance optimization]
- [Security consideration]

---

### Dependencies

**External Packages:**
- `package-name`: [Purpose, version considerations]

**Internal Modules:**
- [Module to import and how to use it]

---

### Next Steps

After implementation:
1. [Testing checklist]
2. [Code review items]
3. [Documentation updates]
4. [Deployment considerations]

## Completion Checklist

For Each Implementation Task:
- [ ] Specification reviewed and understood
- [ ] Implementation tasks identified
- [ ] Technical approach provided
- [ ] Code structure recommended
- [ ] Edge cases identified
- [ ] Error handling strategy provided
- [ ] Testing approach suggested
- [ ] Dependencies noted

Developer Implementation:
- [ ] Code written following guidance
- [ ] Types/interfaces match spec
- [ ] Error handling implemented
- [ ] Tests written
- [ ] Code reviewed against spec
- [ ] Documentation updated

## Examples

### Example 1: Feature Implementation

```
/sdlc coding docs/spec/user-profile-management.md
```

Would provide guidance for:
- Setting up API routes for profile CRUD
- Implementing profile data validation
- Creating profile upload handler
- Building profile settings UI components
- Writing tests for profile operations

### Example 2: API Implementation

```
/sdlc coding docs/spec/payment-api.md
```

Would guide:
- Setting up payment intent endpoints
- Implementing webhook signature verification
- Creating payment status polling
- Error handling for payment failures
- Logging and monitoring setup

### Example 3: No Spec File

```
/sdlc coding
```

Would:
- Find the most recent spec in docs/spec/
- Provide guidance based on that spec
- Ask for clarification if multiple specs exist

## Interactive Support

During implementation, you can ask follow-up questions:

**"How do I implement [specific feature]?"**
Provides detailed guidance for that feature

**"What's the best way to handle [edge case]?"**
Suggests approaches based on the spec

**"Does this match the specification?"**
Reviews code against spec requirements

**"What tests should I write for [component]?"**
Suggests test cases and structure

**"I'm getting this error: [error details]"**
Helps troubleshoot implementation issues

## Integration

This skill is the third phase in the SDLC workflow:

1. **Research Phase** (/sdlc research) - Gather information and options
2. **Spec Phase** (/sdlc spec) - Create detailed specification
3. **Coding Phase** (this skill) - Implement based on spec

The coding phase bridges the gap between specification and implementation, ensuring that development work follows the planned approach while providing flexibility for implementation decisions.

## Related Skills

- **doc.md** - Used to review specification document
- **pencil.md** - May be used to create implementation diagrams
- **spec.md** - Previous phase: provides the specification to implement
- **research.md** - First phase: provides context for technical decisions

## Tips for Developers

- Read through the full guidance before starting implementation
- Follow the suggested task order to handle dependencies properly
- Refer back to the spec document for detailed requirements
- Ask questions when uncertain about approach
- Test incrementally rather than implementing everything at once
- Keep code aligned with data structures defined in the spec
- Update the spec if requirements change during implementation
- Document any deviations from the spec with rationale

## Tips for Getting the Best Guidance

- Provide the specific spec file if you have multiple specs
- Mention your experience level (beginner/intermediate/advanced)
- Share relevant code snippets if you're stuck
- Describe what you've tried so far
- Specify any constraints (time, performance, etc.)
- Mention your tech stack if not obvious from the spec
