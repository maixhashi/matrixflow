import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDataBaseIconPositions, setFlowstepPositions } from '../store/positionSlice';

const PositionUpdater = () => {
  const dispatch = useDispatch();

  const updatePositions = () => {
    // データベースアイコンの座標を取得
    const dataBaseIcons = Array.from(document.querySelectorAll('.dataBaseIcon'));
    const dataBaseIconPositions = dataBaseIcons.map((icon) => {
      const rect = icon.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
      };
    });

    // フローステップの座標を取得
    const flowSteps = Array.from(document.querySelectorAll('.Flowstep'));
    const flowstepPositions = flowSteps.map((step) => {
      const rect = step.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
      };
    });

    // Redux ストアに反映
    dispatch(setDataBaseIconPositions(dataBaseIconPositions));
    dispatch(setFlowstepPositions(flowstepPositions));
  };

  useEffect(() => {
    // 初回ロード時に座標を更新
    updatePositions();

    // リサイズイベントを監視
    window.addEventListener('resize', updatePositions);

    return () => {
      window.removeEventListener('resize', updatePositions);
    };
  }, []);

  return null; // UIには表示しない
};

export default PositionUpdater;
