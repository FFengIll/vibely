# Discuss

Discuss technical problems by first presenting brief solution approaches, then asking for your specific needs before providing detailed recommendations.

## Output Structure

```markdown
## Problem Analysis
[Brief description of the problem and key requirements]

## Possible Approaches
1. **[Approach 1]**: Brief description (1-2 sentences)
2. **[Approach 2]**: Brief description (1-2 sentences)
3. **[Approach 3]**: Brief description (1-2 sentences)

## What's Your Desired Outcome?
Please let me know:
- Which approach interests you most?
- What specific result do you need?
- Any constraints or preferences?
```

## Example Usage

**Topic**: `/discuss State management for React app`

**Initial Output:**
```markdown
## Problem Analysis
React app needs to manage user data, shopping cart, and UI preferences.

## Possible Approaches
1. **React Context + useReducer**: Built-in solution for moderate complexity
2. **Zustand**: Lightweight library with minimal boilerplate
3. **Redux Toolkit**: Full-featured solution with devtools

## What's Your Desired Outcome?
Please let me know:
- Which approach interests you most?
- What specific result do you need?
- Any constraints or preferences?
```

**If user chooses Zustand:**
```markdown
## Detailed Recommendation: Zustand

Best for simplicity and flexibility. Minimal boilerplate, TypeScript support, no providers needed.

Quick implementation:
```typescript
import { create } from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```
```

```bash
/discuss [topic description]
```

**Examples:**
```bash
/discuss How to implement file uploads for this application?
/discuss Database schema for real-time chat system
/discuss Caching strategy for high-traffic API
/discuss Microservice communication patterns
/discuss Testing approach for frontend application
```