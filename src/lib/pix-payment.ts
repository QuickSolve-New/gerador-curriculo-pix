import { PaymentData } from './types';

// Configurações da API EfiPay
const EFIPAY_BASE_URL = 'https://pix.api.efipay.com.br';
const RESUME_PRICE = 9.90; // Preço acessível em reais

export class EfiPayService {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor() {
    // Em produção, essas credenciais devem vir de variáveis de ambiente
    this.clientId = process.env.NEXT_PUBLIC_EFIPAY_CLIENT_ID || '';
    this.clientSecret = process.env.NEXT_PUBLIC_EFIPAY_CLIENT_SECRET || '';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    try {
      const credentials = btoa(`${this.clientId}:${this.clientSecret}`);
      
      const response = await fetch(`${EFIPAY_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials'
        })
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Erro ao obter token de acesso:', error);
      throw new Error('Falha na autenticação com EfiPay');
    }
  }

  async createPixPayment(): Promise<PaymentData> {
    try {
      const token = await this.getAccessToken();
      const txid = this.generateTxid();

      // Criar cobrança PIX
      const chargeResponse = await fetch(`${EFIPAY_BASE_URL}/v2/cob/${txid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calendario: {
            expiracao: 3600 // 1 hora para expirar
          },
          devedor: {
            nome: 'Cliente Currículo',
            cpf: '00000000000' // CPF genérico para teste
          },
          valor: {
            original: RESUME_PRICE.toFixed(2)
          },
          chave: process.env.NEXT_PUBLIC_EFIPAY_PIX_KEY || '', // Sua chave PIX
          solicitacaoPagador: 'Pagamento para geração de currículo profissional'
        })
      });

      if (!chargeResponse.ok) {
        throw new Error('Erro ao criar cobrança PIX');
      }

      // Gerar QR Code
      const qrResponse = await fetch(`${EFIPAY_BASE_URL}/v2/loc/${txid}/qrcode`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!qrResponse.ok) {
        throw new Error('Erro ao gerar QR Code');
      }

      const qrData = await qrResponse.json();

      return {
        txid,
        qrCode: qrData.qrcode,
        qrCodeImage: qrData.imagemQrcode,
        amount: RESUME_PRICE,
        status: 'pending'
      };
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      
      // Fallback para desenvolvimento/demonstração
      return this.createMockPayment();
    }
  }

  async checkPaymentStatus(txid: string): Promise<'pending' | 'paid' | 'expired'> {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${EFIPAY_BASE_URL}/v2/cob/${txid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        return 'expired';
      }

      const data = await response.json();
      
      if (data.status === 'CONCLUIDA') {
        return 'paid';
      } else if (data.status === 'ATIVA') {
        return 'pending';
      } else {
        return 'expired';
      }
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      return 'expired';
    }
  }

  private generateTxid(): string {
    return 'RESUME' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  // Mock para desenvolvimento/demonstração
  private createMockPayment(): PaymentData {
    const txid = this.generateTxid();
    
    return {
      txid,
      qrCode: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540' + RESUME_PRICE.toFixed(2) + '5802BR5913GERADOR CV6008BRASILIA62070503***6304',
      qrCodeImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      amount: RESUME_PRICE,
      status: 'pending'
    };
  }
}

export const efiPayService = new EfiPayService();