export async function submitApplication(formData) {
  const res = await fetch("http://localhost:5000/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "unknown" }));
    throw new Error(err.message || "Gagal mengirim aplikasi");
  }
  return res.json();
}
