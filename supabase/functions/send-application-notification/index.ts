import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotificationPayload {
  applicant_name: string;
  applicant_email: string;
  position: string;
  phone: string;
  school: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: NotificationPayload = await req.json();
    
    console.log('New application received:', {
      name: payload.applicant_name,
      email: payload.applicant_email,
      position: payload.position,
      phone: payload.phone,
      school: payload.school
    });

    const emailContent = `
      Aplikasi Magang Baru - Republikweb
      
      Nama: ${payload.applicant_name}
      Email: ${payload.applicant_email}
      Telepon: ${payload.phone}
      Sekolah/Universitas: ${payload.school}
      Posisi: ${payload.position}
      
      Silakan cek dashboard admin untuk detail lengkap.
    `;

    console.log('Email notification prepared:', emailContent);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification processed successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing notification:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});