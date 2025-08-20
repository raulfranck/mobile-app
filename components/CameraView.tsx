import React, { useRef } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core';
import { CAMERA_FRAME_THROTTLE, mediapipeConfig } from '@/lib/mediapipe/config';
import type { FaceLandmarks, Landmark } from '@/lib/mediapipe/types';
import { processFrameWorklet } from '@/lib/mediapipe/frameProcessor';
import { initializeFaceMesh } from '@/lib/mediapipe/faceDetector';
import YawnDetector from '@/lib/onnx/yawnDetector';

interface CameraViewProps {
	onLandmarks?: (data: FaceLandmarks) => void;
	active?: boolean;
	onRequestClose?: () => void;
	closeLabel?: string;
}

const CameraView: React.FC<CameraViewProps> = ({ onLandmarks, active = false, onRequestClose, closeLabel = 'Parar' }) => {
	const device = useCameraDevice('front') ?? useCameraDevice('back');
	const format = React.useMemo(() => {
		if (!device || !('formats' in device)) return undefined as unknown as undefined;
		// selecionar 640x480 se existir
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const fmts: any[] = (device as unknown as { formats?: any[] }).formats ?? [];
		const preferred = fmts.find((f) => f?.videoWidth === 640 && f?.videoHeight === 480);
		return preferred ?? fmts[0];
	}, [device]);
	const frameCountRef = useRef<number>(0);
	const onLandmarksOnJS = React.useMemo(() => (onLandmarks ? Worklets.createRunOnJS(onLandmarks) : undefined), [onLandmarks]);
	const debugLog = React.useMemo(() => Worklets.createRunOnJS((w: number, h: number, pf: string) => {
		// eslint-disable-next-line no-console
		console.log('[Frame]', w, h, pf);
	}), []);
	
	// Removido: processamento no thread JS (manter apenas worklet)

	// ONNX YawnDetector
	const yawnDetectorRef = React.useRef<YawnDetector | null>(null);
	const onPredictOnJS = React.useMemo(() => Worklets.createRunOnJS((label: string) => {
		// No futuro: atualizar UI/estado de sessão
		console.log('Predição:', label);
	}), []);

	React.useEffect(() => {
		if (active) {
			initializeFaceMesh({
				runningMode: mediapipeConfig.runningMode,
				maxNumFaces: mediapipeConfig.maxNumFaces,
				minDetectionConfidence: mediapipeConfig.minDetectionConfidence,
				minTrackingConfidence: mediapipeConfig.minTrackingConfidence,
			});
		}
	}, [active]);


	// FrameProcessor: throttle + plugin MediaPipe (worklet)
	const frameProcessor = useFrameProcessor((frame) => {
		'worklet';
		// debug básico
		if (debugLog) debugLog(frame.width as unknown as number, frame.height as unknown as number, String(frame.pixelFormat));
		// processar 1 a cada N frames
		processFrameWorklet(frame, CAMERA_FRAME_THROTTLE, onLandmarksOnJS);
	}, []);

	if (!device || !active) {
		return <View style={styles.center} />;
	}

	return (
		<View style={StyleSheet.absoluteFill}>
			<Camera
				style={StyleSheet.absoluteFill}
				device={device}
				isActive={active}
				format={format}
				frameProcessor={frameProcessor}
				pixelFormat="yuv"
				onError={(e) => {
					// Fechar câmera e informar usuário quando o SO restringir a câmera
					const code: string = (e as unknown as { code?: string })?.code ?? '';
					if (code.includes('camera-is-restricted')) {
						Alert.alert(
							'Câmera restrita pelo sistema',
							'Acesso à câmera está desativado pelo sistema. Verifique: Configurações > Privacidade > Acesso à Câmera (ativar), e permissões do app.',
						);
						if (onRequestClose) onRequestClose();
					} else {
						Alert.alert('Erro da Câmera', e?.message ?? 'Erro desconhecido');
					}
				}}
			/>
			{onRequestClose && (
				<View style={styles.topBar}>
					<View style={styles.topBarContent}>
						<View style={styles.spacer} />
						<View style={styles.actions}>
							<View style={styles.actionButton}>
								{/* Using Text-only button for simplicity */}
								{/* eslint-disable-next-line react-native/no-inline-styles */}
								<Text onPress={onRequestClose} style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
									{closeLabel}
								</Text>
							</View>
						</View>
					</View>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
	topBar: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		paddingTop: 32,
		paddingHorizontal: 16,
		paddingBottom: 12,
		backgroundColor: 'rgba(0,0,0,0.35)'
	},
	 topBarContent: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	spacer: { width: 24, height: 24 },
	actions: { flexDirection: 'row', gap: 12 },
	actionButton: {
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 8,
		backgroundColor: 'rgba(255,255,255,0.15)'
	},
});

export default CameraView;

