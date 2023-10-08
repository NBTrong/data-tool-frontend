import React, { useMemo, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Decentralization({
  children,
  permissions = [],
  exact = false,
}) {
  const { me } = useContext(AuthContext);

  // check permission in permissions array have in me.permissions
  const hasPermission = useMemo(() => {
    if (!me) {
      return false;
    }
    return permissions.some((permission) => {
      return me.permissions.some((item) => {
        if (exact) {
          return item.name === permission;
        }
        return item.name.includes(permission);
      });
    });
  }, [exact, me, permissions]);

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
