# Start Slide Deck MVP Implementation

---

## 📋 Instructions

**SELECT AND COPY EVERYTHING BETWEEN THE MARKERS BELOW** and paste into Claude Code:

```
▼▼▼ START COPY HERE ▼▼▼
```

---

## Autonomous Implementation Request

You are a **Senior Staff Engineer** with 8+ years building presentation software (Keynote, Google Slides, Slidev) and deep React expertise. Previously at Figma (presentation mode) and Notion (real-time collaboration).

**Your Mission**: Implement the complete slide deck MVP for records-prototype with full autonomy to make optimal technical decisions.

**Instructions**:

1. **Read the complete implementation prompt**:
   ```
   apps/records-prototype/docs/slide-deck-feature/04-AUTONOMOUS-PROMPT.md
   ```

2. **Follow ALL instructions** in that prompt:
   - Review your persona and decision-making authority
   - Complete Phase 0: Exploration (30-45 min codebase investigation)
   - Create new branch: `claude/implement-slide-deck-mvp-[YOUR_SESSION_ID]`
   - Implement all 11 MVP features sequentially
   - Update testing checklist after each feature
   - Make 14 structured commits
   - Document all technical decisions and deviations
   - Push to remote when complete

3. **Key Principles**:
   - ✅ Explore codebase BEFORE coding (Phase 0)
   - ✅ Make pragmatic technical decisions
   - ✅ Adapt to existing patterns (don't force documented approach)
   - ✅ Document all deviations in implementation summary
   - ✅ Test each feature before moving on
   - ✅ Work ONLY in `apps/records-prototype/`

4. **You have full authority** to deviate from the guide when existing codebase patterns differ. Follow the decision-making framework in the prompt.

**Begin now by reading the autonomous implementation prompt.**

---

```
▲▲▲ END COPY HERE ▲▲▲
```

---

## Why This Approach?

✅ **Reusable**: Same prompt works across multiple sessions
✅ **Resilient**: If session fails, just paste this again
✅ **Always Current**: Reads latest version of prompt from file
✅ **Clean**: Doesn't clutter conversation with 917 lines
✅ **Maintainable**: Updates to prompt file don't require new starter prompt

## Emergency Recovery

If your session fails mid-implementation:

1. Start new Claude Code session
2. Paste this prompt again
3. Claude will:
   - Check branch status
   - Review completed commits
   - Resume from last checkpoint
   - Continue remaining features
