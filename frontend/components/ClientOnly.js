import React, { useState, useEffect } from 'react';

/**
 * ClientOnly component to prevent SSR hydration mismatches
 *
 * This component ensures that its children are only rendered on the client side,
 * preventing issues with server-side rendering when components depend on browser APIs.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render client-side only
 * @param {React.ReactNode} props.fallback - Optional fallback to show during SSR
 * @returns {React.ReactElement|null} The children on client-side, fallback on server-side
 */
const ClientOnly = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return children;
};

export default ClientOnly;
