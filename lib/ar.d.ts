declare module 'ar' {
  import {
    Group,
    Matrix,
    Matrix4,
    Renderer,
    Camera,
    Texture,
    REVISION,
    Object3D,
  } from 'three';

  export namespace THREEx {
    export class ArToolkitSource {
      ready: boolean;
      domElement: Element;
      constructor(parameters: {
        sourceType: 'webcam' | 'image' | 'video';
        sourceUrl?: string;
        deviceId?: number;
        sourceWidth?: number;
        sourceHeight?: number;
        displayWidth?: number;
        displayHeight?: number;
      });
      copyElementSizeTo(otherElement: Element): void;
      copySizeTo(): void;
      domElementHeight(): number;
      domElementWidth(): number;
      hasMobileTorch(): boolean;
      init(
        container: Element,
        onReady: () => void,
        onError?: (error: any) => void
      ): ArToolkitSource;
      onResize(
        arToolkitContext: ArToolkitContext,
        renderer: Renderer,
        camera: Camera
      ): void;
      onResizeElement(): void;
      toggleMobileTorch(): void;
    }
    export class ArMarkerControls {
      canvas: HTMLElement;
      constructor(
        context: ArToolkitContext,
        object3d: Object3D,
        parameters: {
          size?: number;
          type: 'pattern' | 'barcode' | 'unknown';
          patternUrl?: string;
          barcodeValue?: string;
          // change matrix mode - [modelViewMatrix, cameraTransformMatrix]
          changeMatrixMode?: 'modelViewMatrix' | 'cameraTransformMatrix';
          // minimal confidence in the marke recognition - between [0, 1] - default to 1
          minConfidence?: 0.6;
        }
      );
      dispose(): void;
      /**
       * provide a name for a marker
       * - silly heuristic for now
       * - should be improved
       */
      name(): string;
      /**
       * When you actually got a new modelViewMatrix, you need to perfom a whole bunch
       * of things. it is done here.
       */
      updateWithModelViewMatrix(modelViewMatrix: Matrix4): void;
    }

    export class ARClickability {}
    export class ArBaseControls {}
    export class ArMarkerCloak {}
    export class ArMarkerHelper {}
    export class ArMultiMakersLearning {}
    export class ArMultiMarkerControls {}
    // ArMultiMarkerUtils: {navigateToLearnerPage: ƒ, storeDefaultMultiMarkerFile: ƒ, createDefaultMultiMarkerFile: ƒ, createDefaultMarkersControlsParameters: ƒ, storeMarkersAreaFileFromResolution: ƒ, …}
    export class ArSmoothedControls {}
    export class ArToolkitContext {
      baseURL: string;
      REVISION: string;
      arController: ArMarkerControls;
      constructor(parameters: {
        cameraParametersUrl: string;
        detectionMode:
          | 'color'
          | 'color_and_matrix'
          | 'mono'
          | 'mono_and_matrix';
        trackingBackend?: 'artoolkit' | 'aruco' | 'tango';
        debug?: boolean;
        maxDetectionRate?: number;
        canvasWidth?: number;
        canvasHeight?: number;
        patternRatio?: number;
        imageSmoothingEnabled?: boolean;
      });
      createDefaultCamera(
        trackingBackend: 'artoolkit' | 'aruco' | 'tango'
      ): Camera;
      init(onCompleted: () => Matrix): void;
      getProjectionMatrix(): Matrix4;
      update(srcElement: Element): boolean;
      addMarker(arMarkerControls: ArMarkerControls): void;
      removeMarker(arMarkerControls: ArMarkerControls): void;
    }
    export class ArToolkitProfile {}
    export class ArVideoInWebgl {
      constructor(videoTexture: Texture);
    }
    export class ArucoContext {}
    export class ArucoDebug {}
    export class ArucoMarkerGenerator {}
    export class HitTestingPlane {}
    export class HitTestingTango {}
    export class addArucoDatGui {}
  }
}
