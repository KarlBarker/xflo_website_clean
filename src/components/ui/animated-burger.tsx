"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBurgerProps {
  isOpen: boolean;
  onClick?: () => void;
  className?: string;
  darkMode?: boolean;
}

export function AnimatedBurger({ isOpen, onClick, className, darkMode = false }: AnimatedBurgerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-[74px] h-[74px] focus:outline-none group",
        className
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* Top bar */}
        <div
          className={cn(
            "absolute h-1 rounded-full transform-gpu origin-left",
            darkMode ? "bg-content-inverse" : "bg-content-primary",
            isOpen ? "animate-topBarOpen" : "animate-topBarClose"
          )}
          style={{
            top: '18px',
            left: '50%',
            marginLeft: '-20px',
            width: '40px'
          }}
        />
        
        {/* Bottom bar */}
        <div
          className={cn(
            "absolute h-1 rounded-full transform-gpu origin-right",
            darkMode ? "bg-content-inverse" : "bg-content-primary",
            isOpen ? "animate-bottomBarOpen" : "animate-bottomBarClose"
          )}
          style={{
            top: '30px',
            right: '50%',
            marginRight: '-20px',
            width: '40px'
          }}
        />
        
        {/* MENU text */}
        <span
          className={cn(
            "absolute text-xs font-bold tracking-widest transform-gpu",
            darkMode ? "text-content-inverse" : "text-content-primary",
            isOpen ? "animate-menuLabelOpen" : "animate-menuLabelClose"
          )}
          style={{
            bottom: '16px',
            fontSize: '9px',
            letterSpacing: '4.4px',
            marginLeft: '-1.7px',
            marginRight: '-4.4px'
          }}
        >
          MENU
        </span>
      </div>
      
      <style jsx>{`
        @keyframes topBarOpen {
          0% { transform: translateY(0px) rotate(0deg); width: 40px; }
          10% { transform: translateY(-8px) rotate(0deg); width: 40px; }
          50% { transform: translateY(10px) rotate(45deg); width: 48px; }
          75% { transform: translateY(5px) rotate(45deg); width: 48px; }
          100% { transform: translateY(7px) rotate(45deg); width: 48px; }
        }
        
        @keyframes bottomBarOpen {
          0% { transform: translateY(0px) rotate(0deg); width: 40px; }
          10% { transform: translateY(-4px) rotate(0deg); width: 40px; }
          60% { transform: translateY(-10px) rotate(-45deg); width: 48px; }
          75% { transform: translateY(-15px) rotate(-45deg); width: 48px; }
          100% { transform: translateY(-13px) rotate(-45deg); width: 48px; }
        }
        
        @keyframes menuLabelOpen {
          0% { transform: translateY(0px); opacity: 1; }
          25% { transform: translateY(-10px); }
          45% { transform: translateY(20px); opacity: 1; }
          48% { transform: translateY(25px); opacity: 0; }
          100% { transform: translateY(15px); opacity: 0; }
        }
        
        @keyframes topBarClose {
          0% { transform: translateY(7px) rotate(45deg); width: 48px; }
          35% { transform: translateY(-4px) rotate(-2deg); width: 40px; }
          53% { transform: translateY(5px) rotate(1.5deg); width: 40px; }
          70% { transform: translateY(-3px) rotate(0deg); width: 40px; }
          100% { transform: translateY(0px) rotate(0deg); width: 40px; }
        }
        
        @keyframes bottomBarClose {
          0% { transform: translateY(-13px) rotate(-45deg); width: 48px; }
          35% { transform: translateY(-8px) rotate(3deg); width: 40px; }
          53% { transform: translateY(-5px) rotate(-1.5deg); width: 40px; }
          68% { transform: translateY(-7px) rotate(0deg); width: 40px; }
          100% { transform: translateY(0px) rotate(0deg); width: 40px; }
        }
        
        @keyframes menuLabelClose {
          0% { transform: translateY(15px); opacity: 0; }
          5% { transform: translateY(12px); opacity: 1; }
          25% { transform: translateY(-15px); opacity: 1; }
          37% { transform: translateY(-11px); opacity: 1; }
          45% { transform: translateY(-11px); opacity: 1; }
          58% { transform: translateY(4px) rotate(-5deg); opacity: 1; }
          83% { transform: translateY(-3px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(0px); opacity: 1; }
        }
        
        .animate-topBarOpen {
          animation: topBarOpen 1s ease-in-out forwards;
        }
        .animate-bottomBarOpen {
          animation: bottomBarOpen 1s ease-in-out forwards;
        }
        .animate-menuLabelOpen {
          animation: menuLabelOpen 1s ease-in forwards;
        }
        .animate-topBarClose {
          animation: topBarClose 1s ease-in-out forwards;
        }
        .animate-bottomBarClose {
          animation: bottomBarClose 1s ease-in-out forwards;
        }
        .animate-menuLabelClose {
          animation: menuLabelClose 1s ease-in forwards;
        }
      `}</style>
    </button>
  );
}