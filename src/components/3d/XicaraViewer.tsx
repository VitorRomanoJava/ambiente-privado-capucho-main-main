import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, forwardRef, useImperativeHandle } from 'react';
import { XicaraModel } from './XicaraModel';
import { useTextureManager } from '@/hooks/useTextureManager';
import { CommonViewerProps } from './types';

export const XicaraViewer = forwardRef((props: CommonViewerProps, ref) => {
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
        <Environment preset="studio" intensity={0.1} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 7.5]} intensity={1} castShadow />
        <XicaraModel texture={texture} productColor={''} />
        <OrbitControls
          minDistance={1.5}
          maxDistance={45}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </>
    );
  };

  return (
    <Canvas id="product-canvas" camera={{ position: [0, 0, 20], fov: 55 }} shadows gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={null}>
        <CanvasContent />
      </Suspense>
    </Canvas>
  );
});