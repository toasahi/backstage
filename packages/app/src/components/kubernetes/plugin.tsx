// ルーティング可能な拡張コンポーネントの作成
import { BackstagePlugin, createRoutableExtension, createRouteRef } from '@backstage/core-plugin-api';
import { RouteRef } from '@backstage/core-plugin-api';

// マウントポイントを定義
const myRouteRef: RouteRef = createRouteRef({
    id: 'kubernetes'
})

// // ルーティング可能な拡張コンポーネントを作成
// export const MyRoutableExtension = createRoutableExtension({
//   name: "MatchOwnerEntity",
//  component: () => import('./MatchOwnerEntity').then(m => m.MatchOwnerEntity),
//  mountPoint: myRouteRef,
// });

// // プラグインに拡張を提供
// export const plugin = {
//  provide: (plugin: BackstagePlugin) => {
//     return {
//       MyRoutableExtension: plugin.provide(MyRoutableExtension),
//     };
//  },
// };

import { EntityKubernetesContent, plugin } from '@backstage/plugin-kubernetes';
import React from 'react';

const CustomKubernetesContent = () => (
 <EntityKubernetesContent refreshIntervalMs={30000} />
);

export const CustomKubernetesContentExtension = plugin.provide(
 createRoutableExtension({
  name: "MatchOwnerEntity",
 component: () => import('./MatchOwnerEntity').then(m => m.MatchOwnerEntity),
 mountPoint: myRouteRef,
 }),
);