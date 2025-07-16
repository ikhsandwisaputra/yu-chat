import React from 'react';
import '../button.css'; // import the CSS animation

const SendButton: React.FC = () => {
  return (
    <button
      className="flex items-center bg-[#0000001a] text-gray-600 text-lg px-5 py-1  rounded-2xl overflow-hidden cursor-pointer transition-transform duration-200 active:scale-95 group"
    >
      <div className="relative w-6 h-6 mr-2">
        <div className="absolute inset-0 fly-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="transform transition-transform duration-300 group-hover:translate-x-5 group-hover:rotate-45 group-hover:scale-110"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            />
          </svg>
        </div>
      </div>
      <span className="transition-transform duration-300 group-hover:translate-x-20">Send</span>
    </button>
  );
};

export default SendButton;
