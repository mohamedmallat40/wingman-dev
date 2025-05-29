'use client';

import React from 'react';

import { Button } from '@heroui/button';
import { Checkbox, Divider, Link, Form } from '@heroui/react';
import { Icon } from '@iconify/react';

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody} from "@heroui/modal";
import PassowrdInput from '@/components/password-input/PassowrdInput';
import useLogin from '@root/modules/auth/hooks/useLogin';
import TextInput from '@/components/text-input/TextInput';
import { useTranslations } from 'next-intl';

const Login = () => {
    const { form, modal, mutation } = useLogin()
    const t=useTranslations('AuthPage')
    return (
        <>
            <Button className='text-default-500' radius='full' variant='light' onClick={modal.onOpen}>
                {t('loginButton')}
            </Button>
            <Modal isOpen={modal.isOpen} size='xl' onOpenChange={modal.onOpenChange}>
                <ModalContent className='p-8'>
                    <>
                        <ModalHeader className="flex flex-col gap-1 text-center">
                            <h1 className="text-xl font-medium">{t('title')}</h1>
                            <p className="text-small text-default-500">to continue to Wingman</p>
                        </ModalHeader>
                        <ModalBody>
                            <Form className='flex flex-col gap-3' onSubmit={form.handleSubmit(form.onSubmit)}>
                                <TextInput
                                    label={t('email')}
                                    placeholder='Enter your email'
                                    {...form.register('email')}
                                    error={form?.errors?.email}

                                />
                                <PassowrdInput
                                    label={t('password')}
                                    error={form?.errors?.password}

                                    {...form.register('password')}
                                />
                                <div className='flex w-full items-center justify-between px-1 py-2'>
                                    <Checkbox name='remember' size='sm'>
                                        Remember me
                                    </Checkbox>
                                    <Link className='text-default-500' href='#' size='sm'>
                                        Forgot password?
                                    </Link>
                                </div>
                                <Button className='w-full' color='primary' type='submit' isLoading={mutation.isLoading}>
                           {t('loginButton')}
                                </Button>
                            </Form>
                            <div className='flex items-center gap-4 py-2'>
                                <Divider className='flex-1' />
                                <p className='shrink-0 text-tiny text-default-500'>OR</p>
                                <Divider className='flex-1' />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Button
                                    startContent={<Icon icon='flat-color-icons:google' width={24} />}
                                    variant='bordered'
                                >
                            {t('continueWithGoogle')}
                                </Button>
                                <Button
                                    startContent={<Icon className='text-default-500' icon='fe:linkedin' width={24} />}
                                    variant='bordered'
                                >
                            {t('continueWithLinkedin')}
                                </Button>
                            </div>
                            <p className='text-center text-small'>
                                Need to create an account?&nbsp;
                                <Link href='#' size='sm'>
                                    Sign Up
                                </Link>
                            </p>

                        </ModalBody>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Login;
