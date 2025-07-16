import React from 'react';
import { Phone, Anchor, Clock } from 'lucide-react';
import { transportation } from '../../data/mockData';

const TransportationTable: React.FC = () => {
  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transportasi ke Pulau Laiya
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Layanan kapal terpercaya yang menghubungkan Anda ke surga
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-500 to-blue-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Nama Kapal</th>
                  <th className="px-6 py-4 text-left font-semibold">Kontak</th>
                  <th className="px-6 py-4 text-left font-semibold">Waktu Keberangkatan</th>
                  <th className="px-6 py-4 text-left font-semibold">Lokasi Dermaga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transportation.map((boat, index) => (
                  <tr key={boat.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Anchor className="text-blue-500 mr-3" size={20} />
                        <span className="font-medium text-gray-900">{boat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCall(boat.phone)}
                        className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        <Phone size={16} className="mr-2" />
                        <span className="font-medium">{boat.phone}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Clock className="text-green-500 mr-3" size={20} />
                        <span className="text-gray-700">{boat.departureTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{boat.dockLocation}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-orange-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            Catatan Penting:
          </h3>
          <ul className="text-orange-800 space-y-1">
            <li>• Harap tiba 30 menit sebelum waktu keberangkatan</li>
            <li>• Kondisi cuaca dapat mempengaruhi jadwal keberangkatan</li>
            <li>• Hubungi operator kapal langsung untuk reservasi</li>
            <li>• Jaket pelampung disediakan untuk semua penumpang</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TransportationTable;