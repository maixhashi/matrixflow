import React from 'react';

const ArrowRenderer = ({ from, to, color, strokeWidth }) => {
    // 始点と終点の座標を取得
    const startX = from.left + from.width / 2;
    const startY = from.bottom;
    const endX = to.left + to.width / 2;
    const endY = to.top;

    // 矢印のパスを定義（曲線や直線で調整可能）
    const pathData = `M${startX},${startY} L${endX},${endY}`;

    return (
        <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
            <path d={pathData} fill="none" stroke={color} strokeWidth={strokeWidth} />
        </svg>
    );
};

export default ArrowRenderer;