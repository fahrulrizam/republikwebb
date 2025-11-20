import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from "../lib/supabaseClient.ts";

// --- DEFINISI TYPE BARU UNTUK MENGHILANGKAN GARIS MERAH ---
type Testimonial = {
    id: string;
    name: string;
    position: string;
    rating: number; // 1 to 5
    content: string;
    photo_url: string | null;
    is_published: boolean;
    created_at: string;
};
// --------------------------------------------------------

export default function Testimonials() {
  // Menggunakan type Testimonial yang sudah didefinisikan
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Memastikan data yang diterima sesuai dengan Testimonial[]
      setTestimonials(data as Testimonial[] || []); 
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Kata Mereka
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dengar pengalaman langsung dari alumni program magang Republikweb
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-orange-500/20" />

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.photo_url || 'https://placehold.co/64x64/CCCCCC/333333?text=Alumni'}
                  alt={testimonial.name}
                  // Sumber gambar placeholder telah disederhanakan
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <h3 className="font-bold text-blue-900 text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {/* Menggunakan Math.min untuk memastikan rating tidak lebih dari 5 */}
                {[...Array(Math.min(testimonial.rating, 5))].map((_, i) => ( 
                  <Star key={i} className="w-5 h-5 text-orange-500 fill-orange-500" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}