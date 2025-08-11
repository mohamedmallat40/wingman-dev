'use client';

import React, { useState, useEffect } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { allTopics } from '../data/topics';
import type { Topic } from '../types';
import { BROADCAST_CONSTANTS } from '../constants';
import { TopicSelector, GradientBG } from './onboarding';

interface BroadcastOnboardingProps {
  onComplete: (selectedTopics: Topic[]) => void;
}

export default function BroadcastOnboarding({ onComplete }: BroadcastOnboardingProps) {
  const t = useTranslations('broadcasts.onboarding');
  const [step, setStep] = useState(0);
  const [showTopics, setShowTopics] = useState(false);
  
  const handleConfirm = (selectedIds: string[]) => {
    const selectedTopics = allTopics.filter(topic => selectedIds.includes(topic.id));
    onComplete(selectedTopics);
  };

  useEffect(() => {
    // Sequence the animations
    const timer1 = setTimeout(() => setStep(1), 500);
    const timer2 = setTimeout(() => setStep(2), 1500);
    const timer3 = setTimeout(() => setStep(3), 2500);
    const timer4 = setTimeout(() => setShowTopics(true), 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const welcomeMessages = [
    "Welcome to Wingman",
    "Where knowledge flows like liquid",
    "Enter your personalized universe"
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden'>
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
        
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl" />
      </div>
      
      <div className='relative z-10 p-4 sm:p-8 min-h-screen flex items-center justify-center'>
        <div className='max-w-6xl mx-auto w-full'>
          
          {!showTopics ? (
            /* Welcome Sequence */
            <div className="text-center space-y-8">
              <AnimatePresence mode="wait">
                {step > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    {/* Logo or Brand Icon */}
                    <motion.div
                      className="mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      }}
                    >
                      <Icon icon="solar:satellite-bold" className="h-12 w-12 text-white" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Welcome Messages */}
              <AnimatePresence mode="wait">
                {step > 0 && (
                  <motion.h1
                    key={Math.min(step - 1, welcomeMessages.length - 1)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8 }}
                    className='text-4xl sm:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent'
                  >
                    {welcomeMessages[Math.min(step - 1, welcomeMessages.length - 1)]}
                  </motion.h1>
                )}
              </AnimatePresence>

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="space-y-4"
                >
                  <p className='text-white/80 text-lg sm:text-xl max-w-2xl mx-auto'>
                    Choose the knowledge streams that resonate with your journey
                  </p>
                  
                  {/* Floating elements around text */}
                  <div className="relative">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          y: [-10, 10, -10],
                          opacity: [0.5, 1, 0.5],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            /* Topic Selection */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className='text-center mb-8 sm:mb-12'>
                <motion.h1 
                  className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Craft Your Knowledge Universe
                </motion.h1>
                <motion.p 
                  className='text-white/70 text-base sm:text-lg mb-6 max-w-2xl mx-auto'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Select topics that spark your curiosity and watch your personalized stream come to life
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                {/* Glass container for topic selector */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                  <TopicSelector
                    topics={allTopics}
                    minSelect={BROADCAST_CONSTANTS.MIN_TOPIC_SELECTION}
                    rowCount={BROADCAST_CONSTANTS.DEFAULT_ROW_COUNT}
                    durationSeconds={BROADCAST_CONSTANTS.DEFAULT_ANIMATION_DURATION}
                    onConfirm={handleConfirm}
                  />
                </div>
                
                {/* Ambient glow around the selector */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl -z-10" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Skip option */}
      {step >= 3 && !showTopics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 right-8"
        >
          <Button
            variant="flat"
            className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
            onPress={() => setShowTopics(true)}
          >
            Skip to Selection
          </Button>
        </motion.div>
      )}
    </div>
  );
}
