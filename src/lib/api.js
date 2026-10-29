const BASE = process.env.API_URL;
export async function apiFetch(ruta, opciones = {}) {
  const r = await fetch(`${BASE}${ruta}`, {
    next: { revalidate: 60 },
    ...opciones,
  });
  if (!r.ok) throw new Error(`API error: ${r.status}`);
  return r.json();
}