# Deployments Directory

## Purpose

Deployment descriptors, environment topology, packaging handoff files, infrastructure examples, and release deployment documentation.

## Owner

sdkwork-generations

## Allowed Content

- Deployment descriptors
- Environment topology
- Packaging handoff files
- Infrastructure examples
- Deployment documentation
- Docker/K8s/systemd/nginx configs

## Forbidden Content

- Live secrets
- Private keys
- Local override files
- Runtime user config
- Generated SDK output

## Related Specs

- `../sdkwork-specs/DEPLOYMENT_SPEC.md`
- `../sdkwork-specs/GITHUB_WORKFLOW_SPEC.md`
- `../sdkwork-specs/SECURITY_SPEC.md`

## Verification

- No secrets in deployment files
- Descriptors are documented
- Topology is valid