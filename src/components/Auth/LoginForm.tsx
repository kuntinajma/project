import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const userRoles = [
    {
      id: 'superadmin',
      name: 'Super Admin',
      description: 'Akses penuh ke semua fitur sistem',
      email: 'superadmin@laiya.com',
      features: ['Manajemen pengguna', 'Kontrol sistem', 'Analytics lengkap', 'Pengaturan website']
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Kelola konten dan UMKM',
      email: 'admin@laiya.com',
      features: ['Kelola destinasi', 'Kelola paket wisata', 'Moderasi artikel', 'Persetujuan UMKM']
    },
    {
      id: 'msme',
      name: 'UMKM',
      description: 'Kelola produk dan bisnis lokal',
      email: 'umkm@laiya.com',
      features: ['Kelola produk', 'Lacak pesanan', 'Profil bisnis', 'Analytics penjualan']
    },
    {
      id: 'contributor',
      name: 'Kontributor',
      description: 'Tulis dan kelola artikel',
      email: 'kontributor@laiya.com',
      features: ['Tulis artikel', 'Lacak status', 'Sistem pencapaian', 'Profil penulis']
    }
  ];

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role.id);
    setEmail(role.email);
    setPassword('demo123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password, selectedRole);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleData = userRoles.find(role => role.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Demo Login - Pilih Peran</h2>
          <p className="text-gray-600">Pilih peran untuk melihat dashboard yang berbeda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Role Selection */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="mr-2 text-orange-600" size={24} />
              Pilih Peran Pengguna
            </h3>
            
            <div className="space-y-4">
              {userRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRole === role.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{role.name}</h4>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedRole === role.id
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedRole === role.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {role.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Login sebagai {selectedRoleData?.name}
              </h3>
              <p className="text-gray-600">{selectedRoleData?.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Email otomatis terisi"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Password otomatis terisi"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Fitur Dashboard:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {selectedRoleData?.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Masuk...' : `Masuk sebagai ${selectedRoleData?.name}`}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Demo sistem - Klik peran di sebelah kiri untuk mengubah akses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;