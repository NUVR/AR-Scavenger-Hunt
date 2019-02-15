
declare module 'ar' {
	import { Group, Matrix, Matrix4 } from "three";

    export namespace THREEx {
        export class ArToolkitSource {
			ready: boolean
			domElement: Element
            constructor(parameters: {sourceType: string}) 
            copyElementSizeTo(element: Element)
            copySizeTo()
            domElementHeight()
            domElementWidth()
            hasMobileTorch()
            init(container: Element, onResize: () => void)
            onResize()
            onResizeElement()
            toggleMobileTorch()
        }
        export class ArMarkerControls {
			canvas: HTMLElement
            constructor(context: ArToolkitContext, marker: Group, patternParameters: {
                type: string,
                patternUrl: string,
            })
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
			arController: ArMarkerControls
            constructor(parameters: {
                cameraParametersUrl: string,
                detectionMode: string,
			})
			init(func: () => Matrix)
			getProjectionMatrix(): Matrix4
			update(element: Element)
        }
        export class ArToolkitProfile {}
        export class ArVideoInWebgl {}
        export class ArucoContext {}
        export class ArucoDebug {}
        export class ArucoMarkerGenerator {}
        export class HitTestingPlane {}
        export class HitTestingTango {}
        export class addArucoDatGui {}
    }
}