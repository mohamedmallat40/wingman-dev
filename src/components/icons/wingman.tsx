interface WingmanIconProps {
  className?: string;
}

export const WingmanIcon = ({ className }: WingmanIconProps) => {
  return (
    <svg
      width='36'
      height='36'
      viewBox='0 0 64 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={`acme-logo-flying ${className || ''}`}
    >
      <style>{`
          @keyframes wing-flap-left {
            0% {
              transform: rotate(0deg) scaleY(1);
            }
            25% {
              transform: rotate(-25deg) scaleY(0.8);
            }
            50% {
              transform: rotate(-35deg) scaleY(0.6);
            }
            75% {
              transform: rotate(-15deg) scaleY(0.9);
            }
            100% {
              transform: rotate(0deg) scaleY(1);
            }
          }
          
          @keyframes wing-flap-right {
            0% {
              transform: rotate(0deg) scaleY(1);
            }
            25% {
              transform: rotate(25deg) scaleY(0.8);
            }
            50% {
              transform: rotate(35deg) scaleY(0.6);
            }
            75% {
              transform: rotate(15deg) scaleY(0.9);
            }
            100% {
              transform: rotate(0deg) scaleY(1);
            }
          }
          
          @keyframes gentle-float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            25% {
              transform: translateY(-1px) translateX(0.5px);
            }
            50% {
              transform: translateY(-2px) translateX(0px);
            }
            75% {
              transform: translateY(-1px) translateX(-0.5px);
            }
          }
          
          @keyframes wing-shimmer {
            0%, 100% {
              opacity: 0.9;
            }
            50% {
              opacity: 1;
            }
          }
          
          .acme-logo-flying {
            animation: gentle-float 3s ease-in-out infinite;
          }
          
          .acme-logo-flying .left-wing {
            transform-origin: 28px 18px;
            animation: wing-flap-left 0.8s ease-in-out infinite, wing-shimmer 1.6s ease-in-out infinite;
          }
          
          .acme-logo-flying .right-wing {
            transform-origin: 36px 18px;
            animation: wing-flap-right 0.8s ease-in-out infinite, wing-shimmer 1.6s ease-in-out infinite;
          }
          
          .acme-logo-flying .body {
            animation: gentle-float 3s ease-in-out infinite;
          }
        `}</style>

      {/* Left Wing */}
      <path
        className='left-wing'
        d='M2 20C3 14 8 6 18 4C22 3.2 26 4.5 28 7C29.5 9 29.5 11.5 27.5 13C25.5 14.5 22 16 20 18.5C18.5 20.5 17 22 15.5 23C14 24 12 24.5 10 24C6 23 3 22.5 2 20Z
             M8 12C12 10 16 8.5 20 9C22 9.2 24 10 25 11.5C25.5 12.5 25 13.5 24 14C22 15 19 16.5 17 18C15 19.5 13 21 11 21.5C9 22 7.5 21 7 19.5C6.5 18 6.8 16 8 14C8 13.3 8 12.6 8 12Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />

      {/* Right Wing */}
      <path
        className='right-wing'
        d='M62 20C61 14 56 6 46 4C42 3.2 38 4.5 36 7C34.5 9 34.5 11.5 36.5 13C38.5 14.5 42 16 44 18.5C45.5 20.5 47 22 48.5 23C50 24 52 24.5 54 24C58 23 61 22.5 62 20Z
             M56 12C52 10 48 8.5 44 9C42 9.2 40 10 39 11.5C38.5 12.5 39 13.5 40 14C42 15 45 16.5 47 18C49 19.5 51 21 53 21.5C55 22 56.5 21 57 19.5C57.5 18 57.2 16 56 14C56 13.3 56 12.6 56 12Z'
        fill='currentColor'
        fillRule='evenodd'
        clipRule='evenodd'
      />

      {/* Body */}
      <ellipse className='body' cx='32' cy='18' rx='2' ry='4' fill='currentColor' opacity='0.8' />

      {/* Wing details - membrane lines */}
      <g className='left-wing' opacity='0.3'>
        <path d='M12 15C16 14 20 13.5 24 15' stroke='currentColor' strokeWidth='0.5' fill='none' />
        <path
          d='M10 18C14 17.5 18 17 22 18.5'
          stroke='currentColor'
          strokeWidth='0.5'
          fill='none'
        />
      </g>

      <g className='right-wing' opacity='0.3'>
        <path d='M52 15C48 14 44 13.5 40 15' stroke='currentColor' strokeWidth='0.5' fill='none' />
        <path
          d='M54 18C50 17.5 46 17 42 18.5'
          stroke='currentColor'
          strokeWidth='0.5'
          fill='none'
        />
      </g>
    </svg>
  );
};
