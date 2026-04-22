export const sampleProjectLesson = {
	id: 'project_demo_01',
	title: '프로젝트 탐험',
	subtitle: '여러 프로젝트를 같은 플레이어로 실행하기',
	stages: [
		{
			id: 'rgb-stage',
			title: 'AI는 색을 숫자로 이해해요',
			subtitle: 'RGB 실험',
			moduleType: 'rgb-lab',
			missionTitle: '색을 바꾸며 RGB 값을 살펴보세요',
			missionText:
				'슬라이더를 움직이며 색이 어떻게 변하는지 관찰하고, AI가 색을 숫자로 읽는다는 점을 이해해 보세요.',
			conceptTitle: 'AI는 색을 숫자로 읽어요',
			nextPreviewTitle: '다음 단계: 픽셀을 숫자로 표현하기',
			nextPreviewText: '작은 점의 모음인 그림도 숫자 배열로 바꿔볼 수 있어요.',
			initialData: {
				rgb: { r: 255, g: 165, b: 0 },
				touched: false
			},
			completion: {
				type: 'field-truthy',
				field: 'touched'
			}
		},
		{
			id: 'pixel-stage',
			title: '그림도 숫자로 표현할 수 있어요',
			subtitle: '픽셀 하트 실험',
			moduleType: 'pixel-heart',
			missionTitle: '픽셀을 바꿔 하트 모양을 만들어 보세요',
			missionText: '0과 255를 바꾸며 그림이 어떻게 표현되는지 살펴보세요.',
			conceptTitle: '그림은 숫자 칸의 모음이에요',
			nextPreviewTitle: '다음 단계: 자율주행 센서 고르기',
			nextPreviewText: '자동차가 주변을 보려면 어떤 센서가 필요할까요?',
			initialData: {
				grid: [
					[0, 0, 0, 0, 255, 255, 0, 255, 255, 0, 0, 0],
					[0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 0, 0],
					[0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0],
					[0, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0],
					[0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 0, 0],
					[0, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0],
					[0, 0, 0, 0, 0, 255, 255, 255, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0]
				],
				touchedCount: 0
			},
			completion: {
				type: 'count-gte',
				field: 'touchedCount',
				value: 3
			}
		},
		{
			id: 'sensor-stage',
			title: '자율주행차에 필요한 센서 고르기',
			subtitle: '센서 선택',
			moduleType: 'sensor-select',
			missionTitle: '상황에 맞는 센서를 선택해 보세요',
			missionText:
				'카메라, 라이다, 초음파 센서, GPS, IMU 중 자율주행차에 필요한 센서를 골라 보세요.',
			conceptTitle: '자율주행차는 여러 센서를 함께 써요',
			nextPreviewTitle: '다음 단계: 센서를 배치해 보기',
			nextPreviewText: '선택한 센서를 자동차 어디에 둘지 정하게 됩니다.',
			initialData: {
				selectedSensors: []
			},
			completion: {
				type: 'array-length-gte',
				field: 'selectedSensors',
				value: 3
			}
		}
	]
};
