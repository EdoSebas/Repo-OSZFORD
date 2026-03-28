/* js/api.js — OSZFORD API Client */

'use strict';

const API = {
  BASE_URL: 'http://localhost:8000/api',
  
  session: {
    colaborador_cedula: null,
    role: null,
  },

  async login(cedula, pin) {
    try {
      const res = await fetch(`${API.BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula, pin })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Login falló');
      }
      
      const data = await res.json();
      API.session.colaborador_cedula = cedula;
      API.session.role = data.role;
      return data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  async listVehiculos(tipo = null) {
    try {
      const url = tipo 
        ? `${API.BASE_URL}/vehiculos?tipo=${tipo}`
        : `${API.BASE_URL}/vehiculos`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error fetching vehicles');
      return await res.json();
    } catch (err) {
      console.error('List vehicles error:', err);
      throw err;
    }
  },

  async createVehiculo(placa, tipo, propiedad, soatVence, tecnoVence) {
    try {
      const params = new URLSearchParams({
        placa, tipo, propiedad,
        ...(soatVence && { soat_vence: soatVence }),
        ...(tecnoVence && { tecno_vence: tecnoVence })
      });
      
      const res = await fetch(`${API.BASE_URL}/vehiculos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      
      if (!res.ok) throw new Error('Error creating vehicle');
      return await res.json();
    } catch (err) {
      console.error('Create vehicle error:', err);
      throw err;
    }
  },

  async getVehiculo(placa) {
    try {
      const res = await fetch(`${API.BASE_URL}/vehiculos/${placa}`);
      if (!res.ok) throw new Error('Vehicle not found');
      return await res.json();
    } catch (err) {
      console.error('Get vehicle error:', err);
      throw err;
    }
  },

  async initPreoperacional(vehiculoId) {
    try {
      const params = new URLSearchParams({
        colaborador_cedula: API.session.colaborador_cedula,
        vehiculo_id: vehiculoId
      });
      
      const res = await fetch(`${API.BASE_URL}/preoperacional/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      
      if (!res.ok) throw new Error('Error initializing inspection');
      return await res.json();
    } catch (err) {
      console.error('Init preoperacional error:', err);
      throw err;
    }
  },

  async addInspeccionItem(preopId, parteNombre, parteCategoria, estado) {
    try {
      const params = new URLSearchParams({
        parte_nombre: parteNombre,
        parte_categoria: parteCategoria,
        estado
      });
      
      const res = await fetch(`${API.BASE_URL}/preoperacional/${preopId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      
      if (!res.ok) throw new Error('Error adding inspection item');
      return await res.json();
    } catch (err) {
      console.error('Add inspection item error:', err);
      throw err;
    }
  },

  async completePreoperacional(preopId) {
    try {
      const res = await fetch(`${API.BASE_URL}/preoperacional/${preopId}/complete`, {
        method: 'POST'
      });
      
      if (!res.ok) throw new Error('Error completing inspection');
      return await res.json();
    } catch (err) {
      console.error('Complete preoperacional error:', err);
      throw err;
    }
  },

  async initJornada(vehiculoId, turno, puesto, preoperacionalId = null) {
    try {
      const params = new URLSearchParams({
        colaborador_cedula: API.session.colaborador_cedula,
        vehiculo_id: vehiculoId,
        turno,
        puesto,
        ...(preoperacionalId && { preoperacional_id: preoperacionalId })
      });
      
      const res = await fetch(`${API.BASE_URL}/jornada/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      
      if (!res.ok) throw new Error('Error initializing shift');
      return await res.json();
    } catch (err) {
      console.error('Init jornada error:', err);
      throw err;
    }
  },

  async recordKm(jornadaId, kmInicial = null, kmFinal = null, novedades = null) {
    try {
      const params = new URLSearchParams();
      if (kmInicial !== null) params.append('km_inicial', kmInicial);
      if (kmFinal !== null) params.append('km_final', kmFinal);
      if (novedades) params.append('novedades', novedades);
      
      const res = await fetch(`${API.BASE_URL}/jornada/${jornadaId}/km`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      
      if (!res.ok) throw new Error('Error recording km');
      return await res.json();
    } catch (err) {
      console.error('Record km error:', err);
      throw err;
    }
  },

  async closeJornada(jornadaId) {
    try {
      const res = await fetch(`${API.BASE_URL}/jornada/${jornadaId}/close`, {
        method: 'POST'
      });
      
      if (!res.ok) throw new Error('Error closing shift');
      return await res.json();
    } catch (err) {
      console.error('Close jornada error:', err);
      throw err;
    }
  },

  async getDashboardStats() {
    try {
      const res = await fetch(`${API.BASE_URL}/dashboard/stats`);
      if (!res.ok) throw new Error('Error fetching dashboard stats');
      return await res.json();
    } catch (err) {
      console.error('Dashboard stats error:', err);
      throw err;
    }
  },

  async getColaboradoresStatus() {
    try {
      const res = await fetch(`${API.BASE_URL}/dashboard/colaboradores`);
      if (!res.ok) throw new Error('Error fetching colaboradores');
      return await res.json();
    } catch (err) {
      console.error('Colaboradores status error:', err);
      throw err;
    }
  },

  async getAlertas(nivel = null) {
    try {
      const url = nivel
        ? `${API.BASE_URL}/dashboard/alertas?nivel=${nivel}`
        : `${API.BASE_URL}/dashboard/alertas`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error fetching alerts');
      return await res.json();
    } catch (err) {
      console.error('Alertas error:', err);
      throw err;
    }
  }
};
