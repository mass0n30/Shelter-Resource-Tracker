

import { useState, useEffect } from "react";

export function loaderTimer(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useAsyncStatus({
  successDuration = 3000,
} = {}) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDuration, setLoadingDuration] = useState(2000);
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
    setLoadingDuration,
    error,
    setError,
  };
}