import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, forwardRef, useImperativeHandle } from 'react';
import { TshirtModel } from './TshirtModel';
import { useTextureManager } from '@/hooks/useTextureManager';
import { CommonViewerProps } from './types';

export const TshirtViewer = forwardRef((props: CommonViewerProps, ref) => {
  const { texture } = useTextureManager({
    imageSrc: props.uploadedImage,
    text: props.customText,
    textColor: props.textColor,
    fontFamily: props.textFont,
    fontSize: props.textSize,
    productColor: props.productColor,
    imageScaleX: props.imageScaleX,
    imageScaleY: props.imageScaleY,
    imageOffsetX: props.imageOffsetX,
    imageOffsetY: props.imageOffsetY,
    imageRotation: props.imageRotation,
    textureOffsetX: props.textureOffsetX,
    textScaleY: props.textScaleY,
    textOffsetX: props.textOffsetX,
    textOffsetY: props.textOffsetY,
    textRotation: props.textRotation,
  });

  const CanvasContent = () => {
    const { gl } = useThree();
    useImperativeHandle(ref, () => ({
      getCanvas: () => gl.domElement,
    }));

    return (
      <>
        <Environment preset="lobby" intensity={0.7} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <TshirtModel texture={texture} color={props.productColor} />
        <OrbitControls
          minDistance={2}
          maxDistance={10}
          enablePan={true}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </>
    );
  };

  return (
    <Canvas id="product-canvas" camera={{ position: [0, 0, 3.5], fov: 30 }} shadows gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={null}>
        <CanvasContent />
      </Suspense>
    </Canvas>
  );
});