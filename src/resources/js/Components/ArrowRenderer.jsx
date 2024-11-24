import React from 'react';

const ArrowRenderer = ({ from, to, color, strokeWidth }) => {
    // 始点と終点の座標を取得
    const startX = from.left + from.width / 2;
    const startY = from.bottom;
    const endX = to.left + to.width / 2;
    const endY = to.top;

    // 矢印のパスを定義（直線を描画）
    const pathData = `M${startX},${startY} L${endX},${endY}`;

    // 矢印の先端を描画するための三角形
    const arrowHeadSize = 10;  // 矢印の大きさ
    const angle = Math.atan2(endY - startY, endX - startX);  // 始点から終点に向かう角度
    const arrowHeadX1 = endX - arrowHeadSize * Math.cos(angle - Math.PI / 6);  // 矢印の左の先端
    const arrowHeadY1 = endY - arrowHeadSize * Math.sin(angle - Math.PI / 6);
    const arrowHeadX2 = endX - arrowHeadSize * Math.cos(angle + Math.PI / 6);  // 矢印の右の先端
    const arrowHeadY2 = endY - arrowHeadSize * Math.sin(angle + Math.PI / 6);

    return (
        <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
            {/* 矢印の直線部分 */}
            <path d={pathData} fill="none" stroke={color} strokeWidth={strokeWidth} />
            {/* 矢印の先端部分 */}
            <polygon
                points={`${endX},${endY} ${arrowHeadX1},${arrowHeadY1} ${arrowHeadX2},${arrowHeadY2}`}
                fill={color}
            />
        </svg>
    );
};

export default ArrowRenderer;
