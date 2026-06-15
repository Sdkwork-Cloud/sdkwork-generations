# Repository Skills

No repository-local Codex skills are defined yet. Add a skill directory only when it contains a `SKILL.md` and follows SDKWork workspace standards.

## Purpose

Reusable agent/operator workflows for the repository or application.

## How to Add a Skill

1. Create a directory under `.sdkwork/skills/<skill-name>/`
2. `<skill-name>` must be lowercase kebab-case
3. Add `SKILL.md` as the entrypoint
4. Optionally add `references/`, `scripts/`, and `assets/` directories
5. Commit the skill directory

## Skill Directory Shape

```
.sdkwork/skills/<skill-name>/
  SKILL.md
  references/        # optional
  scripts/           # optional
  assets/            # optional
```

## SKILL.md Requirements

- State when to use the skill
- Specify expected inputs
- List files or commands it may touch
- Reference root specs it follows

## Related Specs

- `../../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../../sdkwork-specs/COMPONENT_SPEC.md`

## Verification

- Skill directories have SKILL.md
- Skill names are lowercase kebab-case
- No secrets in skill files
- Skills cite relevant root specs
