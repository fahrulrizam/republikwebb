export async function submitApplication(formData) {
  // Ganti localhost:5000 dengan URL Render Anda (https://republikweb-app.onrender.com)
  const backendUrl = "https://republikweb-app.onrender.com"; 
  
  // PERBAIKAN ENDPOINT: Backend Anda menggunakan '/api/register', BUKAN '/api/applications'
  const endpoint = "/api/register"; 
  
  const res = await fetch(`${backendUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  // ... (kode penanganan error lainnya)
}