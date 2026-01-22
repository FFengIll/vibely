# /specreview

Review specifications, design documents, or code by analyzing requirements, design quality, feasibility, implementation completeness, and potential issues or extensions.

## Usage

/specreview [target]

**Parameters:**
- `<spec-file-path>`: Path to spec document (markdown file in `./docs/spec/`)
- `<code-path>`: Path to code file or directory to review (will analyze design from code)
- Leave empty to review staged/unstaged changes

**Examples:**
- `/specreview ./docs/spec/20260105-feature.md` - Review a spec document
- `/specreview ./src/components/Button.tsx` - Review a component file
- `/specreview ./src/services/` - Review a service directory
- `/specreview` - Review current git changes

## Guidelines

### Review Dimensions

#### 1. **Requirements Understanding** 📋
- **Clarity**: Are requirements clearly defined and unambiguous?
- **Completeness**: Are all functional and non-functional requirements covered?
- **Consistency**: Do requirements conflict with each other?
- **Traceability**: Can each feature be traced to a user need?
- **Acceptance Criteria**: Are clear success criteria defined?

#### 2. **Design Quality** 🎨
- **Architecture**: Is the architectural approach sound and scalable?
- **Abstraction**: Are abstractions appropriate (not over/under-engineered)?
- **Separation of Concerns**: Is there clear separation between layers/modules?
- **Design Patterns**: Are appropriate patterns used correctly?
- **Data Models**: Are data structures well-defined and normalized?

#### 3. **Feasibility Analysis** ✅
- **Technical Feasibility**: Can this be built with current tech stack?
- **Resource Estimation**: Are time/complexity estimates realistic?
- **Dependencies**: Are external dependencies identified and available?
- **Risk Assessment**: Are technical risks identified and mitigated?
- **Integration Points**: Are API boundaries and integrations clear?

#### 4. **Implementation Coverage** 🛠️
- **Component Design**: Are components/modules well-defined?
- **Interface Definition**: Are APIs/interfaces specified?
- **Error Handling**: Are error scenarios and edge cases covered?
- **Testing Strategy**: Is there a plan for unit/integration/e2e tests?
- **Deployment**: Is deployment/CI/CD considered?

#### 5. **Potential Issues** ⚠️
- **Performance Bottlenecks**: Identify potential performance issues
- **Security Concerns**: Check for security vulnerabilities or risks
- **Scalability Limits**: Identify scaling constraints
- **Maintenance Burden**: Assess long-term maintainability
- **Technical Debt**: Note shortcuts or compromises

#### 6. **Extension Opportunities** 🚀
- **Future Enhancements**: Suggest natural extensions or phase 2 features
- **Reusable Components**: Identify components that could be abstracted
- **Platform Expansion**: Consider multi-platform or mobile potential
- **Integration Opportunities**: Suggest valuable third-party integrations
- **Feature Variations**: Propose alternative implementations or features

### Review Process

#### Case 1: Spec Document Provided

1. **Read Spec Document**
   - Read the spec file thoroughly
   - Identify the type: feature, architecture, refactor, etc.

2. **Cross-Reference Code** (if implementation exists)
   - Use `Glob` and `Read` to find related implementation files
   - Compare spec against actual code
   - Identify gaps between design and implementation

3. **Analyze Architecture Cache**
   - Check `./docs/arch/*-arch.md` for relevant architecture context
   - Ensure new spec aligns with existing architecture

4. **Evaluate Each Dimension**
   - Score each dimension (1-5 scale)
   - Provide specific evidence and examples
   - Reference spec sections and code locations

#### Case 2: Only Code Provided

1. **Explore Codebase**
   - Use `Glob` to find relevant files in the target path
   - Read key files to understand the implementation
   - Identify the component/module's purpose and boundaries

2. **Reverse-Engineer Design**
   - Infer requirements from what the code does
   - Identify the architectural patterns used
   - Map out data flows and dependencies
   - Understand the problem being solved

3. **Analyze Implementation Quality**
   - Assess code organization and structure
   - Check for separation of concerns
   - Evaluate abstraction levels
   - Review error handling and edge cases

4. **Identify Implicit Requirements**
   - What user need does this code address?
   - What constraints is it working under?
   - What assumptions does it make?

5. **Evaluate Each Dimension**
   - Score each dimension (1-5 scale)
   - Base assessment on code analysis
   - Identify what's explicit vs implicit in design

#### Common Steps (Both Cases)

1. **Check Architecture Context**
   - Search `./docs/arch/*-arch.md` for relevant context
   - Understand how this fits into the larger system

2. **Synthesize Findings**
   - Prioritize issues by impact
   - Balance criticism with acknowledgment of good design
   - Provide actionable recommendations

3. **Generate Report**
   - Use the output format below
   - Include specific file references and line numbers
   - Provide concrete examples and suggestions

### Language/Framework Context

#### Frontend (React/Vue/etc.)
- Component hierarchy and prop drilling
- State management approach
- Performance (rendering, bundle size)
- Accessibility considerations
- Responsive design
- Type safety (TypeScript)

#### Backend (Go/Node/etc.)
- API design (REST/GraphQL/gRPC)
- Database schema and queries
- Authentication/authorization
- Rate limiting and throttling
- Caching strategy
- Error handling and logging

#### Infrastructure
- Database selection and scaling
- Caching layer (Redis, etc.)
- Message queues for async work
- CDN and asset delivery
- Monitoring and observability
- Disaster recovery

## Output Format

```markdown
## Spec/Code Review: [name]

**Target**: [spec-path or code-path]
**Review Type**: [Spec Document / Code Analysis / Git Changes]
**Review Date**: [timestamp]

---

### 📊 Overall Assessment
**Score**: [X/5]
**Verdict**: [Ready / Needs Revision / Major Concerns]

**Summary**: [2-3 sentence overview]

---

### 📋 Requirements Understanding
**Score**: [X/5]

**Inferred/Explicit Requirements**:
- [key requirement 1]
- [key requirement 2]

**Strengths**:
- [clear, well-defined aspects]

**Concerns**:
- [ambiguous or missing aspects]

**Recommendations**:
- [specific improvements]

---

### 🎨 Design Quality
**Score**: [X/5]

**Architecture**:
- [assessment of architectural approach]
- [file:line reference if applicable]

**Abstractions**:
- [evaluation of component/module abstractions]
- [specific examples]

**Data Flow**:
- [how data moves through the system]

**Recommendations**:
- [design improvements]

---

### ✅ Feasibility Analysis
**Score**: [X/5]

**Technical Feasibility**: [assessment]

**Risks Identified**:
- [risk 1 with mitigation strategy]
- [risk 2 with mitigation strategy]

**Estimated Complexity**: [Low/Medium/High]

**Dependencies**:
- [external dependencies identified]

---

### 🛠️ Implementation Coverage
**Score**: [X/5]

**Code Organization**: [assessment]

**API/Interface Definition**: [assessment]

**Error Handling**: [assessment]

**Testing Coverage**:
- [what tests exist / what's missing]

**Gaps Identified**:
- [missing implementation details]
- [edge cases not handled]

---

### ⚠️ Potential Issues

**Performance**:
- [performance concerns with file:line]

**Security**:
- [security concerns with file:line]

**Scalability**:
- [scaling concerns]

**Maintenance**:
- [maintainability concerns]

**Other**:
- [additional concerns]

---

### 🚀 Extension Opportunities

1. **[Extension 1]**
   - Description: [what it adds]
   - Value: [user/business value]
   - Effort: [Low/Medium/High]

2. **[Extension 2]**
   - Description: [what it adds]
   - Value: [user/business value]
   - Effort: [Low/Medium/High]

---

### ✍️ Action Items

- [1] 🚨 [critical issue 1] ([file:line](file))
- [2] 🚨 [critical issue 2] ([file:line](file))
- [3] ⚠️ [important improvement 1] ([file:line](file))
- [4] ⚠️ [important improvement 2] ([file:line](file))
- [5] 💡 [enhancement 1]
- [6] 💡 [enhancement 2]

---

**💡 Tip**: Use issue numbers `[1]`, `[2]`, `[3]`... to request specific fixes or improvements
**Legend**: 🚨 Must Fix | ⚠️ Should Address | 💡 Nice to Have

---

### 💬 Final Thoughts

[summary paragraph with overall recommendation and key takeaways]
```

## Tips

- **Be Specific**: Reference exact sections of specs and code files with line numbers
- **Be Constructive**: Balance criticism with recognition of good design
- **Think Long-term**: Consider maintenance, scaling, and evolution
- **Stay Practical**: Focus on actionable improvements, not theoretical perfection
- **Context-Aware**: Consider team size, timeline, and project constraints
- **Cross-Reference**: Link to architecture docs, related specs, or code examples
- **When No Spec**: Infer requirements and design intent from the code itself
- **Use Architecture Cache**: Check `./docs/arch/*-arch.md` for system context
