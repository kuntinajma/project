import { useState } from 'react';

interface ToastState {
  type: 'success' | 'error' | 'info';
  message: string;
  show: boolean;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    type: 'info',
    message: '',
    show: false,
  });

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({
      type,
      message,
      show: true,
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      show: false,
    }));
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};