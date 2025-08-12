'use client';

import { useEffect, useState } from 'react';

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import { addToast, Button, Checkbox, Divider, Form, Input, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import useLogin from '@root/modules/auth/hooks/use-login';
import useOAuth from '@root/modules/auth/hooks/use-oauth';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface LoginModalProperties {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSwitchToRegister?: () => void;
}

export function LoginModal({
  isOpen,
  onOpenChange,
  onSwitchToRegister
}: Readonly<LoginModalProperties>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { form, mutation } = useLogin();
  const { loginWithGoogle, loginWithLinkedIn, isGoogleLoading, isLinkedInLoading } = useOAuth();
  const router = useRouter();
  const t = useTranslations('AuthPage');

  // Load remembered credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('wingman_remembered_email');
    const savedRememberMe = localStorage.getItem('wingman_remember_me') === 'true';

    if (savedEmail && savedRememberMe) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Save or clear credentials based on remember me preference
  const handleRememberMeChange = (isSelected: boolean) => {
    setRememberMe(isSelected);

    if (isSelected) {
      // Save current email if remember me is checked
      if (email) {
        localStorage.setItem('wingman_remembered_email', email);
        localStorage.setItem('wingman_remember_me', 'true');
      }
    } else {
      // Clear saved credentials if remember me is unchecked
      localStorage.removeItem('wingman_remembered_email');
      localStorage.removeItem('wingman_remember_me');
    }
  };

  // Save email when it changes and remember me is enabled
  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (rememberMe) {
      localStorage.setItem('wingman_remembered_email', value);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;

    setError('');

    // Save credentials if remember me is checked
    if (rememberMe) {
      localStorage.setItem('wingman_remembered_email', email);
      localStorage.setItem('wingman_remember_me', 'true');
    }

    // Use the existing form submission logic
    form.onSubmit({ email, password });

    if (mutation.isSuccess) {
      onOpenChange(false);
    }
  };

  // Handle OAuth authentication
  const handleOAuthLogin = async (provider: 'google' | 'linkedin') => {
    try {
      const authFunction = provider === 'google' ? loginWithGoogle : loginWithLinkedIn;
      const result = await authFunction();

      if (result && typeof result === 'object' && 'isCompleted' in result) {
        if (result.isCompleted) {
          // User is completed, close modal and redirect to dashboard
          handleClose();
          // Toast is already handled in useOAuth
        } else {
          // User is not completed, close modal and redirect to register with toast
          handleClose();
          addToast({
            title: 'Complete Your Registration',
            description: 'Please complete your registration process before logging in.',
            color: 'warning',
            timeout: 5000
          });
          router.push('/register');
        }
      }
    } catch (error: unknown) {
      // Check if error message indicates user doesn't exist
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';

      if (
        errorMessage.includes('user not found') ||
        errorMessage.includes('user does not exist') ||
        errorMessage.includes('no account found')
      ) {
        addToast({
          title: 'Account Not Found',
          description: `No account found with this ${provider} profile. Please sign up first.`,
          color: 'danger',
          timeout: 5000
        });
      }
      // Other errors are already handled by useOAuth with toast notifications
    }
  };

  const handleClose = () => {
    // Only clear email if not remembered
    if (!rememberMe) {
      setEmail('');
    }
    setPassword('');
    setError('');
    setShowResetModal(false);
    setResetEmail('');
    setResetSent(false);
    onOpenChange(false);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) return;

    // Simulate API call to send reset email
    try {
      setResetSent(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    }
  };

  const handleBackToLogin = () => {
    setShowResetModal(false);
    setResetEmail('');
    setResetSent(false);
  };

  return (
    <Modal
      backdrop='blur'
      classNames={{
        base: 'bg-background dark:bg-content1',
        backdrop: 'bg-black/50 backdrop-blur-sm'
      }}
      isOpen={isOpen}
      placement='center'
      size='lg'
      onOpenChange={handleClose}
    >
      <ModalContent className='w-full max-w-lg rounded-[24px] shadow-[0px_12px_24px_rgba(0,0,0,0.08)]'>
        <ModalHeader className='flex flex-col items-center pt-8 pb-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center'
          >
            <div className='mb-4'>
              <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px]'>
                <Icon
                  icon={
                    showResetModal ? 'solar:key-minimalistic-square-2-bold' : 'solar:login-2-bold'
                  }
                  className='text-primary h-8 w-8'
                />
              </div>
            </div>
            <h2 className='text-foreground mb-2 text-2xl font-bold tracking-[0.02em]'>
              {showResetModal
                ? resetSent
                  ? 'Check Your Email'
                  : 'Reset Password'
                : 'Welcome Back'}
            </h2>
            <p className='text-default-500 font-normal tracking-[0.02em]'>
              {showResetModal
                ? resetSent
                  ? "We've sent a password reset link to your email"
                  : 'Enter your email to receive a reset link'
                : 'Log in to your account to continue'}
            </p>
          </motion.div>
        </ModalHeader>

        <ModalBody className='px-6'>
          {!showResetModal && (
            <>
              {/* Demo credentials hint */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className='bg-primary/5 border-primary/20 mb-6 rounded-[16px] border p-4'
              >
                <div className='mb-2 flex items-center gap-2'>
                  <Icon icon='solar:info-circle-bold' className='text-primary h-4 w-4' />
                  <p className='text-primary text-sm font-bold tracking-[0.02em]'>Demo Login</p>
                </div>
                <p className='text-default-500 text-sm tracking-[0.02em]'>
                  Email: med.mallat.official@gmail.com
                </p>
                <p className='text-default-500 text-sm tracking-[0.02em]'>Password: 12231223</p>
                <Button
                  className='bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/30 mt-3 h-8 border'
                  size='sm'
                  variant='bordered'
                  onPress={() => {
                    handleEmailChange('med.mallat.official@gmail.com');
                    setPassword('12231223');
                  }}
                >
                  Use Demo Credentials
                </Button>
              </motion.div>
            </>
          )}

          {showResetModal ? (
            // Reset Password Form
            <div className='flex flex-col gap-4'>
              {resetSent ? (
                // Success state
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className='bg-success-50 border-success-200 rounded-[16px] border p-6 text-center'
                >
                  <Icon
                    icon='solar:check-circle-bold'
                    className='text-success mx-auto mb-3 h-12 w-12'
                  />
                  <p className='text-success-700 mb-4 font-medium'>Password reset link sent!</p>
                  <p className='text-default-600 text-sm'>
                    Check your email and follow the instructions to reset your password.
                  </p>
                </motion.div>
              ) : (
                // Reset form
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Input
                    autoFocus
                    isRequired
                    classNames={{
                      base: 'w-full',
                      mainWrapper: 'w-full',
                      inputWrapper:
                        'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50 pl-4',
                      input:
                        'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 pl-2 text-base'
                    }}
                    name='reset-email'
                    placeholder='Enter your email address'
                    startContent={
                      <Icon
                        icon='solar:letter-linear'
                        className='text-default-400 h-5 w-5 flex-shrink-0'
                      />
                    }
                    type='email'
                    value={resetEmail}
                    variant='bordered'
                    onValueChange={setResetEmail}
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className='flex gap-3'
              >
                <Button
                  className='border-default-300 hover:border-primary hover:bg-primary/5 h-12 rounded-[16px] font-medium tracking-[0.02em] transition-all duration-300'
                  variant='bordered'
                  onPress={handleBackToLogin}
                >
                  Back to Login
                </Button>
                {!resetSent && (
                  <Button
                    className='h-12 flex-1 rounded-[16px] font-bold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0px_12px_24px_rgba(59,130,246,0.2)]'
                    color='primary'
                    isDisabled={!resetEmail}
                    onPress={handleResetPassword}
                  >
                    Send Reset Link
                  </Button>
                )}
              </motion.div>
            </div>
          ) : (
            // Login Form
            <>
              <Form
                className='flex flex-col gap-4'
                validationBehavior='native'
                onSubmit={handleSubmit}
              >
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className='bg-danger-50 border-danger-200 mb-4 rounded-[16px] border p-4'
                    >
                      <div className='flex items-center gap-2'>
                        <Icon icon='solar:danger-triangle-bold' className='text-danger h-4 w-4' />
                        <p className='text-danger text-sm font-medium tracking-[0.02em]'>{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className='w-full'
                >
                  <Input
                    autoFocus
                    isRequired
                    classNames={{
                      base: 'w-full',
                      mainWrapper: 'w-full',
                      inputWrapper:
                        'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50 pl-4',
                      input:
                        'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 pl-2 text-base'
                    }}
                    isInvalid={!!error}
                    name='email'
                    placeholder='Email address'
                    startContent={
                      <Icon
                        icon='solar:letter-linear'
                        className='text-default-400 h-5 w-5 flex-shrink-0'
                      />
                    }
                    type='email'
                    value={email}
                    variant='bordered'
                    onValueChange={handleEmailChange}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className='w-full'
                >
                  <Input
                    isRequired
                    classNames={{
                      base: 'w-full',
                      mainWrapper: 'w-full',
                      inputWrapper:
                        'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50 pl-4 pr-4',
                      input:
                        'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 pl-2 text-base'
                    }}
                    endContent={
                      <Button
                        isIconOnly
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className='text-default-400 hover:text-primary h-6 min-w-6 flex-shrink-0 transition-colors'
                        size='sm'
                        type='button'
                        variant='light'
                        onPress={() => {
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? (
                          <Icon
                            className='pointer-events-none text-xl'
                            icon='solar:eye-closed-linear'
                          />
                        ) : (
                          <Icon className='pointer-events-none text-xl' icon='solar:eye-bold' />
                        )}
                      </Button>
                    }
                    isInvalid={!!error}
                    name='password'
                    placeholder='Password'
                    startContent={
                      <Icon
                        icon='solar:lock-password-linear'
                        className='text-default-400 h-5 w-5 flex-shrink-0'
                      />
                    }
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    variant='bordered'
                    onValueChange={setPassword}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className='flex w-full items-center justify-between px-1 py-2'
                >
                  <Checkbox
                    classNames={{
                      label: 'text-default-500 font-normal tracking-[0.02em]',
                      wrapper: 'rounded-[8px]'
                    }}
                    isSelected={rememberMe}
                    name='remember'
                    size='sm'
                    onValueChange={handleRememberMeChange}
                  >
                    Remember me
                  </Checkbox>
                  <div className='flex flex-1 justify-end'>
                    <Button
                      className='text-primary hover:text-primary/80 h-auto min-w-0 p-0 font-medium tracking-[0.02em]'
                      variant='light'
                      size='sm'
                      onPress={() => {
                        setShowResetModal(true);
                      }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className='flex w-full justify-center'
                >
                  <Button
                    className='h-14 w-full max-w-md rounded-[16px] text-lg font-bold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0px_12px_24px_rgba(59,130,246,0.2)]'
                    color='primary'
                    isDisabled={!email || !password || mutation.isLoading}
                    isLoading={mutation.isLoading}
                    startContent={
                      !mutation.isLoading && (
                        <Icon icon='solar:login-2-linear' className='h-5 w-5' />
                      )
                    }
                    type='submit'
                  >
                    {mutation.isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </motion.div>
              </Form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className='flex items-center gap-4 py-6'
              >
                <Divider className='bg-default-200 flex-1' />
                <p className='text-default-500 shrink-0 text-sm font-medium tracking-[0.02em]'>
                  OR
                </p>
                <Divider className='bg-default-200 flex-1' />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className='flex flex-col gap-3'
              >
                <Button
                  className='border-default-300 hover:border-primary hover:bg-primary/5 h-12 rounded-[16px] font-medium tracking-[0.02em] transition-all duration-300'
                  fullWidth
                  startContent={<Icon icon='flat-color-icons:google' width={20} />}
                  variant='bordered'
                  onPress={() => handleOAuthLogin('google')}
                  isLoading={isGoogleLoading}
                >
                  {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
                </Button>
                <Button
                  className='border-default-300 hover:border-primary hover:bg-primary/5 h-12 rounded-[16px] font-medium tracking-[0.02em] transition-all duration-300'
                  fullWidth
                  startContent={<Icon icon='skill-icons:linkedin' width={20} />}
                  variant='bordered'
                  onPress={() => handleOAuthLogin('linkedin')}
                  isLoading={isLinkedInLoading}
                >
                  {isLinkedInLoading ? 'Connecting...' : 'Continue with LinkedIn'}
                </Button>
              </motion.div>
            </>
          )}
        </ModalBody>

        <ModalFooter className='justify-center pt-4 pb-8'>
          {!showResetModal && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className='text-default-500 text-center font-normal tracking-[0.02em]'
            >
              Need to create an account?{' '}
              <Link
                className='text-primary hover:text-primary/80 cursor-pointer font-bold tracking-[0.02em]'
                href='/register'
                onClick={() => {
                  if (onSwitchToRegister) {
                    handleClose();
                    onSwitchToRegister();
                  }
                }}
              >
                Sign Up
              </Link>
            </motion.p>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const Login = () => {
  const { modal } = useLogin();
  const t = useTranslations('AuthPage');

  return (
    <>
      <Button className='text-default-500' radius='full' variant='light' onPress={modal.onOpen}>
        {t('loginButton')}
      </Button>
      <LoginModal
        isOpen={modal.isOpen}
        onOpenChange={modal.onOpenChange}
        onSwitchToRegister={() => {
          // Navigate to register page
          globalThis.location.href = '/register';
        }}
      />
    </>
  );
};

export default Login;
