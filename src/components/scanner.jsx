import React, { useState, useEffect, useRef } from 'react';

// --- Configuration ---
const ROWS = 15;
const COLS = 20;
const WAVE_WIDTH = 6; 
const ANIMATION_SPEED_MS = 50; 
const COLOR_PALETTES = [
    { r: 0, g: 255, b: 120 },   // Halka Green
    { r: 0, g: 200, b: 255 },  // Aasmani
    { r: 0, g: 100, b: 255 },  // Neela
    { r: 180, g: 0, b: 255 },  // Baingani
    { r: 255, g: 0, b: 150 },  // Gulabi
];

// Saari styling ab is component ke andar hi hai taaki import error na aaye.
const styles = `
    .scanner-container {
        background-color: #111827;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        font-family: system-ui, -apple-system, sans-serif;
    }
    .title-container {
        width: 100%;
        max-width: 896px;
        text-align: center;
        margin-bottom: 2rem;
    }
    .title-container h1 {
        font-size: 2.25rem;
        font-weight: 700;
        color: white;
        margin-bottom: 0.5rem;
        letter-spacing: 0.05em;
    }
    @media (min-width: 768px) {
        .title-container h1 {
            font-size: 3rem;
        }
    }
    .title-container p {
        font-size: 1.125rem;
        color: #9CA3AF;
    }
    .grid-wrapper {
        background-color: black;
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid #374151;
        transition: box-shadow 300ms ease-in-out;
    }
    .grid-container {
        display: grid;
        gap: 6px;
    }
    .cell {
        width: 100%;
        height: 100%;
        transition: background-color 75ms;
    }
`;

// Cell Component
const Cell = React.memo(({ color }) => {
    return (
        <div 
            className="cell"
            style={{ 
                backgroundColor: color,
                boxShadow: color !== 'rgb(17, 24, 39)' ? `0 0 2px ${color}, 0 0 5px ${color}` : 'none'
            }}
        />
    );
});

// Scanner Component
function Scanner() {
    const [position, setPosition] = useState(0);
    const [colorIndex, setColorIndex] = useState(0);
    // direction state ko useRef se replace kiya gaya hai taaki animation continuous chale
    const directionRef = useRef(1);
    
    useEffect(() => {
        const animationInterval = setInterval(() => {
            setPosition(prevPos => {
                const newPos = prevPos + directionRef.current;

                // Jab wave end par pahunche to direction badal do
                if (newPos >= COLS - 1 || newPos <= 0) {
                    directionRef.current *= -1; // Direction ko ulta kar do
                    setColorIndex(ci => (ci + 1) % COLOR_PALETTES.length);
                }
                
                return Math.max(0, Math.min(COLS - 1, newPos));
            });
        }, ANIMATION_SPEED_MS);

        return () => clearInterval(animationInterval);
    }, []); // Dependency array ko khaali rakha gaya hai taaki interval baar baar na bane

    const getCellColor = (row, col) => {
        const distance = Math.abs(col - position);
        const baseColor = COLOR_PALETTES[colorIndex];
        
        if (distance < WAVE_WIDTH) {
            const intensity = 1 - (distance / WAVE_WIDTH);
            const verticalFade = 1 - (row / (ROWS * 1.5));
            const r = Math.floor(baseColor.r * intensity * verticalFade);
            const g = Math.floor(baseColor.g * intensity * verticalFade);
            const b = Math.floor(baseColor.b * intensity * verticalFade);
            return `rgb(${r}, ${g}, ${b})`;
        }
        return 'rgb(17, 24, 39)';
    };

    return (
        <>
            <style>{styles}</style>
            <div className="scanner-container">
                 <div className="title-container">
                    <h1>Scanner Wave</h1>
                    <p>A dynamic light pattern simulation built with React.</p>
                </div>
                <div 
                    className="grid-wrapper"
                    style={{
                        boxShadow: `0 0 30px rgba(${COLOR_PALETTES[colorIndex].r}, ${COLOR_PALETTES[colorIndex].g}, ${COLOR_PALETTES[colorIndex].b}, 0.3)`
                    }}
                >
                    <div 
                        className="grid-container"
                        style={{
                            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                            width: 'clamp(300px, 90vw, 800px)',
                            aspectRatio: `${COLS} / ${ROWS}`
                        }}
                    >
                        {Array.from({ length: ROWS * COLS }).map((_, index) => {
                            const row = Math.floor(index / COLS);
                            const col = index % COLS;
                            return <Cell key={index} color={getCellColor(row, col)} />;
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
export default Scanner ;