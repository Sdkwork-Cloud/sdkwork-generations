# APIs Directory

## Purpose

Author-owned API contracts and API source inputs for all API kinds, including HTTP OpenAPI surfaces, RPC/proto contracts, async/event API manifests, API examples, API changelogs, and API validation inputs.

## Owner

sdkwork-generations

## Allowed Content

- OpenAPI documents (*.yaml, *.json)
- Proto files (*.proto)
- AsyncAPI/event manifests
- API examples
- API changelogs
- API validation inputs
- Route metadata

## Forbidden Content

- Generated SDK transport output
- Implementation code
- SDK family directories
- Generated SDK control-plane .sdkwork/ files

## Related Specs

- `../sdkwork-specs/API_SPEC.md`
- `../sdkwork-specs/SDK_WORKSPACE_GENERATION_SPEC.md`
- `../sdkwork-specs/COMPONENT_SPEC.md`

## Verification

- API contracts validate against OpenAPI 3.1.2 stable profile
- No generated SDK output in apis/
- No implementation code in apis/