import React from 'react';
import '../loader.css';
const Loaders: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
        <div className='flex'>
      {/* Hidden SVG for gradients */}
      <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
        <defs>
          <linearGradient id="b" x1="0" y1="62" x2="0" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#973BED" />
            <stop offset="1" stopColor="#007CFF" />
          </linearGradient>
          <linearGradient id="c" x1="0" y1="64" x2="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFC800" />
            <stop offset="1" stopColor="#F0F" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
              keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
              dur="8s"
              repeatCount="indefinite"
              keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
            />
          </linearGradient>
          <linearGradient id="d" x1="0" y1="62" x2="0" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00E0ED" />
            <stop offset="1" stopColor="#00DA72" />
          </linearGradient>
        </defs>
      </svg>

      {/* Left SVG */}
      <svg fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
        <path
          className="dash"
          pathLength="360"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          stroke="url(#b)"
          d="M 54.722656,3.9726563 A 2.0002,2.0002 0 0 0 54.941406,4 h 5.007813 C 58.955121,17.046124 49.099667,27.677057 36.121094,29.580078 a 2.0002,2.0002 0 0 0 -1.708985,1.978516 V 60 H 29.587891 V 31.558594 A 2.0002,2.0002 0 0 0 27.878906,29.580078 C 14.900333,27.677057 5.0448787,17.046124 4.0507812,4 H 9.28125 c 1.231666,11.63657 10.984383,20.554048 22.6875,20.734375 a 2.0002,2.0002 0 0 0 0.02344,0 c 11.806958,0.04283 21.70649,-9.003371 22.730469,-20.7617187 z"
        />
      </svg>

      {/* Center Spinner */}
     

      <div className="w-2" />

      {/* Right SVG */}
      <svg fill="none" viewBox="0 0 64 64" height="64" width="64" className="inline-block">
        <path
          className="dash"
          pathLength="360"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
          stroke="url(#d)"
          d="M 4,4 h 4.6230469 v 25.919922 c -0.00276,11.916203 9.8364941,21.550422 21.7500001,21.296875 11.616666,-0.240651 21.014356,-9.63894 21.253906,-21.25586 a 2.0002,2.0002 0 0 0 0,-0.04102 V 4 H 56.25 v 25.919922 c 0,14.33873 -11.581192,25.919922 -25.919922,25.919922 a 2.0002,2.0002 0 0 0 -0.0293,0 C 15.812309,56.052941 3.998433,44.409961 4,29.919922 Z"
        />
      </svg>
</div>
      {/* Tulisan "yu chat" */}
      <h1 className='text-2xl animate-bounce'>Loading ...</h1>
    </div>
  );
};

export default Loaders;
