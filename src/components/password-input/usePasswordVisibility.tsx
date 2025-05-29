import { useState } from 'react';

const usePasswordVisibility = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((v) => !v);

  return { isVisible, toggleVisibility };
};

export default usePasswordVisibility;
