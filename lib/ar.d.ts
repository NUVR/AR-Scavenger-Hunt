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
    Raycaster,
    Intersection,
    Quaternion,
    Vector3,
    Box3,
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

    export class ARClickability {
      constructor(sourceElement: Element);
      computeIntersects(domEvent: Event, objects: Object3D[]): Intersection[];
      onResize(): void;
      update(): Raycaster;
    }
    export class ArBaseControls {
      id: number;
      object3d: Object3D;
      constructor(object3d: Object3D);
      update(): void;
      name(): string;
      addEventListener(type: string, listener: EventListener): void;
      dispatchEvent(event: Event): void;
      hasEventListener(type: string, listener: EventListener): boolean;
      removeEventListener(type: string, listener: EventListener): void;
    }
    export class ArMarkerCloak {
      fragmentShader: string;
      markerSpaceShaderFunction: string;
      vertexShader: string;
      constructor(videoTexture: Texture);
    }
    export class ArMarkerHelper {
      object3d: Object3D;
      constructor(markerControls: ArMarkerControls);
    }
    export class ArMultiMakersLearning {
      enabled: boolean;
      subMarkersControls: ArMarkerControls[];
      constructor(
        arToolkitContext: ArToolkitContext,
        subMarkersControls: ArMarkerControls[]
      );
      computeResult(): void;
      deleteResult(): void;
      resetStats(): void;
      toJSON(): string;
    }
    export class ArMultiMarkerControls {
      parameters: {
        subMarkersControls: ArMarkerControls[];
        subMarkerPoses: any[];
        changeMatrixMode?: 'modelViewMatrix' | 'cameraTransformMatrix ';
      };
      object3d: Object3D;
      subMarkersControls: ArMarkerControls[];
      subMarkerPoses: any[];
      averageQuaternion: (
        quaterniumSum: Quaternion,
        newQuaternion: Quaternion,
        firstQuaternion: Quaternion,
        count: number,
        quaternionAverage?: Quaternion
      ) => Quaternion;
      averageVector3: (
        vector3Sum: Vector3,
        vector3: Vector3,
        count: number,
        vector3Average?: Vector3
      ) => Vector3;
      computeBoundingBox: (jsonData: string) => Box3;
      computeCenter: (jsonData: string) => Matrix4;
      fromJSON: (
        arToolkitContext: ArToolkitContext,
        parent3D: Object3D,
        markerRoot: Object3D,
        jsonData: string,
        parameters: {
          subMarkersControls: ArMarkerControls[];
          subMarkerPoses: any[];
          changeMatrixMode?: 'modelViewMatrix' | 'cameraTransformMatrix ';
        }
      ) => ArMultiMarkerControls;
      constructor(
        arToolkitContext: ArToolkitContext,
        object3d: Object3D,
        parameters: {
          subMarkersControls: ArMarkerControls[];
          subMarkerPoses: any[];
          changeMatrixMode?: 'modelViewMatrix' | 'cameraTransformMatrix ';
        }
      );
      updateSmoothedControls(
        smoothedControls: ArSmoothedControls,
        lerpsValues: number[][]
      ): void;
    }
    // ArMultiMarkerUtils: {navigateToLearnerPage: ƒ, storeDefaultMultiMarkerFile: ƒ, createDefaultMultiMarkerFile: ƒ, createDefaultMarkersControlsParameters: ƒ, storeMarkersAreaFileFromResolution: ƒ, …}
    export class ArSmoothedControls {
      object3d: Object3D;
      /**
       * `lerpPosition`: lerp coeficient for the position - between [0,1] - default to 0.8
       * `lerpQuaternion`: lerp coeficient for the quaternion - between [0,1] - default to 0.2
       * `lerpScale`: lerp coeficient for the scale - between [0,1] - default to 0.7
       * `lerpStepDelay`: delay for lerp fixed steps - in seconds - default to 1/60
       * `minVisibleDelay`: minimum delay the sub-control must be visible before this controls become visible - default to 0 seconds
       * `minUnvisibleDelay`: minimum delay the sub-control must be unvisible before this controls become unvisible - default to 0.2 seconds
       */
      parameters: {
        lerpPosition: number;
        lerpQuaternion: number;
        lerpScale: number;
        lerpStepDelay: number;
        minVisibleDelay: number;
        minUnvisibleDelay: number;
      };
      constructor(
        object3d: Object3D,
        parameters?: {
          lerpPosition?: number;
          lerpQuaternion?: number;
          lerpScale?: number;
          lerpStepDelay?: number;
          minVisibleDelay?: number;
          minUnvisibleDelay?: number;
        }
      );
      update(targetObject3d: Object3D): void;
    }
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
