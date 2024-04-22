import { useApi, identityApiRef } from "@backstage/core-plugin-api";
import { useEntity } from "@backstage/plugin-catalog-react";
import { EntityKubernetesContent } from "@backstage/plugin-kubernetes";
import React from "react";
import useAsync from "react-use/esm/useAsync";

export const MatchOwnerEntity = () => {
    const { entity } = useEntity()
    const identityApi = useApi(identityApiRef);
  
    const matchOwner = useAsync(async () => {
      const identity = await identityApi.getBackstageIdentity();
      const owner = identity.ownershipEntityRefs
      return owner.map(value => value.substring(value.indexOf("/") + 1)).some((value)=>value === entity.spec?.owner)
    });
  
    // if(!matchOwner.value){
    //   return <></>
    // }
  
    return (
      <EntityKubernetesContent refreshIntervalMs={30000} />
    );
  }