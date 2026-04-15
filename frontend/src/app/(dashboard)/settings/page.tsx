"use client";
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface TenantSettings {
  id: string;
  name: string;
  slug: string;
  apiKey: string;
  customUrl: string | null;
  integrations: any;
  catalogRef: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'brand' | 'team'>('brand');
  const [settings, setSettings] = useState<TenantSettings | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for forms
  const [brandForm, setBrandForm] = useState({ name: '', customUrl: '', catalogRef: '' });
  const [integrations, setIntegrations] = useState<{ [key: string]: boolean }>({ whatsapp: false, instagram: false });
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'TENANT' });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sData, uData] = await Promise.all([
        apiFetch('/api/tenant/settings'),
        apiFetch('/api/users')
      ]);
      setSettings(sData);
      setUsers(uData);
      
      setBrandForm({
        name: sData.name || '',
        customUrl: sData.customUrl || '',
        catalogRef: sData.catalogRef || ''
      });
      
      if (sData.integrations) {
        setIntegrations(sData.integrations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/tenant/settings', {
        method: 'PUT',
        body: JSON.stringify({ ...brandForm, integrations })
      });
      alert("Configuración de marca guardada");
      fetchData();
    } catch (err) {
      alert("Error al guardar");
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(userForm)
      });
      setIsUserModalOpen(false);
      setUserForm({ name: '', email: '', password: '', role: 'TENANT' });
      fetchData();
    } catch (err) {
      alert("Error al crear usuario");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
      await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-white">Cargando configuración...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto w-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Configuración</h1>
        <p className="text-text-muted mt-2">Módulo de administración central para Unitary Marketing AI.</p>
      </div>

      <div className="flex gap-1 bg-surface-hover/20 p-1 rounded-xl w-fit mb-8 border border-border">
        <button 
          onClick={() => setActiveTab('brand')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'brand' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}
        >
          Marca e Integraciones
        </button>
        <button 
          onClick={() => setActiveTab('team')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'team' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white'}`}
        >
          Gestión de Equipo
        </button>
      </div>

      {activeTab === 'brand' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* General Brand Info */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-border pb-4">Detalles de la Marca</h2>
            <form onSubmit={handleBrandSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">Nombre de la Organización</label>
                <input 
                  type="text" 
                  value={brandForm.name}
                  onChange={e => setBrandForm({...brandForm, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-white text-sm focus:border-primary focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">URL Sugerida (Slug Personalizado)</label>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-sm">unitary.ai/</span>
                  <input 
                    type="text" 
                    value={brandForm.customUrl}
                    onChange={e => setBrandForm({...brandForm, customUrl: e.target.value})}
                    placeholder="ej: lucho/umbra"
                    className="flex-1 bg-background border border-border rounded-lg py-2.5 px-4 text-white text-sm focus:border-primary focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">Referencia de Catálogo</label>
                <input 
                  type="text" 
                  value={brandForm.catalogRef}
                  onChange={e => setBrandForm({...brandForm, catalogRef: e.target.value})}
                  placeholder="ID o Link de catálogo"
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-white text-sm focus:border-primary focus:outline-none transition-all"
                />
              </div>
              
              <div className="pt-4">
                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl transition-all font-bold text-sm shadow-xl shadow-primary/20">
                  Guardar Todos los Cambios
                </button>
              </div>
            </form>
          </div>

          {/* n8n & API Integrations */}
          <div className="space-y-8">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-primary">⚡</span> Puente n8n
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">API Key Unificada</label>
                  <div className="bg-background border border-border rounded-xl p-3 flex items-center justify-between group">
                    <code className="text-primary-light font-mono text-sm truncate">{settings?.apiKey}</code>
                    <button onClick={() => { navigator.clipboard.writeText(settings?.apiKey || ''); alert("Copiado!"); }} className="text-xs text-text-muted hover:text-white bg-surface-hover px-2 py-1 rounded border border-border opacity-0 group-hover:opacity-100 transition-all">Copiar</button>
                  </div>
                  <p className="text-[10px] text-text-muted mt-2 italic">Usa este token para autenticar llamadas desde n8n a tu endpoint de WhatsApp.</p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Servicios Sincronizados</h2>
              <div className="space-y-3">
                {Object.keys(integrations).map(key => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${integrations[key] ? 'bg-whatsapp shadow-sm shadow-whatsapp/50' : 'bg-text-muted'}`}></div>
                      <span className="text-sm font-medium text-white capitalize">{key}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={integrations[key]} 
                        onChange={() => setIntegrations({...integrations, [key]: !integrations[key]})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Integrantes del Equipo</h2>
            <button 
              onClick={() => setIsUserModalOpen(true)}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-all text-sm font-bold flex items-center gap-2 shadow-lg"
            >
              <span>+</span> Crear Usuario
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-hover/50 text-text-muted text-[10px] uppercase tracking-widest border-b border-border">
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-text-muted">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${u.role === 'SUPER_ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeleteUser(u.id)} className="text-text-muted hover:text-red-400 transition-colors">🗑 Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Usuario */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl p-8 scale-in duration-200">
            <h2 className="text-2xl font-bold text-white mb-6">Nuevo Integrante</h2>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Nombre</label>
                <input type="text" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-white text-sm focus:border-primary focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Email Profesional</label>
                <input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-white text-sm focus:border-primary focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Contraseña</label>
                <input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-white text-sm focus:border-primary focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Rol en la Organización</label>
                <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-white text-sm focus:border-primary focus:outline-none">
                  <option value="TENANT">Tenant / Admin Marca</option>
                  <option value="SUPER_ADMIN">Super Admin Sistema</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="flex-1 bg-surface-hover text-white py-2.5 rounded-xl font-medium">Cancelar</button>
                <button type="submit" className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20">Crear Acceso</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
