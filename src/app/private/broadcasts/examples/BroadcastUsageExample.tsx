'use client';

import React from 'react';
import { NextIntlClientProvider } from 'next-intl';

// Import the enhanced broadcast components
import EnhancedBroadcastPage from '../components/EnhancedBroadcastPage';
import EnhancedContentCreator from '../components/modals/EnhancedContentCreator';
import AdvancedTagInput from '../components/ui/AdvancedTagInput';
import MediaUploadZone from '../components/ui/MediaUploadZone';
import BroadcastErrorHandler from '../components/ui/BroadcastErrorHandler';

// Import hooks
import { useUploadMedia } from '../hooks/useUploadMedia';
import { useBroadcastErrorHandler } from '../components/ui/BroadcastErrorHandler';

/**
 * ENHANCED BROADCAST CREATION SYSTEM
 * 
 * This example demonstrates how to use the comprehensive broadcast creation system
 * with advanced features including:
 * 
 * ✅ Multi-language support (EN, FR, NL)
 * ✅ Advanced media upload with drag & drop
 * ✅ Comprehensive error handling
 * ✅ Auto-save functionality
 * ✅ Advanced tagging system
 * ✅ Real-time validation
 * ✅ Multiple post types (article, video, image, poll, gallery, quote, link)
 * ✅ Accessibility features
 * ✅ Progressive enhancement
 * ✅ Mobile-responsive design
 * ✅ Theme consistency with Hero UI
 */

// Example messages for demo (you can use your actual translation files)
const messages = {
  en: {
    broadcasts: {
      title: 'Broadcast Feed',
      description: 'Share your thoughts with the community',
      create: {
        title: 'Create New Post',
        description: 'Share your thoughts with the community',
        // ... other translations from messages/en.json
      }
    }
  }
};

/**
 * 1. BASIC USAGE - Enhanced Broadcast Page
 * 
 * Simply use the EnhancedBroadcastPage component for a complete broadcast experience
 */
export const BasicUsageExample: React.FC = () => {
  return (
    <NextIntlClientProvider messages={messages} locale="en">
      <EnhancedBroadcastPage />
    </NextIntlClientProvider>
  );
};

/**
 * 2. CUSTOM CONTENT CREATOR
 * 
 * Use the EnhancedContentCreator component in your own modal or page
 */
export const CustomContentCreatorExample: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePublish = (post: any) => {
    console.log('Post published:', post);
    setIsOpen(false);
  };

  const handleSaveDraft = (draft: any) => {
    console.log('Draft saved:', draft);
  };

  return (
    <NextIntlClientProvider messages={messages} locale="en">
      <div className="p-6">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Open Content Creator
        </button>

        <EnhancedContentCreator
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onPublish={handlePublish}
          onSaveDraft={handleSaveDraft}
        />
      </div>
    </NextIntlClientProvider>
  );
};

/**
 * 3. ADVANCED TAG INPUT COMPONENT
 * 
 * Use the AdvancedTagInput component standalone
 */
export const TagInputExample: React.FC = () => {
  const [tags, setTags] = React.useState<string[]>([]);

  // Mock function to search for tag suggestions
  const searchSuggestions = async (query: string) => {
    // Simulate API call
    return [
      { id: '1', name: `${query}-suggestion-1`, count: 100, trending: true },
      { id: '2', name: `${query}-suggestion-2`, count: 50, trending: false }
    ];
  };

  return (
    <NextIntlClientProvider messages={messages} locale="en">
      <div className="p-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Advanced Tag Input</h2>
        
        <AdvancedTagInput
          tags={tags}
          onTagsChange={setTags}
          maxTags={10}
          placeholder="Add tags..."
          onSearchSuggestions={searchSuggestions}
          showPopularTags={true}
        />

        <div className="mt-4">
          <h3 className="font-semibold">Current Tags:</h3>
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify(tags, null, 2)}
          </pre>
        </div>
      </div>
    </NextIntlClientProvider>
  );
};

/**
 * 4. MEDIA UPLOAD ZONE
 * 
 * Use the MediaUploadZone component for file uploads
 */
export const MediaUploadExample: React.FC = () => {
  const [files, setFiles] = React.useState<any[]>([]);
  const { uploadMultiple, isUploading } = useUploadMedia();

  const handleUpload = async (uploadFiles: File[], type: 'image' | 'video') => {
    try {
      console.log('Uploading files:', uploadFiles, 'Type:', type);
      // await uploadMultiple(uploadFiles, type);
      // For demo, just simulate success
      console.log('Upload successful!');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <NextIntlClientProvider messages={messages} locale="en">
      <div className="p-6 max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Media Upload Zone</h2>
        
        <MediaUploadZone
          files={files}
          onFilesChange={setFiles}
          onUpload={handleUpload}
          maxFiles={10}
          allowedTypes={['image', 'video']}
          isUploading={isUploading}
        />

        <div className="mt-4">
          <h3 className="font-semibold">Uploaded Files:</h3>
          <pre className="bg-gray-100 p-2 rounded mt-2 text-sm">
            {JSON.stringify(files.map(f => ({ 
              name: f.file?.name, 
              type: f.type, 
              size: f.size 
            })), null, 2)}
          </pre>
        </div>
      </div>
    </NextIntlClientProvider>
  );
};

/**
 * 5. ERROR HANDLING
 * 
 * Demonstrate comprehensive error handling
 */
export const ErrorHandlingExample: React.FC = () => {
  const [currentError, setCurrentError] = React.useState<any>(null);
  const { handleError } = useBroadcastErrorHandler();

  const simulateError = (errorType: string) => {
    let error;
    
    switch (errorType) {
      case 'network':
        error = { code: 'NETWORK_ERROR', message: 'Network connection failed' };
        break;
      case 'upload':
        error = { code: 'UPLOAD_FAILED', message: 'File upload failed' };
        break;
      case 'validation':
        error = { code: 'INVALID_DATA', message: 'Form validation failed', field: 'title' };
        break;
      case 'server':
        error = { code: 'SERVER_ERROR', message: 'Internal server error' };
        break;
      default:
        error = { message: 'Unknown error occurred' };
    }

    const broadcastError = handleError(error, 'create');
    setCurrentError(broadcastError);
  };

  return (
    <NextIntlClientProvider messages={messages} locale="en">
      <div className="p-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Error Handling</h2>
        
        <div className="space-x-2 mb-4">
          <button 
            onClick={() => simulateError('network')}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Network Error
          </button>
          <button 
            onClick={() => simulateError('upload')}
            className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
          >
            Upload Error
          </button>
          <button 
            onClick={() => simulateError('validation')}
            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
          >
            Validation Error
          </button>
          <button 
            onClick={() => simulateError('server')}
            className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
          >
            Server Error
          </button>
        </div>

        {currentError && (
          <BroadcastErrorHandler
            error={currentError}
            onRetry={() => console.log('Retrying...')}
            onDismiss={() => setCurrentError(null)}
            showDetails={true}
          />
        )}
      </div>
    </NextIntlClientProvider>
  );
};

/**
 * 6. INTEGRATION GUIDE
 * 
 * How to integrate the enhanced broadcast system into your app
 */
export const IntegrationGuide: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl prose">
      <h1>Enhanced Broadcast System Integration Guide</h1>
      
      <h2>🚀 Quick Start</h2>
      <ol>
        <li>
          <strong>Import the main component:</strong>
          <pre className="bg-gray-100 p-2 rounded">
{`import EnhancedBroadcastPage from './broadcasts/components/EnhancedBroadcastPage';`}
          </pre>
        </li>
        
        <li>
          <strong>Wrap with translation provider:</strong>
          <pre className="bg-gray-100 p-2 rounded">
{`<NextIntlClientProvider messages={messages} locale="en">
  <EnhancedBroadcastPage />
</NextIntlClientProvider>`}
          </pre>
        </li>
      </ol>

      <h2>🛠️ Customization Options</h2>
      
      <h3>1. Content Creator</h3>
      <ul>
        <li>Custom post types</li>
        <li>Custom validation rules</li>
        <li>Custom upload handlers</li>
        <li>Custom tag suggestions</li>
      </ul>

      <h3>2. Error Handling</h3>
      <ul>
        <li>Custom error messages</li>
        <li>Custom retry logic</li>
        <li>Error logging integration</li>
        <li>User notification systems</li>
      </ul>

      <h3>3. Media Upload</h3>
      <ul>
        <li>Custom file size limits</li>
        <li>Custom file type restrictions</li>
        <li>Custom upload progress tracking</li>
        <li>Custom preview components</li>
      </ul>

      <h2>🌍 Multi-language Support</h2>
      <p>
        The system supports English, French, and Dutch out of the box. 
        All error messages, UI text, and validation messages are fully translated.
      </p>

      <h2>♿ Accessibility Features</h2>
      <ul>
        <li>Screen reader support</li>
        <li>Keyboard navigation</li>
        <li>Alt text for images</li>
        <li>ARIA labels and descriptions</li>
        <li>High contrast support</li>
      </ul>

      <h2>📱 Responsive Design</h2>
      <p>
        The system is fully responsive and works seamlessly on desktop, tablet, and mobile devices.
        It includes special mobile optimizations like floating action buttons and touch-friendly interfaces.
      </p>

      <h2>🎨 Theme Integration</h2>
      <p>
        Built with Hero UI components and follows your existing theme configuration.
        All colors, spacing, and typography are consistent with your design system.
      </p>
    </div>
  );
};

/**
 * 7. COMPLETE DEMO
 * 
 * A complete example showing all features together
 */
export const CompleteDemo: React.FC = () => {
  return (
    <NextIntlClientProvider messages={messages} locale="en">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Enhanced Broadcast System Demo
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Usage */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-4">1. Complete Broadcast Page</h2>
              <BasicUsageExample />
            </div>

            {/* Custom Creator */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-4">2. Custom Content Creator</h2>
              <CustomContentCreatorExample />
            </div>

            {/* Tag Input */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-4">3. Advanced Tag Input</h2>
              <TagInputExample />
            </div>

            {/* Media Upload */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-4">4. Media Upload Zone</h2>
              <MediaUploadExample />
            </div>

            {/* Error Handling */}
            <div className="bg-white rounded-lg p-6 shadow lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">5. Error Handling</h2>
              <ErrorHandlingExample />
            </div>
          </div>

          {/* Integration Guide */}
          <div className="bg-white rounded-lg p-6 shadow mt-8">
            <IntegrationGuide />
          </div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
};

export default CompleteDemo;
