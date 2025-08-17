import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { CAMERA_FRAME_THROTTLE } from '@/lib/mediapipe/config';
import type { FaceLandmarks, Landmark } from '@/lib/mediapipe/types';

interface CameraViewProps {
	onLandmarks?: (data: FaceLandmarks) => void;
	active?: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ onLandmarks, active = false }) => {
	const device = useCameraDevice('front') ?? useCameraDevice('back');
	const frameCountRef = useRef<number>(0);
	const onLandmarksOnJS = React.useMemo(() => (onLandmarks ? Worklets.createRunOnJS(onLandmarks) : undefined), [onLandmarks]);


	// FrameProcessor nativo (worklet). Integração real MediaPipe entrará aqui.
	const frameProcessor = useFrameProcessor((frame) => {
		'worklet';
		// throttle simples por contador global
		// @ts-expect-error worklet global
		if (!global.__frameCounter) global.__frameCounter = 0;
		// @ts-expect-error worklet global
		global.__frameCounter = (global.__frameCounter + 1) | 0;
		// @ts-expect-error worklet global
		if (global.__frameCounter % CAMERA_FRAME_THROTTLE !== 0) return;

		const data: FaceLandmarks = { landmarks: [] as unknown as Landmark[], confidence: 0, timestamp: Date.now() };
		if (onLandmarksOnJS) onLandmarksOnJS(data);
	}, [onLandmarksOnJS]);

	if (!device || !active) {
		return <View style={styles.center} />;
	}

	return (
		<Camera
			style={StyleSheet.absoluteFill}
			device={device}
			isActive={active}
			frameProcessor={frameProcessor}
		/>
	);
};

const styles = StyleSheet.create({
	center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
});

export default CameraView;

