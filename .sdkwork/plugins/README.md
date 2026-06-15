# Repository Plugins

No repository-local Codex plugins are defined yet. Add plugin bundles only when they include a valid `.codex-plugin/plugin.json`.

## Purpose

Repository/application-local agent extensions and plugin bundles.

## How to Add a Plugin

1. Create a directory under `.sdkwork/plugins/<plugin-name>/`
2. `<plugin-name>` must be lowercase kebab-case
3. Add `.codex-plugin/plugin.json` as the manifest
4. Optionally add `skills/`, `mcp/`, `apps/`, and `scripts/` directories
5. Commit the plugin directory

## Plugin Directory Shape

```
.sdkwork/plugins/<plugin-name>/
  .codex-plugin/
    plugin.json
  skills/            # optional
  mcp/               # optional
  apps/              # optional
  scripts/           # optional
```

## plugin.json Requirements

- Identify plugin name, version, owner, description
- List contributed skills/tools/apps when supported

## Related Specs

- `../../sdkwork-specs/SDKWORK_WORKSPACE_SPEC.md`
- `../../sdkwork-specs/COMPONENT_SPEC.md`

## Verification

- Plugin directories have .codex-plugin/plugin.json
- Plugin names are lowercase kebab-case
- No secrets in plugin files
- Plugins follow SDKWork standards
