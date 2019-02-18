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
    type SubMarkersControls = {
      parameters: {};
      poseMatrix: number[];
    };
    type TrackingBackend = 'artoolkit' | 'aruco' | 'tango';
    type TrackingFile = {
      meta: {
        createdBy: string;
        createdAt: string;
      };
      trackingBackend: TrackingBackend;
      subMarkersControls: SubMarkersControls[];
    };
    type MarkerControlsType = 'pattern' | 'barcode' | 'unknown';
    type MatrixMode = 'modelViewMatrix' | 'cameraTransformMatrix';
    type DetectionMode = 'color' | 'color_and_matrix' | 'mono' | 'mono_and_matrix';

    export class ArToolkitContext {
      baseURL: string;
      REVISION: string;
      arController: ArMarkerControls;
      constructor(parameters: {
        cameraParametersUrl: string;
        detectionMode: DetectionMode;
        trackingBackend?: TrackingBackend;
        debug?: boolean;
        maxDetectionRate?: number;
        canvasWidth?: number;
        canvasHeight?: number;
        patternRatio?: number;
        imageSmoothingEnabled?: boolean;
      });
      createDefaultCamera(trackingBackend: TrackingBackend): Camera;
      init(onCompleted: () => Matrix): void;
      getProjectionMatrix(): Matrix4;
      update(srcElement: Element): boolean;
      addMarker(arMarkerControls: ArMarkerControls): void;
      removeMarker(arMarkerControls: ArMarkerControls): void;
    }
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
      onResize(arToolkitContext: ArToolkitContext, renderer: Renderer, camera: Camera): void;
      onResizeElement(): void;
      toggleMobileTorch(): void;
    }
    export class ArMarkerControls extends ArBaseControls {
      canvas: HTMLElement;
      constructor(
        context: ArToolkitContext,
        object3d: Object3D,
        parameters: {
          size?: number;
          type: MarkerControlsType;
          patternUrl?: string;
          barcodeValue?: string;
          // change matrix mode - [modelViewMatrix, cameraTransformMatrix]
          changeMatrixMode?: MatrixMode;
          // minimal confidence in the marker recognition - between [0, 1] - default to 1
          minConfidence?: number;
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
      subMarkersControls: SubMarkersControls[];
      constructor(arToolkitContext: ArToolkitContext, subMarkersControls: SubMarkersControls[]);
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
      updateSmoothedControls(smoothedControls: ArSmoothedControls, lerpsValues: number[][]): void;
    }
    export class ArMultiMarkerUtils {
      buildMarkersAreaFileFromResolution: (
        trackingBackend: TrackingBackend,
        resolutionW: number,
        resolutionH: number
      ) => TrackingFile;
      buildSubMarkerControls: (
        layout: 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright',
        positionX: number,
        positionZ: number
      ) => SubMarkersControls;
      createDefaultMarkersControlsParameters: (
        trackingBackend: TrackingBackend
      ) => { type: MarkerControlsType; patternUrl?: string; barcodeValue?: number }[];
      createDefaultMultiMarkerFile: (trackingBackend: TrackingBackend) => TrackingFile;
      navigateToLearnerPage: (learnerBaseURL: string, trackingBackend: TrackingBackend) => void;
      storeDefaultMultiMarkerFile: (trackingBackend: TrackingBackend) => void;
      storeMarkersAreaFileFromResolution: (
        trackingBackend: TrackingBackend,
        resolutionW: number,
        resolutionH: number
      ) => void;
      constructor(trackingBackend: TrackingBackend);
    }

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
    export class ArToolkitProfile {
      defaultMarkerParameters: {
        type: MarkerControlsType;
        patternUrl?: string;
        barcodeValue?: number;
        changeMatrixMode: MatrixMode;
      };
      sourceParameters: {
        sourceType: 'webcam' | 'video' | 'image';
        sourceUrl?: string;
      };
      contextParameters: {
        detectionMode: DetectionMode;
        cameraParametersUrl: string;
        canvasWidth: number;
        canvasHeight: number;
        maxDetectionRate: number;
      };
      changeMatrixMode: (changeMatrixMode: MatrixMode) => ArToolkitProfile;
      checkIfValid: () => ArToolkitProfile;
      defaultMarker: (trackingBackend: TrackingBackend) => ArToolkitProfile;
      performance: (
        label: 'default' | 'desktop-fast' | 'desktop-normal' | 'phone-normal' | 'phone-slow'
      ) => ArToolkitProfile;
      reset: () => ArToolkitProfile;
      sourceImage: (url: string) => ArToolkitProfile;
      sourceVideo: (url: string) => ArToolkitProfile;
      sourceWebcam: () => ArToolkitProfile;
      trackingBackend: (trackingBackend: TrackingBackend) => ArToolkitProfile;
      trackingMethod: (trackingMethod: any) => ArToolkitProfile;
    }
    export class ArVideoInWebgl {
      constructor(videoTexture: Texture);
    }
    export class ArucoContext {
      canvas: HTMLCanvasElement;
      detector: any; // AR.Detector
      constructor(parameters?: { debug?: boolean; canvasWidth: number; canvasHeight: number });
      detect(videoElement: HTMLVideoElement): any; // DetectedMarkers
      setSize(width: number, height: number): void;
      updateObject3D(
        object3D: Object3D,
        arucoPosit: any,
        markerSize: number,
        detectedMarker: any
      ): void;
    }
    export class ArucoDebug {
      arucoContext: ArucoContext;
      canvasElement: HTMLCanvasElement;
      constructor(arucoContext: ArucoContext);
      clear(): void;
      copyCVImage2ImageData(cvImage: any, imageData: ImageData): void;
      drawCVImage(cvImage: any): void;
      drawContours(
        contours: any[],
        x: number,
        y: number,
        width: number,
        height: number,
        fn: (hole: string) => string
      ): void;
      drawContoursCandidates(): void;
      drawContoursContours(): void;
      drawContoursPolys(): void;
      drawDetectorGrey(): void;
      drawDetectorThreshold(): void;
      drawMarkerCorners(markers: any[]): void;
      drawMarkerIDs(markers: any[]): void;
      drawVideo(videoElement: HTMLVideoElement): void;
      setSize(width: number, height: number): void;
    }
    export class ArucoMarkerGenerator {
      createCanvas(markerId: string, width: number): HTMLCanvasElement;
      createImage(markerId: string, width: number): HTMLImageElement;
      createSVG(markerId: string, svgSize: number): HTMLDivElement;
    }
  }
}
