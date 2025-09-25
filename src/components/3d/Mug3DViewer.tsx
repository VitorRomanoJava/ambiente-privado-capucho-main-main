import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, forwardRef, useImperativeHandle } from 'react';
import { MugModel } from './MugModel';
import { useTextureManager } from '@/hooks/useTextureManager';
import { CommonViewerProps } from './types';

// O componente agora está envolvido com forwardRef para receber uma ref
export const Mug3DViewer = forwardRef((props: CommonViewerProps, ref) => {
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

  // Componente interno para acessar o contexto do R3F e expor o canvas
  const CanvasContent = () => {
    const { gl } = useThree();
    useImperativeHandle(ref, () => ({
      getCanvas: () => gl.domElement,
    }));

    return (
      <>
        <Environment preset="studio" intensity={0.8} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 10, 7.5]} intensity={1} castShadow />
        <MugModel texture={texture} />
        <OrbitControls
          minDistance={1.5}
          maxDistance={5}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </>
    );
  };

  return (
    // A propriedade gl={{ preserveDrawingBuffer: true }} foi adicionada
    <Canvas id="mug-canvas" camera={{ position: [10, 0, 4], fov: 5 }} shadows gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={null}>
        <CanvasContent />
      </Suspense>
    </Canvas>
  );
});