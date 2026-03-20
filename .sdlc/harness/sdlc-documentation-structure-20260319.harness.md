# SDLC Documentation Structure - Verification Harness

**Date**: 2026-03-19
**Criticality**: HIGH (System Integrity)
**Scope**: Complete SDLC documentation structure and conventions
**Version**: 2.0 (Three-Level Structure)

## Overview

This harness defines the invariant properties and validation rules for the SDLC documentation system. The system uses a **three-level structure** where each level has a distinct purpose and naming convention.

**Purpose**: Validate that the SDLC documentation system maintains proper separation of concerns, consistent naming, and clear discoverability.

**Structure Philosophy:**
- **`docs/`** - Working documents (ephemeral, process-oriented)
- **`harness/`** - Verification harnesses (persistent constraints)
- **`arch/`** - Architecture cache (performance optimization)

---

## Invariants

### INV-001: Three-Level Separation
**MUST hold**: `.sdlc/` contains exactly THREE top-level documentation directories.

**Validation:**
- [ ] `docs/` exists - for working documents
- [ ] `harness/` exists - for verification harnesses
- [ ] `arch/` exists - for architecture cache
- [ ] NO other top-level documentation directories

**Dependency**: File System Structure → Documentation Organization

**Failure Impact**: HIGH - Breaks system design and discoverability

### INV-002: Docs Directory Flatness
**MUST hold**: `.sdlc/docs/` MUST be flat (NO subdirectories).

**Validation:**
- [ ] All files directly in `.sdlc/docs/`
- [ ] NO subdirectories like `spec/`, `cr/`, `test/`, etc.
- [ ] All files follow: `category-feature-date.type.md`

**Dependency**: Documentation Conventions → File Organization

**Failure Impact**: HIGH - Breaks discoverability

### INV-003: Harness Directory Flatness
**MUST hold**: `.sdlc/harness/` MUST be flat (NO subdirectories).

**Validation:**
- [ ] All files directly in `.sdlc/harness/`
- [ ] NO nested subdirectories
- [ ] All files follow: `category-feature-date.harness.md`

**Dependency**: Harness System → File Organization

**Failure Impact**: MEDIUM - Breaks harness discoverability

### INV-004: Arch Directory Flatness
**MUST hold**: `.sdlc/arch/` MUST be flat (NO subdirectories).

**Validation:**
- [ ] All cache files directly in `.sdlc/arch/`
- [ ] NO hierarchical subdirectories
- [ ] All files follow: `[scope]-date.arch.md`

**Dependency**: Cache System → File Organization

**Failure Impact**: MEDIUM - Breaks cache discoverability

### INV-005: Universal Type Suffix
**MUST hold**: Every file MUST have a type suffix before `.md`.

**Validation:**
- [ ] Working docs: `.spec.md`, `.cr.md`, `.test.md`, etc.
- [ ] Harnesses: `.harness.md`
- [ ] Cache: `.arch.md`
- [ ] NO files named just `category-feature-date.md`

**Examples:**
- ✅ `auth-user-login-20240319.spec.md`
- ✅ `auth-flow-invariants-20240319.harness.md`
- ✅ `overview-20240319.arch.md`
- ❌ `auth-user-login-20240319.md` (missing type)

**Dependency**: Naming Convention → File Identification

**Failure Impact**: HIGH - Breaks type filtering and identification

### INV-006: Date Format Consistency
**MUST hold**: Date MUST be YYYYMMDD format.

**Validation:**
- [ ] Date always 8 digits
- [ ] Date reflects creation date

**Format by Directory:**
- `docs/` and `harness/`: `category-feature-YYYYMMDD.type.md`
- `arch/`: `scope-YYYYMMDD.arch.md` (simplified - directory already isolated)

**Examples:**
- ✅ `auth-user-login-20240319.spec.md` (docs/)
- ✅ `auth-flow-invariants-20240319.harness.md` (harness/)
- ✅ `overview-20240319.arch.md` (arch/ - no category prefix)

**Rationale**: The `arch/` directory only contains `.arch.md` files, so the `arch-` category prefix is redundant. The directory provides the context.

**Dependency**: Naming Convention → Temporal Organization

**Failure Impact**: MEDIUM - Breaks sorting and filtering

### INV-007: Directory Placement Rules
**MUST hold**: Files go to their designated directory ONLY.

**Validation:**
- [ ] Working documents (spec, cr, test, etc.) → `docs/` ONLY
- [ ] Verification harnesses → `harness/` ONLY
- [ ] Architecture cache → `arch/` ONLY
- [ ] NO cross-placement (e.g., NO `docs/*.harness.md`)

**Dependency**: Purpose-Based Routing → File Location

**Failure Impact**: HIGH - Breaks system organization

---

## Usage Flows

### FLOW-001: Creating Working Documentation
**Entry**: User invokes phase command (`/sdlc spec`, `/sdlc cr`, etc.)

**Exit**: Document created in `.sdlc/docs/` with correct name

**Steps:**
1. Phase command invoked (e.g., `/sdlc spec "Add OAuth"`)
2. Extract metadata:
   - Category: from context or user (e.g., `auth`)
   - Feature: from title or context (e.g., `oauth-integration`)
   - Date: current date (e.g., `20240319`)
   - Type: from phase (e.g., `spec`)
3. Construct filename: `auth-oauth-integration-20240319.spec.md`
4. Create file in `.sdlc/docs/`

**Validation Points:**
- [ ] File created in `docs/` (NOT `harness/` or `arch/`)
- [ ] Filename has `.spec.md` suffix (NOT `.harness.md`)
- [ ] Category present and relevant
- [ ] Date in correct position

**Failure Modes:**
- Wrong directory → Reject, use correct directory
- Wrong suffix → Reject, use correct type suffix
- Missing date → Use current date

**Dependency Chain**: Phase Command → Metadata Extraction → Filename Construction → File Creation

### FLOW-002: Creating Verification Harness
**Entry**: User invokes `/sdlc harness [scope] [title]`

**Exit**: Harness created in `.sdlc/harness/` with correct name

**Steps:**
1. Harness command invoked
2. Extract metadata:
   - Category: from context (e.g., `auth`, `sdlc`)
   - Feature: from title (e.g., `flow-invariants`)
   - Date: current date (e.g., `20240319`)
   - Type: ALWAYS `harness`
3. Construct filename: `auth-flow-invariants-20240319.harness.md`
4. Create file in `.sdlc/harness/`

**Validation Points:**
- [ ] File created in `harness/` (NOT `docs/` or `arch/`)
- [ ] Filename has `.harness.md` suffix
- [ ] Category present (optional for system-wide harnesses)

**Dependency Chain**: Harness Command → Metadata Extraction → Filename Construction → File Creation

### FLOW-003: Creating Architecture Cache
**Entry**: User invokes `/sdlc understand [scope]`

**Exit**: Cache created in `.sdlc/arch/` with correct name

**Steps:**
1. Understand command invoked
2. Extract metadata:
   - Scope: from parameter (e.g., `auth`, `overview`)
   - Date: current date (e.g., `20240319`)
   - Type: ALWAYS `arch`
3. Construct filename: `scope-YYYYMMDD.arch.md`
   - Example: `overview-20240319.arch.md`
   - Example: `auth-20240319.arch.md`
   - Example: `auth-login-20240319.arch.md`
4. Create file in `.sdlc/arch/`

**Validation Points:**
- [ ] File created in `arch/` (NOT `docs/` or `harness/`)
- [ ] Filename has `.arch.md` suffix
- [ ] Format is `scope-date.arch.md` (NO category prefix needed)
- [ ] Scope identifies what is cached

**Note**: Arch files use simplified format `scope-date.arch.md` instead of `category-scope-date.type.md` because the `arch/` directory already provides type context.

**Dependency Chain**: Understand Command → Metadata Extraction → Filename Construction → File Creation

### FLOW-004: Finding Documentation by Type
**Entry**: User or AI needs documents of specific type

**Exit**: List of documents of requested type

**Steps:**
1. Determine target type (spec, harness, arch)
2. Select appropriate directory
3. Use glob pattern: `*.type.md`
4. Return sorted list (newest first)

**Validation Points:**
- [ ] Searches correct directory for type
- [ ] Pattern matches files with correct suffix
- [ ] No files from wrong directories included

**Dependency Chain**: Type Request → Directory Selection → Glob Pattern → Sorted Results

---

## Functional Constraints

### CONSTR-001: Filename Length
**MUST enforce**: Maximum filename length of 255 characters (OS limit).

**Validation:**
- [ ] `category-feature-date.type.md` ≤ 255 chars
- [ ] If exceeded, abbreviate feature description
- [ ] Preserve category, date, and type (never abbreviate)

### CONSTR-002: Type Suffix Uniqueness
**MUST enforce**: Each directory has ONLY one type of file.

**Validation:**
- [ ] `docs/` contains ONLY `*.spec.md`, `*.cr.md`, `*.test.md`, etc. (working docs)
- [ ] `harness/` contains ONLY `*.harness.md`
- [ ] `arch/` contains ONLY `*.arch.md`
- [ ] NO mixed types in any directory

### CONSTR-003: Category Format
**MUST enforce**: Category MUST be lowercase alphanumeric with hyphens.

**Validation:**
- [ ] Category is lowercase
- [ ] Category contains only letters, numbers, and hyphens
- [ ] Category is hyphenated if multi-word
- [ ] Category identifies module/domain

**Predefined Categories:**
- `sdlc` - SDLC system documentation
- `auth` - Authentication/authorization
- `payment` - Payment processing
- `user` - User management
- `api` - API endpoints
- `frontend` - Frontend components
- `backend` - Backend services
- `infra` - Infrastructure
- `tools` - Development tools
- `vibely` - Vibely-specific
- `tingly` - Tingly-specific

### CONSTR-004: Date Validity
**MUST enforce**: Date MUST be valid and in position 3.

**Validation:**
- [ ] Exactly 8 digits
- [ ] Valid month (01-12)
- [ ] Valid day for month
- [ ] Not in the future (unless for planning)

### CONSTR-005: Feature Description Format
**MUST enforce**: Feature MUST be kebab-case and descriptive.

**Validation:**
- [ ] Only lowercase letters, numbers, and hyphens
- [ ] No leading/trailing hyphens
- [ ] Descriptive enough to identify content
- [ ] Meaningful keywords included

---

## Dependency Chains

### DEP-001: Document Creation Lifecycle
**Trigger**: Any SDLC phase command invoked

**MUST cascade:**
1. Command parsed (phase identified)
2. Type determined from phase
3. Directory determined from type (docs/harness/arch)
4. Category inferred from context
5. Feature description generated
6. Date obtained
7. Filename constructed
8. File created in correct directory

**Validation Order:**
- [ ] Phase recognized
- [ ] Type mapped correctly
- [ ] Directory selected correctly
- [ ] Filename constructed
- [ ] File created in correct location
- [ ] File has correct suffix

**Criticality**: HIGH (Core functionality)

### DEP-002: Type-Based Discovery
**Trigger**: Search/query for documentation

**MUST cascade:**
1. Target type specified (spec/harness/arch)
2. Directory mapped from type
3. Glob pattern constructed
4. File system queried
5. Results filtered and sorted
6. Documents returned

**Validation Order:**
- [ ] Type mapped to correct directory
- [ ] Glob pattern valid
- [ ] File system accessible
- [ ] Results include all matches
- [ ] Sorting correct (date descending)

**Criticality**: HIGH (Discoverability)

### DEP-003: Cross-Directory Separation
**Trigger**: Any file operation

**MUST maintain:**
1. Working docs stay in `docs/`
2. Harnesses stay in `harness/`
3. Cache stays in `arch/`
4. NO migration between directories (except by explicit migration)
5. NO file serves dual purposes

**Validation Order:**
- [ ] Each file has ONE purpose
- [ ] Each file in ONE directory
- [ ] NO symlinks between directories
- [ ] NO file appears in multiple locations

**Criticality**: HIGH (System integrity)

---

## Negative Cases

### NEG-001: Prevent Directory Proliferation
**MUST NOT allow:**
- [ ] Creating subdirectories in `docs/` (e.g., `docs/spec/`)
- [ ] Creating subdirectories in `harness/` (e.g., `harness/auth/`)
- [ ] Creating subdirectories in `arch/` (e.g., `arch/module/`)
- [ ] Creating new top-level directories

**Enforcement:**
- Phase skills MUST create files directly in designated directories
- Reject any attempt to create subdirectories
- Use category in filename instead of subdirectory

### NEG-002: Prevent Type Suffix Confusion
**MUST NOT allow:**
- [ ] Wrong type suffix (e.g., `spec` in `harness/`)
- [ ] Missing type suffix (e.g., `feature-date.md`)
- [ ] Multiple type suffixes (e.g., `spec.harness.md`)
- [ ] Wrong type in wrong directory (e.g., `*.harness.md` in `docs/`)

**Enforcement:**
- Validate type suffix on file creation
- Validate directory matches type
- Reject files not following pattern
- Auto-correct when possible

### NEG-003: Prevent Cross-Purpose Files
**MUST NOT allow:**
- [ ] Working doc in `harness/` (harnesses are special)
- [ ] Harness in `docs/` (harnesses need visibility)
- [ ] Cache in `docs/` (cache is internal)
- [ ] Any file serving dual purposes

**Enforcement:**
- Clear purpose for each directory
- Phase skills know their output directory
- Validation on file creation

---

## Validation Checklist

### System-Level Validation
- [ ] Three directories exist: `docs/`, `harness/`, `arch/`
- [ ] NO other top-level documentation directories
- [ ] Each directory is flat (NO subdirectories)
- [ ] Each directory has unique file type

### File Creation Validation
- [ ] Correct directory selected for file type
- [ ] Filename follows `category-feature-date.type.md` format
- [ ] Type suffix matches directory purpose
- [ ] Date is valid and in correct position

### Directory Structure Validation
- [ ] `docs/` contains ONLY `*.spec.md`, `*.cr.md`, `*.test.md`, etc.
- [ ] `harness/` contains ONLY `*.harness.md`
- [ ] `arch/` contains ONLY `*.arch.md`
- [ ] NO mixed types in any directory

### Naming Convention Validation
- [ ] All files have category (or scope for arch)
- [ ] All files have date in YYYYMMDD format
- [ ] All files have type suffix
- [ ] Hyphens used correctly (kebab-case)

### Access Validation
- [ ] Can find files by type (`*.spec.md`)
- [ ] Can find files by category (`auth-*.md`)
- [ ] Can find files by date sorting
- [ ] Directories are discoverable and browsable

---

## Test Cases

### TC-001: Create Spec Document
**Input**: `/sdlc spec "Add OAuth to auth system"`

**Expected Output**:
- File created: `.sdlc/docs/auth-oauth-integration-YYYYMMDD.spec.md`
- File in `docs/` directory
- Filename has `.spec.md` suffix

**Verification**:
```bash
ls .sdlc/docs/auth-oauth-integration-*.spec.md
# Should return exactly one file
ls .sdlc/harness/auth-oauth-integration-*.spec.md
# Should return empty (not in harness/)
```

### TC-002: Create Verification Harness
**Input**: `/sdlc harness auth "Authentication Flow Invariants"`

**Expected Output**:
- File created: `.sdlc/harness/auth-flow-invariants-YYYYMMDD.harness.md`
- File in `harness/` directory
- Filename has `.harness.md` suffix

**Verification**:
```bash
ls .sdlc/harness/auth-flow-invariants-*.harness.md
# Should return exactly one file
ls .sdlc/docs/auth-flow-invariants-*.harness.md
# Should return empty (not in docs/)
```

### TC-003: Create Architecture Cache
**Input**: `/sdlc understand auth`

**Expected Output**:
- File created: `.sdlc/arch/auth-YYYYMMDD.arch.md`
- File in `arch/` directory
- Filename has `.arch.md` suffix

**Verification**:
```bash
ls .sdlc/arch/auth-*.arch.md
# Should return cache file
ls .sdlc/docs/auth-*.arch.md
# Should return empty (not in docs/)
```

### TC-004: Filter by Type
**Input**: Find all spec documents

**Expected Output**:
```bash
ls .sdlc/docs/*.spec.md
# Returns all specs, no harnesses, no cache
```

**Verification**:
- Only `.spec.md` files returned
- No files from `harness/` or `arch/`
- All in correct directory

### TC-005: Filter by Category
**Input**: Find all auth-related documents

**Expected Output**:
```bash
ls .sdlc/docs/auth-*.md .sdlc/harness/auth-*.md
# Returns all auth docs across docs and harness
```

**Verification**:
- Files starting with `auth-` from both directories
- No arch files included
- Type suffixes preserved

---

## Implementation Notes

### Phase Skills Configuration
All phase skills MUST be configured to:

1. **Know their output directory**:
   - Working doc phases → `docs/`
   - Harness phase → `harness/`
   - Understand phase → `arch/`

2. **Use correct type suffix**:
   - Spec phase → `.spec.md`
   - CR phase → `.cr.md`
   - Test phase → `.test.md`
   - Harness phase → `.harness.md`
   - Understand phase → `.arch.md`

3. **Validate on creation**:
   - Check directory matches type
   - Check filename format
   - Reject malformed filenames

### Directory Creation
System MUST ensure:
- `.sdlc/docs/` exists
- `.sdlc/harness/` exists
- `.sqlc/arch/` exists
- NO subdirectories created within them

### Migration Support
If migrating from old structure:
1. Create backup
2. Identify file type from old location
3. Move to correct new directory
4. Rename with correct suffix
5. Remove empty old directories
6. Verify all files migrated

---

## Related Documentation

- **Main**: `sdlc/sdlc.md` - SDLC main documentation
- **Phases**: `sdlc/phases/*.md` - Individual phase implementations
- **Old Harness**: `sdlc-documentation-system-20260319.harness.md` - Previous version (flat structure)
