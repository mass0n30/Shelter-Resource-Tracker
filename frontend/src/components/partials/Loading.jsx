

import { useState, useEffect } from "react";

export function useAsyncStatus({
  successDuration = 3000,
  loadingDuration = null, // optional
} = {}) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), successDuration);
    return () => clearTimeout(t);
  }, [success, successDuration]);

  useEffect(() => {
    if (!loading || !loadingDuration) return;
    const t = setTimeout(() => setLoading(false), loadingDuration);
    return () => clearTimeout(t);
  }, [loading, loadingDuration]);

  return {
    success,
    setSuccess,
    loading,
    setLoading,
    error,
    setError,
  };
}