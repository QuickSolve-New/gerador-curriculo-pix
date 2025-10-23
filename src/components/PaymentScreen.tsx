'use client';

import { useState, useEffect } from 'react';
import { QrCode, Clock, CheckCircle, XCircle, Copy, ArrowLeft, Sparkles, Shield, Zap } from 'lucide-react';
import { PaymentData } from '@/lib/types';
import { efiPayService } from '@/lib/pix-payment';

interface PaymentScreenProps {
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export default function PaymentScreen({ onPaymentSuccess, onBack }: PaymentScreenProps) {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hora em segundos
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    createPayment();
  }, []);

  useEffect(() => {
    if (!paymentData || paymentData.status !== 'pending') return;

    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 5000); // Verifica a cada 5 segundos

    return () => clearInterval(interval);
  }, [paymentData]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPaymentData(prev => prev ? { ...prev, status: 'expired' } : null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const createPayment = async () => {
    try {
      setLoading(true);
      const payment = await efiPayService.createPixPayment();
      setPaymentData(payment);
    } catch (err) {
      setError('Erro ao criar pagamento. Tente novamente.');
      console.error('Erro ao criar pagamento:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentData) return;

    try {
      const status = await efiPayService.checkPaymentStatus(paymentData.txid);
      
      if (status === 'paid') {
        setPaymentData(prev => prev ? { ...prev, status: 'paid' } : null);
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      } else if (status === 'expired') {
        setPaymentData(prev => prev ? { ...prev, status: 'expired' } : null);
      }
    } catch (err) {
      console.error('Erro ao verificar status do pagamento:', err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const simulatePayment = () => {
    // Função para simular pagamento em desenvolvimento
    setPaymentData(prev => prev ? { ...prev, status: 'paid' } : null);
    setTimeout(() => {
      onPaymentSuccess();
    }, 2000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border border-white/20">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gerando Pagamento PIX
          </h2>
          <p className="text-xl text-gray-600">Preparando tudo para você...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border border-white/20">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-30"></div>
            <div className="relative bg-red-500 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <XCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-red-600">Ops! Algo deu errado</h2>
          <p className="text-xl text-gray-600 mb-8">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
            >
              Voltar
            </button>
            <button
              onClick={createPayment}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-8 font-semibold transition-all duration-300 hover:transform hover:scale-105"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar ao formulário
      </button>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-lg"></div>
              <div className="relative bg-white/20 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <QrCode className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Pagamento PIX</h1>
            <p className="text-xl text-blue-100">Seu currículo está quase pronto!</p>
            <div className="flex items-center justify-center space-x-6 mt-6">
              <div className="flex items-center text-blue-100">
                <Sparkles className="w-5 h-5 mr-2" />
                Rápido
              </div>
              <div className="flex items-center text-blue-100">
                <Shield className="w-5 h-5 mr-2" />
                Seguro
              </div>
              <div className="flex items-center text-blue-100">
                <Zap className="w-5 h-5 mr-2" />
                Instantâneo
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="p-8">
          {paymentData.status === 'pending' && (
            <div className="flex items-center justify-center mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
              <Clock className="w-6 h-6 text-yellow-600 mr-3" />
              <span className="text-yellow-800 font-semibold text-lg">
                Aguardando pagamento - Expira em {formatTime(timeLeft)}
              </span>
            </div>
          )}

          {paymentData.status === 'paid' && (
            <div className="flex items-center justify-center mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <span className="text-green-800 font-semibold text-lg">
                Pagamento confirmado! Preparando seu currículo...
              </span>
            </div>
          )}

          {paymentData.status === 'expired' && (
            <div className="flex items-center justify-center mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border-2 border-red-200">
              <XCircle className="w-6 h-6 text-red-600 mr-3" />
              <span className="text-red-800 font-semibold text-lg">
                Pagamento expirado
              </span>
            </div>
          )}

          {/* Valor */}
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-3 text-lg">Valor do seu currículo profissional:</p>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl">
                <p className="text-4xl font-bold">
                  R$ {paymentData.amount.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
            <p className="text-gray-500 mt-3">Pagamento único • Sem mensalidades</p>
          </div>

          {paymentData.status === 'pending' && (
            <>
              {/* QR Code */}
              <div className="text-center mb-8">
                <div className="inline-block p-6 bg-white border-4 border-gray-200 rounded-3xl shadow-lg">
                  {paymentData.qrCodeImage ? (
                    <img 
                      src={paymentData.qrCodeImage} 
                      alt="QR Code PIX" 
                      className="w-64 h-64 mx-auto"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-2xl">
                      <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-lg text-gray-600 mt-4 font-medium">
                  Escaneie com o app do seu banco
                </p>
              </div>

              {/* Código PIX */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-700 mb-4 text-center">
                  Ou copie o código PIX:
                </label>
                <div className="flex max-w-2xl mx-auto">
                  <input
                    type="text"
                    value={paymentData.qrCode}
                    readOnly
                    className="flex-1 p-4 border-2 border-gray-300 rounded-l-2xl bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(paymentData.qrCode)}
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center font-semibold"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copiar
                  </button>
                </div>
                {copied && (
                  <p className="text-green-600 text-center mt-3 font-semibold flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Código copiado com sucesso!
                  </p>
                )}
              </div>

              {/* Instruções */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border-2 border-blue-200">
                <h3 className="font-bold text-xl mb-6 text-center text-gray-800">Como pagar com PIX:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-3 py-2 rounded-full mr-4">1</span>
                      <span className="text-gray-700 font-medium">Abra o app do seu banco</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-3 py-2 rounded-full mr-4">2</span>
                      <span className="text-gray-700 font-medium">Escolha a opção PIX</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-3 py-2 rounded-full mr-4">3</span>
                      <span className="text-gray-700 font-medium">Escaneie o QR Code ou cole o código</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-3 py-2 rounded-full mr-4">4</span>
                      <span className="text-gray-700 font-medium">Confirme o pagamento</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-3 py-2 rounded-full mr-4">5</span>
                      <span className="text-gray-700 font-medium">Aguarde a confirmação automática</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-3 py-2 rounded-full mr-4">✓</span>
                      <span className="text-gray-700 font-medium">Baixe seu currículo em PDF!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de simulação para desenvolvimento */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-center">
                  <button
                    onClick={simulatePayment}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-bold"
                  >
                    Simular Pagamento (Dev)
                  </button>
                </div>
              )}
            </>
          )}

          {paymentData.status === 'expired' && (
            <div className="text-center">
              <p className="text-gray-600 mb-6 text-lg">
                O tempo para pagamento expirou. Gere um novo código PIX.
              </p>
              <button
                onClick={createPayment}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                Gerar Novo PIX
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Informações de segurança */}
      <div className="mt-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-medium">Pagamento seguro processado pela EfiPay</span>
            </div>
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-medium">Seus dados estão protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}