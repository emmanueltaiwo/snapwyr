import { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  HardDrive,
  Calendar,
  Terminal,
  FileCode,
  AlertCircle,
} from 'lucide-react';
import type { LogEntry } from '../types';
import {
  formatFullTime,
  formatDuration,
  formatBytes,
  getStatusClass,
  generateCurl,
  copyToClipboard,
} from '../utils/format';

interface RequestDetailProps {
  request: LogEntry;
  onClose: () => void;
}

export function RequestDetail({ request, onClose }: RequestDetailProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [showRequest, setShowRequest] = useState(true);
  const [showResponse, setShowResponse] = useState(true);

  const handleCopy = async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const curl = generateCurl(request);
  const statusClass = getStatusClass(request.status);

  return (
    <div
      className='h-full flex flex-col'
      style={{
        background: 'var(--color-bg)',
        borderLeft: '1px solid var(--color-border)',
      }}
    >
      {/* Header */}
      <div
        className='shrink-0 flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b glass'
        style={{
          borderColor: 'var(--color-border)',
          background: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <div className='flex items-center gap-2 sm:gap-3 min-w-0 flex-1'>
          {request.direction && (
            <div
              className='flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border shrink-0'
              style={{
                background:
                  request.direction === 'incoming'
                    ? 'rgba(59, 130, 246, 0.15)'
                    : 'rgba(139, 92, 246, 0.15)',
                borderColor:
                  request.direction === 'incoming'
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(139, 92, 246, 0.3)',
                color: request.direction === 'incoming' ? '#60a5fa' : '#a78bfa',
              }}
            >
              {request.direction === 'incoming' ? (
                <ArrowDownLeft className='w-2.5 h-2.5 sm:w-3 sm:h-3' />
              ) : (
                <ArrowUpRight className='w-2.5 h-2.5 sm:w-3 sm:h-3' />
              )}
              <span className='text-[10px] sm:text-xs font-medium hidden xs:inline'>
                {request.direction === 'incoming' ? 'Incoming' : 'Outgoing'}
              </span>
            </div>
          )}
          <span
            className={`method-badge method-${request.method.toLowerCase()} shrink-0`}
          >
            {request.method}
          </span>
          <div
            className={`text-lg sm:text-2xl font-bold tabular-nums ${statusClass}`}
          >
            {request.status || 'ERR'}
          </div>
        </div>
        <button
          onClick={onClose}
          className='p-1.5 sm:p-2 rounded-lg transition-all duration-200 shrink-0'
          style={{
            color: 'var(--color-text-tertiary)',
            background: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-bg-tertiary)';
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-tertiary)';
          }}
        >
          <X className='w-4 h-4 sm:w-5 sm:h-5' />
        </button>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4'>
        {/* URL Section */}
        <Section title='URL' icon={FileCode}>
          <div className='flex items-start justify-between gap-2 sm:gap-3'>
            <code
              className='text-xs sm:text-sm break-all flex-1'
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-primary)',
                lineHeight: '1.6',
              }}
            >
              {request.url}
            </code>
            <CopyButton
              copied={copied === 'url'}
              onCopy={() => handleCopy(request.url, 'url')}
            />
          </div>
        </Section>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 gap-2 sm:gap-3'>
          <InfoCard
            icon={Calendar}
            label='Timestamp'
            value={formatFullTime(request.timestamp)}
          />
          <InfoCard
            icon={Clock}
            label='Duration'
            value={formatDuration(request.duration)}
            highlight={request.slow}
            highlightColor='var(--color-warning)'
          />
          {request.requestSize !== undefined && (
            <InfoCard
              icon={HardDrive}
              label='Request Size'
              value={formatBytes(request.requestSize)}
            />
          )}
          {request.responseSize !== undefined && (
            <InfoCard
              icon={HardDrive}
              label='Response Size'
              value={formatBytes(request.responseSize)}
            />
          )}
        </div>

        {/* Error Alert */}
        {request.error && (
          <div
            className='p-4 rounded-lg border'
            style={{
              background: 'var(--color-error-bg)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <div className='flex items-start gap-3'>
              <AlertCircle
                className='w-5 h-5 shrink-0 mt-0.5'
                style={{ color: 'var(--color-error)' }}
              />
              <div className='flex-1'>
                <div
                  className='text-sm font-semibold mb-1'
                  style={{ color: 'var(--color-error)' }}
                >
                  Error
                </div>
                <div
                  className='text-sm'
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {request.error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Body */}
        {request.requestBody && (
          <Collapsible
            title='Request Body'
            icon={FileCode}
            open={showRequest}
            onToggle={() => setShowRequest(!showRequest)}
            onCopy={() => handleCopy(request.requestBody!, 'req')}
            copied={copied === 'req'}
          >
            <JsonView content={request.requestBody} />
          </Collapsible>
        )}

        {/* Response Body */}
        {request.responseBody && (
          <Collapsible
            title='Response Body'
            icon={FileCode}
            open={showResponse}
            onToggle={() => setShowResponse(!showResponse)}
            onCopy={() => handleCopy(request.responseBody!, 'res')}
            copied={copied === 'res'}
          >
            <JsonView content={request.responseBody} />
          </Collapsible>
        )}

        {/* cURL Section */}
        <Section title='cURL Command' icon={Terminal}>
          <div className='flex items-start justify-between gap-2 sm:gap-3'>
            <pre
              className='text-[10px] sm:text-xs overflow-x-auto flex-1 rounded-md p-2 sm:p-3'
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-success)',
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border)',
                lineHeight: '1.6',
              }}
            >
              {curl}
            </pre>
            <CopyButton
              copied={copied === 'curl'}
              onCopy={() => handleCopy(curl, 'curl')}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className='flex items-center gap-2 mb-3'>
        <Icon
          className='w-4 h-4'
          style={{ color: 'var(--color-text-tertiary)' }}
        />
        <h3
          className='text-xs font-semibold uppercase tracking-wider'
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {title}
        </h3>
      </div>
      <div
        className='p-4 rounded-lg border'
        style={{
          background: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  highlight,
  highlightColor,
}: {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
  value: string;
  highlight?: boolean;
  highlightColor?: string;
}) {
  return (
    <div
      className='p-2.5 sm:p-4 rounded-lg border transition-all duration-200'
      style={{
        background: 'var(--color-bg-secondary)',
        borderColor: highlight
          ? highlightColor || 'var(--color-warning)'
          : 'var(--color-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-bg-tertiary)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-bg-secondary)';
        e.currentTarget.style.borderColor = highlight
          ? highlightColor || 'var(--color-warning)'
          : 'var(--color-border)';
      }}
    >
      <div className='flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2'>
        <Icon
          className='w-3 h-3 sm:w-4 sm:h-4'
          style={{ color: 'var(--color-text-tertiary)' }}
        />
        <div
          className='text-[9px] sm:text-[10px] font-medium uppercase tracking-wider'
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {label}
        </div>
      </div>
      <div
        className='text-sm sm:text-base font-semibold tabular-nums'
        style={{
          color: highlight
            ? highlightColor || 'var(--color-warning)'
            : 'var(--color-text-primary)',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function CopyButton({
  copied,
  onCopy,
}: {
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <button
      onClick={onCopy}
      className='shrink-0 p-2 rounded-lg transition-all duration-200'
      style={{
        color: copied ? 'var(--color-success)' : 'var(--color-text-tertiary)',
        background: copied
          ? 'var(--color-success-bg)'
          : 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border)',
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.background = 'var(--color-bg-elevated)';
          e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.background = 'var(--color-bg-tertiary)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }
      }}
    >
      {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
    </button>
  );
}

function Collapsible({
  title,
  icon: Icon,
  open,
  onToggle,
  onCopy,
  copied,
  children,
}: {
  title: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  open: boolean;
  onToggle: () => void;
  onCopy: () => void;
  copied: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className='rounded-lg border overflow-hidden'
      style={{
        borderColor: 'var(--color-border)',
        background: 'var(--color-bg-secondary)',
      }}
    >
      <div
        className='flex items-center justify-between px-4 py-3'
        style={{ background: 'var(--color-bg-tertiary)' }}
      >
        <button
          onClick={onToggle}
          className='flex items-center gap-2 text-sm font-medium transition-colors'
          style={{ color: 'var(--color-text-primary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
        >
          {open ? (
            <ChevronDown className='w-4 h-4' />
          ) : (
            <ChevronRight className='w-4 h-4' />
          )}
          <Icon className='w-4 h-4' />
          {title}
        </button>
        <CopyButton copied={copied} onCopy={onCopy} />
      </div>
      {open && (
        <div
          className='p-4'
          style={{ background: 'var(--color-bg-secondary)' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function JsonView({ content }: { content: string }) {
  try {
    const parsed = JSON.parse(content);
    const formatted = JSON.stringify(parsed, null, 2);
    return (
      <div
        className='rounded-md border overflow-hidden'
        style={{
          background: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
          maxHeight: '300px',
        }}
      >
        <pre
          className='text-[10px] sm:text-xs p-3 sm:p-4 overflow-auto'
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.8',
            maxHeight: '300px',
          }}
        >
          {formatted}
        </pre>
      </div>
    );
  } catch {
    return (
      <div
        className='rounded-md border overflow-hidden'
        style={{
          background: 'var(--color-bg)',
          borderColor: 'var(--color-border)',
          maxHeight: '300px',
        }}
      >
        <pre
          className='text-[10px] sm:text-xs p-3 sm:p-4 overflow-auto'
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.8',
            maxHeight: '300px',
          }}
        >
          {content}
        </pre>
      </div>
    );
  }
}
