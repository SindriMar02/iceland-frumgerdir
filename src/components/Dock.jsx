'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Children, cloneElement, useMemo, useRef } from 'react';

import './Dock.css';

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize, label }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  // the icon box sits in a fixed-height slot (sized to the max magnification) so it can grow/shrink
  // on hover WITHOUT displacing the caption below - the caption stays put, always visible, never
  // only-on-hover, so people know where a button goes before they ever touch it.
  return (
    <div className="dock-item-col">
      <div className="dock-item-slot" style={{ height: magnification }}>
        <motion.div
          ref={ref}
          style={{
            width: size,
            height: size
          }}
          onHoverStart={() => isHovered.set(1)}
          onHoverEnd={() => isHovered.set(0)}
          onFocus={() => isHovered.set(1)}
          onBlur={() => isHovered.set(0)}
          onClick={onClick}
          className={`dock-item ${className}`}
          tabIndex={0}
          role="button"
          aria-haspopup="true"
          aria-label={label}
          onKeyDown={handleKeyDown}
        >
          {Children.map(children, child => cloneElement(child, { isHovered }))}
        </motion.div>
      </div>
      {label ? <span className="dock-caption">{label}</span> : null}
    </div>
  );
}

function DockIcon({ children, className = '' }) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height, scrollbarWidth: 'none' }} className="dock-outer">
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            label={item.label}
          >
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
