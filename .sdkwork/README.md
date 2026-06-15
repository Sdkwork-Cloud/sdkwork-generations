# sdkwork-generations Workspace Metadata

This source-controlled `.sdkwork/` directory stores repository-local SDKWork development metadata only.

Runtime state, generated SDK output, caches, logs, secrets, and user-private files do not belong here.

## Purpose

Source-controlled workspace metadata, common skills, local plugins, optional manifests, and repository/application AI workspace metadata.

## Owner

sdkwork-generations

## Execution References

- Agent entrypoint: `AGENTS.md`
- Shared execution soul: `../sdkwork-specs/SOUL.md`
- Workspace metadata standard: `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- Component spec standard: `../sdkwork-specs/COMPONENT_SPEC.md`

## Directory Structure

- `skills/`: reusable agent/operator workflows for the repository or application.
- `plugins/`: repository/application-local agent extensions and plugin bundles.
- `manifests/`: optional machine-readable workspace manifests.
- `local/`: local-only state (ignored).
- `tmp/`: temporary files (ignored).
- `cache/`: cache files (ignored).
- `secrets/`: secret files (ignored).

## Allowed Content

- Repository/application skills with SKILL.md
- Repository/application plugins with .codex-plugin/plugin.json
- Optional workspace manifests
- Local workspace metadata

## Forbidden Content

- Runtime state
- Generated SDK output
- Caches, logs, secrets
- User-private files
- Application/runtime source code

## Related Specs

- `../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../sdkwork-specs/COMPONENT_SPEC.md`
- `../sdkwork-specs/SECURITY_SPEC.md`

## Verification

- No secrets in committed files
- Skills have SKILL.md
- Plugins have .codex-plugin/plugin.json
- No generated SDK transport output
