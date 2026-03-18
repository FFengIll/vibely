# /verify

/verify validates that the implementation matches the specification requirements. This is a critical phase that ensures what was built is what was specified.

**Purpose**: Verify implementation matches spec requirements

## Usage

```
/sdlc verify [spec_file]
```

**Arguments:**
- `spec_file`: Path to spec document (optional - auto-detects latest spec if not provided)

**Examples:**
- `/sdlc verify` - Verify against the latest spec
- `/sdlc verify docs/spec/20260308-user-auth.md` - Verify against specific spec

## Verification Process

### 1. Locate Spec
- Find the relevant spec document in `docs/spec/`
- If not provided, use the most recent spec by date
- Confirm spec with user if ambiguous

### 2. Parse Requirements
Extract from spec:
- Functional requirements
- API endpoints/contracts
- Data models/types
- Business logic rules
- Integration points

### 3. Verify Implementation
Check for each requirement:
- [x] Code implements the requirement
- [x] API matches specification
- [x] Data structures match
- [x] Business logic correct
- [x] Integrations in place

## Verification Categories

### Requirements Coverage
Check that each spec requirement is implemented.

**Output example**:
```
━━━ Requirements Coverage ━━━
✓ User registration        [IMPLEMENTED] src/auth/register.ts
✓ User login               [IMPLEMENTED] src/auth/login.ts
✓ Password reset           [IMPLEMENTED] src/auth/reset.ts
✓ Email verification       [IMPLEMENTED] src/auth/verify.ts
✗ Session management       [NOT FOUND]
```

### API Verification
Verify API endpoints match spec contracts.

**Output example**:
```
━━━ API Verification ━━━
✓ POST /api/auth/register  [MATCHES SPEC]
  Request: RegisterDTO
  Response: AuthResponse
✓ POST /api/auth/login     [MATCHES SPEC]
  Request: LoginDTO
  Response: AuthResponse
✓ POST /api/auth/reset     [MATCHES SPEC]
  Request: ResetDTO
  Response: SuccessResponse
✓ POST /api/auth/verify    [MATCHES SPEC]
  Request: VerifyDTO
  Response: SuccessResponse
✗ GET /api/auth/session    [NOT IMPLEMENTED]
✗ DELETE /api/auth/session [NOT IMPLEMENTED]
```

### Data Model Verification
Ensure data structures match spec definitions.

**Output example**:
```
━━━ Data Model Verification ━━━
✓ User interface
  - id: UUID (matches spec)
  - email: string (matches spec)
  - passwordHash: string (matches spec)
  - createdAt: Date (matches spec)
✓ AuthResponse interface
  - user: User (matches spec)
  - token: string (matches spec)
  - refreshToken: string (matches spec)
⚠ Session interface
  - Missing 'expiresAt' field (spec requires it)
```

### Business Logic Verification
Verify business rules are correctly implemented.

**Output example**:
```
━━━ Business Logic Verification ━━━
✓ Password hashing
  - Uses bcrypt with salt rounds 10 (matches spec)
✓ Token expiration
  - Access token: 15 minutes (matches spec)
  - Refresh token: 7 days (matches spec)
✓ Email verification
  - Sends verification email (matches spec)
  - Expires in 24 hours (matches spec)
⚠ Rate limiting
  - Partially implemented
  - Missing per-IP limits (spec requires)
```

## Full Verification Report Example

```
Verifying implementation against spec...

━━━ Spec Document ━━━
./docs/spec/20260308-user-auth.md

━━━ Requirements Coverage ━━━
4/5 requirements implemented (80%)

✓ User registration        [IMPLEMENTED] src/auth/register.ts
✓ User login               [IMPLEMENTED] src/auth/login.ts
✓ Password reset           [IMPLEMENTED] src/auth/reset.ts
✓ Email verification       [IMPLEMENTED] src/auth/verify.ts
✗ Session management       [NOT FOUND]

━━━ API Verification ━━━
3/5 API endpoints implemented (60%)

✓ POST /api/auth/register  [MATCHES SPEC]
✓ POST /api/auth/login     [MATCHES SPEC]
✓ POST /api/auth/reset     [MATCHES SPEC]
✗ GET /api/auth/session    [NOT IMPLEMENTED]
✗ DELETE /api/auth/session [NOT IMPLEMENTED]

━━━ Data Model Verification ━━━
2/3 models match specification (67%)

✓ User interface [MATCHES]
✓ AuthResponse interface [MATCHES]
⚠ Session interface [INCOMPLETE]
  - Missing: expiresAt field

━━━ Business Logic Verification ━━━
大部分业务逻辑已实现

✓ Password hashing (bcrypt, salt rounds 10)
✓ Token expiration (15min / 7 days)
✓ Email verification (24hr expiry)
⚠ Rate limiting (partial - missing per-IP limits)

━━━ Missing Implementation ━━━
Required by spec but not found:

1. Session Management
   Missing endpoints:
   - GET /api/auth/session (获取当前会话)
   - DELETE /api/auth/session (注销会话)

   Missing fields:
   - Session.expiresAt

2. Rate Limiting
   - Per-IP rate limits not implemented

━━━ Action Items ━━━
Priority - HIGH:
1. Implement session management
   - Add GET /api/auth/session endpoint
   - Add DELETE /api/auth/session endpoint
   - Add expiresAt to Session interface

Priority - MEDIUM:
2. Complete rate limiting
   - Add per-IP rate limiting
   - Document rate limits in API spec

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICATION FAILED ✗
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
- Requirements: 4/5 (80%)
- APIs: 3/5 (60%)
- Data Models: 2/3 (67%)
- Business Logic: 3/4 (75%)
```

## Verification Output

**Always save verification reports** to `docs/verify/YYYYMMDD-[name]-verification.md` where:
- `YYYYMMDD` - Current date timestamp
- `[name]` - Feature or component name

## Best Practices

### Verification Strategy
- **Systematic**: Check requirements one by one
- **Evidence-based**: Point to specific code locations
- **Clear reporting**: Use visual indicators (✓ ⚠ ✗)
- **Actionable**: Provide specific next steps for gaps

### Handling Gaps
- **Critical gaps**: Block progression, must be fixed
- **Partial implementation**: Document what's missing
- **Deviations**: Note if implementation differs from spec (may be OK if discussed)

### Spec Updates
If implementation is valid but spec is wrong:
- Document the deviation
- Suggest spec update
- Get approval before changing spec

## Completion Conditions

- [ ] All requirements verified against spec
- [ ] Verification report saved to `docs/verify/`
- [ ] Gaps documented with specific file references
- [ ] Action items prioritized
- [ ] Either:
  - [ ] All requirements implemented (PASS), or
  - [ ] Gaps documented and acknowledged (FAIL with action plan)

## State Integration

- **Updates**: `sdlc.phase` = `verify`
- **Creates**: Verification report in `docs/verify/`
- **Reads**: Spec document from `docs/spec/`
- **Requires**: `test` phase completed (tests passing)
- **Next**: Proceed to `/sdlc secure` phase

## Related Skills

- `/sdlc spec` - Specification document being verified against
- `/sdlc test` - Prerequisite: tests must pass before verification
- `/sdlc secure` - Next phase after verification passes
