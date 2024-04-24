import {
  AuthorizeResult,
  isPermission,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
    PermissionPolicy,
    PolicyQuery,
  } from '@backstage/plugin-permission-node';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import { catalogConditions, createCatalogConditionalDecision } from '@backstage/plugin-catalog-backend/alpha';
import {
    catalogEntityDeletePermission,
  } from '@backstage/plugin-catalog-common/alpha';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';


class TestPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
   ): Promise<PolicyDecision> {
    if (isPermission(request.permission, catalogEntityDeletePermission)) {
      return createCatalogConditionalDecision(
        request.permission,
        catalogConditions.isEntityOwner({
          claims: user?.identity.ownershipEntityRefs ?? [],
        }),
      );
    }
     return { result: AuthorizeResult.ALLOW };
  }
}

export const customPermissionBackendModule = createBackendModule({
  pluginId: 'permission',
  moduleId: 'custom-policy',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new TestPermissionPolicy());
      },
    });
  },
});

export const hiddenPermissionBackendModule = createBackendModule({
  pluginId: 'permission',
  moduleId: 'custom',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new TestPermissionPolicy());
      },
    });
  },
});