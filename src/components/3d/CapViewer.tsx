import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, forwardRef, useImperativeHandle } from 'react';
import { CapModel } from './CapModel';
import { useTextureManager } from '@/hooks/useTextureManager';
import { CapViewerProps } from './types';

export const CapViewer = forwardRef((props: CapViewerProps, ref) => {
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
        <Environment preset="studio" intensity={0.8} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 7]} intensity={1} castShadow />
        <CapModel texture={texture} />
        <OrbitControls
          minDistance={0.5}
          maxDistance={5}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </>
    );
  };

  return (
    <Canvas id="product-canvas" camera={{ position: [0, 0, 4], fov: 35 }} shadows gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={null}>
        <CanvasContent />
      </Suspense>
    </Canvas>
  );
});