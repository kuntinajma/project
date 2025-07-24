import React from 'react';
import { Phone } from 'lucide-react';
import { TransportationOption } from '../../hooks/useHome';

interface TransportationTableProps {
  transportationOptions: TransportationOption[];
}

const TransportationTable: React.FC<TransportationTableProps> = ({ transportationOptions }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transportasi ke Pulau
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jadwal dan kontak transportasi untuk mengunjungi Pulau Laiya
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-orange-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left">Nama Transportasi</th>
                <th className="py-4 px-6 text-left">Jadwal Keberangkatan</th>
                <th className="py-4 px-6 text-left">Lokasi Dermaga</th>
                <th className="py-4 px-6 text-center">Kontak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transportationOptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 px-6 text-center text-gray-500">
                    Tidak ada data transportasi tersedia
                  </td>
                </tr>
              ) : (
                transportationOptions.map((transport) => (
                  <tr key={transport.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{transport.name}</td>
                    <td className="py-4 px-6">{transport.departureTime || '-'}</td>
                    <td className="py-4 px-6">{transport.dockLocation || '-'}</td>
                    <td className="py-4 px-6 text-center">
                      {transport.phone ? (
                        <a
                          href={`tel:${transport.phone}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Phone size={16} className="mr-1" />
                          <span>{transport.phone}</span>
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Untuk informasi lebih lanjut tentang transportasi, silakan hubungi
            nomor yang tertera atau kunjungi dermaga keberangkatan.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TransportationTable;