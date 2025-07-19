import { useState, useEffect } from 'react';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseAuthFormReturn {
  formData: FormData;
  passwordMatch: boolean;
  isConfirmPasswordTouched: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleConfirmPasswordBlur: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const useAuthForm = (): UseAuthFormReturn => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmPasswordBlur = () => {
    setIsConfirmPasswordTouched(true);
  };

  useEffect(() => {
    if (isConfirmPasswordTouched && formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword, isConfirmPasswordTouched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return {
    formData,
    passwordMatch,
    isConfirmPasswordTouched,
    handleInputChange,
    handleConfirmPasswordBlur,
    handleSubmit
  };
}; 