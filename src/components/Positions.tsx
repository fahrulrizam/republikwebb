import { useEffect, useState } from 'react';
import { Code, Palette, Video, TrendingUp, Search, Layers, ArrowRight } from 'lucide-react';
import { supabase, Position } from '../lib/supabase';

const iconMap: Record<string, React.ElementType> = {
  'programmer': Code,
  'content-creator': Palette,
  'video-editor': Video,
  'digital-marketing': TrendingUp,
  'seo-specialist': Search,
  'ui-ux-designer': Layers
};

export default function Positions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = (positionId: string) => {
    const formElement = document.getElementById('application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const positionSelect = document.getElementById('position') as HTMLSelectElement;
        if (positionSelect) {
          positionSelect.value = positionId;
        }
      }, 500);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="positions" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Posisi yang Tersedia
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih posisi yang sesuai dengan minat dan keahlian Anda.
            Setiap posisi menawarkan pengalaman belajar yang berbeda!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {positions.map((position) => {
            const Icon = iconMap[position.slug] || Code;
            return (
              <div
                key={position.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-500"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-xl mb-4">
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-blue-900 mb-3">{position.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{position.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Requirements:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {position.requirements.split(',').slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{req.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => scrollToForm(position.id)}
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
