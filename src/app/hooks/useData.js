import { useState, useEffect, useCallback } from "react";

const API_BASE = "";

// 1) GET /api/v0/resources/?page=&limit=
export function useResources(page = 1, limit = 10) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: limit
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/v0/resources/?page=${page}&limit=${limit}`
      );
      const json = await res.json();
      setItems(json.data);
      setMeta({
        totalPages: json.totalPages,
        currentPage: json.currentPage,
        itemsPerPage: json.itemsPerPage
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return { items, meta, loading, error, refetch: fetchPage };
}

// 2) GET /api/v0/resources/all
export function useAllResources() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v0/resources/all`)
      .then((r) => r.json())
      .then((json) => setItems(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}

// 3) GET /api/v0/resources/sets
export function useResourceSets() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v0/resources/sets`)
      .then((r) => r.json())
      .then((json) => setSets(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { sets, loading, error };
}

// 4) GET /api/v0/resources/counts
export function useResourceCounts() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v0/resources/counts`)
      .then((r) => r.json())
      .then((json) => setCounts(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { counts, loading, error };
}

// 5) GET /api/v0/resources/allstats
export function useResourceAllStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v0/resources/allstats`)
      .then((r) => r.json())
      .then((json) => setStats(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}

// 6) GET /api/v0/resources/stats
export function useResourceStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v0/resources/stats`)
      .then((r) => r.json())
      .then((json) => setStats(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}

// 7) GET /api/v0/resources/viewsAll
export function useResourceViewsAll() {
  const [views, setViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v0/resources/viewsAll`)
      .then((r) => r.json())
      .then((json) => setViews(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { views, loading, error };
}

// 8) GET /api/v0/resources/views
export function useResourceViewsCount() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v0/resources/views`)
      .then((r) => r.json())
      .then((json) => setCounts(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { counts, loading, error };
}

// 9) POST /api/v0/resources/:id/increment-view
export function useIncrementView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const increment = useCallback(async (id) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/v0/resources/${id}/increment-view`, {
        method: "POST"
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { increment, loading, error };
}

// 10) DELETE /api/v0/resources/clean-views
export function useCleanViews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clean = useCallback(async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/v0/resources/clean-views`, {
        method: "DELETE"
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { clean, loading, error };
}

// 11) GET /api/v0/resources/searchByKeyword
export function useSearchByKeyword(keyword) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);
    fetch(
      `${API_BASE}/api/v0/resources/searchByKeyword?searchString=${encodeURIComponent(
        keyword
      )}`
    )
      .then((r) => r.json())
      .then((json) => setResults(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [keyword]);

  return { results, loading, error };
}

// 12) GET /api/v0/resources/storage/:id
export function useResourceById(id) {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/api/v0/resources/storage/${id}`)
      .then((r) => r.json())
      .then((json) => setResource(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { resource, loading, error };
}

// 13) GET /api/v0/resources/tags/:tag
export function useResourcesByTag(tag) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tag) return;
    setLoading(true);
    fetch(`${API_BASE}/api/v0/resources/tags/${encodeURIComponent(tag)}`)
      .then((r) => r.json())
      .then((json) => setItems(json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tag]);

  return { items, loading, error };
}
